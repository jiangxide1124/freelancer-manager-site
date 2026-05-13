import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  isAdminAuthorized,
  unauthorizedResponse,
  corsPreflightResponse,
  ADMIN_CORS_HEADERS,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GITHUB_REPO = "jiangxide1124/freelancer-manager-releases";
const NETWORK_TIMEOUT_MS = 10_000;

export function OPTIONS() {
  return corsPreflightResponse();
}

interface GitHubAsset {
  name: string;
  size: number;
  download_count: number;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  body: string;
  assets: GitHubAsset[];
}

interface ResendEmail {
  id: string;
  to: string[];
  subject: string;
  last_event: string;
  created_at: string;
}

interface SubscriptionAmount {
  amount_krw: number;
}

interface LicenseEvent {
  event_type: string;
  created_at: string;
}

// ─── GitHub Releases ───
async function fetchGitHubReleases() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!response.ok) {
      return { error: `HTTP ${response.status}`, releases: [], totalDownloads: 0 };
    }

    const data = (await response.json()) as GitHubRelease[];
    const releases = data.map((r) => ({
      tag: r.tag_name,
      name: r.name,
      publishedAt: r.published_at,
      prerelease: r.prerelease,
      assets: r.assets.map((a) => ({
        name: a.name,
        downloadCount: a.download_count,
        sizeKb: Math.round(a.size / 1024),
      })),
      totalDownloads: r.assets.reduce((s, a) => s + a.download_count, 0),
    }));

    const totalDownloads = releases.reduce((s, r) => s + r.totalDownloads, 0);

    return {
      releases,
      totalDownloads,
      latestVersion: releases[0]?.tag ?? null,
    };
  } catch (err) {
    const e = err as Error;
    return { error: e.name === "AbortError" ? "timeout" : e.message, releases: [], totalDownloads: 0 };
  }
}

// ─── Resend Emails ───
async function fetchResendStats() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { error: "RESEND_API_KEY not configured", emails: [] };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);

    const response = await fetch("https://api.resend.com/emails?limit=100", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      return { error: `HTTP ${response.status}`, emails: [] };
    }

    const json = await response.json();
    const emails: ResendEmail[] = json.data ?? [];

    // 지난 7일 필터
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentEmails = emails.filter(
      (e) => new Date(e.created_at).getTime() >= weekAgo
    );

    // 상태별 집계
    const countByStatus = (status: string) =>
      recentEmails.filter((e) => e.last_event === status).length;

    const total = recentEmails.length;
    const delivered = countByStatus("delivered");
    const bounced = countByStatus("bounced");
    const failed = countByStatus("failed") + countByStatus("complained");
    const sent = countByStatus("sent"); // 발송됐지만 아직 도달 확인 X
    const delayed = countByStatus("delivery_delayed");
    const successRate = total > 0 ? Math.round((delivered / total) * 1000) / 10 : 0;

    return {
      total,
      delivered,
      bounced,
      failed,
      sent,
      delayed,
      successRate,
      recent: emails.slice(0, 20).map((e) => ({
        id: e.id,
        to: e.to.join(", "),
        subject: e.subject,
        status: e.last_event,
        createdAt: e.created_at,
      })),
    };
  } catch (err) {
    const e = err as Error;
    return { error: e.name === "AbortError" ? "timeout" : e.message };
  }
}

// ─── Supabase 통계 (구독 관리에서도 사용되는 데이터 + 추가 분석) ───
async function fetchSupabaseStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const [
      totalCustomersRes,
      monthSignupsRes,
      weekSignupsRes,
      activeSubsRes,
      inactiveSubsRes,
      activeLicensesRes,
      activeAmountsRes,
      eventsRes,
    ] = await Promise.all([
      supabaseAdmin.from("customers").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monthStart),
      supabaseAdmin
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart),
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .in("status", ["active", "trialing"]),
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .in("status", ["canceled", "expired", "past_due"]),
      supabaseAdmin
        .from("licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabaseAdmin.from("subscriptions").select("amount_krw").eq("status", "active"),
      supabaseAdmin
        .from("license_events")
        .select("event_type, created_at")
        .gte("created_at", weekStart)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const monthlyRevenue = (activeAmountsRes.data as SubscriptionAmount[] ?? []).reduce(
      (s, x) => s + (x.amount_krw ?? 0),
      0
    );

    // 이벤트 타입별 집계
    const events = (eventsRes.data as LicenseEvent[]) ?? [];
    const eventsByType: Record<string, number> = {};
    for (const e of events) {
      eventsByType[e.event_type] = (eventsByType[e.event_type] ?? 0) + 1;
    }

    return {
      totalCustomers: totalCustomersRes.count ?? 0,
      monthSignups: monthSignupsRes.count ?? 0,
      weekSignups: weekSignupsRes.count ?? 0,
      activeSubscriptions: activeSubsRes.count ?? 0,
      inactiveSubscriptions: inactiveSubsRes.count ?? 0,
      activeLicenses: activeLicensesRes.count ?? 0,
      monthlyRevenue,
      eventsLastWeek: events.length,
      eventsByType,
    };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * GET /api/admin/ops
 * 운영 대시보드 — GitHub + Resend + Supabase 데이터 통합 조회
 *
 * 인증: X-Admin-Secret
 */
export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  try {
    const [github, resend, supabase] = await Promise.all([
      fetchGitHubReleases(),
      fetchResendStats(),
      fetchSupabaseStats(),
    ]);

    return NextResponse.json(
      {
        github,
        resend,
        supabase,
        timestamp: new Date().toISOString(),
      },
      { headers: ADMIN_CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `서버 오류: ${(err as Error).message}` },
      { status: 500, headers: ADMIN_CORS_HEADERS }
    );
  }
}
