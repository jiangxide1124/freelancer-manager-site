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

export function OPTIONS() {
  return corsPreflightResponse();
}

/**
 * GET /api/admin/stats
 * 구독자 통계 — admin 프로그램에서 호출
 *
 * 인증: X-Admin-Secret 헤더 (Vercel 환경변수 ADMIN_API_SECRET과 일치)
 *
 * 응답:
 *   totalCustomers       : 누적 고객 수
 *   monthSignups         : 이번 달 신규 가입자
 *   activeSubscriptions  : 활성 구독자 (active + trialing)
 *   inactiveSubscriptions: 만료/취소 사용자
 *   monthlyRevenue       : 활성 구독자 월 매출 합계 (KRW)
 *   activeLicenses       : 활성 시리얼 키 수
 */
export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 병렬 쿼리로 성능 최적화
    const [
      totalCustomersRes,
      monthSignupsRes,
      activeSubsRes,
      inactiveSubsRes,
      activeAmountsRes,
      activeLicensesRes,
    ] = await Promise.all([
      supabaseAdmin.from("customers").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monthStart),
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .in("status", ["active", "trialing"]),
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .in("status", ["canceled", "expired", "past_due"]),
      supabaseAdmin
        .from("subscriptions")
        .select("amount_krw")
        .eq("status", "active"),
      supabaseAdmin
        .from("licenses")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

    const monthlyRevenue = (activeAmountsRes.data ?? []).reduce(
      (sum, s) => sum + (s.amount_krw ?? 0),
      0
    );

    return NextResponse.json(
      {
        totalCustomers: totalCustomersRes.count ?? 0,
        monthSignups: monthSignupsRes.count ?? 0,
        activeSubscriptions: activeSubsRes.count ?? 0,
        inactiveSubscriptions: inactiveSubsRes.count ?? 0,
        monthlyRevenue,
        activeLicenses: activeLicensesRes.count ?? 0,
        timestamp: new Date().toISOString(),
      },
      { headers: ADMIN_CORS_HEADERS }
    );
  } catch (err) {
    console.error("Stats endpoint error:", err);
    return NextResponse.json(
      { error: `통계 조회 오류: ${(err as Error).message}` },
      { status: 500, headers: ADMIN_CORS_HEADERS }
    );
  }
}
