import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  checkAndRecordRateLimit,
  extractClientIp,
  cleanupOldRateLimits,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit 정책 (이메일 발송 안 하니 inbox 보호 룰은 의미 축소, 그러나 enumeration 방지엔 유효)
const IP_LIMIT_PER_HOUR = 10;
const EMAIL_LIMIT_PER_HOUR = 5;
const WINDOW_MINUTES = 60;

interface RecoveredLicense {
  key: string;
  status: string;
  expiresAt: string | null;
}

/**
 * POST /api/license/recover
 * 시리얼 키 찾기 — 이메일로 활성 키를 화면에 직접 반환
 *
 * 정책 (이메일 발송 시스템 제거 후):
 *   - 응답에 키를 직접 포함 (이메일 발송 안 함)
 *   - Rate limit으로 enumeration 공격 완화
 *   - 등록 안 된 이메일은 명확한 메시지 반환 (사용자 UX 우선)
 *
 * Body: { email: string }
 * Returns: { success: boolean, licenses?: RecoveredLicense[], error?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const rawEmail = String(body.email ?? "").trim().toLowerCase();

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "올바른 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    // ── Rate limit 체크 ──
    const clientIp = extractClientIp(request.headers);

    const ipCheck = await checkAndRecordRateLimit(
      "recover_ip",
      clientIp,
      IP_LIMIT_PER_HOUR,
      WINDOW_MINUTES
    );
    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        },
        { status: 429 }
      );
    }

    const emailCheck = await checkAndRecordRateLimit(
      "recover_email",
      rawEmail,
      EMAIL_LIMIT_PER_HOUR,
      WINDOW_MINUTES
    );
    if (!emailCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "해당 이메일로 너무 자주 조회했습니다. 1시간 후 다시 시도해주세요.",
        },
        { status: 429 }
      );
    }

    // 1% 확률로 옛 rate limit 레코드 청소
    if (Math.random() < 0.01) {
      cleanupOldRateLimits().catch(() => {});
    }

    // 1. 고객 조회
    const { data: customer, error: lookupError } = await supabaseAdmin
      .from("customers")
      .select("id, name")
      .eq("email", rawEmail)
      .maybeSingle();

    if (lookupError) {
      console.error("Customer lookup error:", lookupError);
      return NextResponse.json(
        {
          success: false,
          error: "조회 중 오류가 발생했습니다. 카카오톡으로 문의해주세요.",
        },
        { status: 500 }
      );
    }

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "이 이메일로 발급된 시리얼 키가 없습니다. 메인 화면의 \"베타 무료로 시작하기\"로 새로 신청해주세요.",
        },
        { status: 404 }
      );
    }

    // 2. 활성 라이선스 조회
    const { data: licenses, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .select("id, key, status, expires_at, created_at")
      .eq("customer_id", customer.id)
      .in("status", ["active", "suspended"])
      .order("created_at", { ascending: false });

    if (licenseError) {
      console.error("License lookup error:", licenseError);
      return NextResponse.json(
        {
          success: false,
          error: "조회 중 오류가 발생했습니다. 카카오톡으로 문의해주세요.",
        },
        { status: 500 }
      );
    }

    if (!licenses || licenses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "이 이메일에 활성 시리얼 키가 없습니다.",
        },
        { status: 404 }
      );
    }

    // 3. 로깅 (감사 추적) — 비동기
    for (const license of licenses) {
      supabaseAdmin
        .from("license_events")
        .insert({
          license_id: license.id,
          event_type: "recovery_requested",
          ip_address:
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
          user_agent: request.headers.get("user-agent") ?? null,
          metadata: { email: rawEmail, method: "screen-direct" },
        })
        .then(() => {}, () => {});
    }

    // 4. 키를 응답에 직접 포함
    const recovered: RecoveredLicense[] = licenses.map((l) => ({
      key: l.key,
      status: l.status,
      expiresAt: l.expires_at,
    }));

    return NextResponse.json(
      {
        success: true,
        licenses: recovered,
        message: `${recovered.length}개의 시리얼 키를 찾았습니다.`,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("Recover endpoint error:", err);
    return NextResponse.json(
      {
        success: false,
        error: `서버 오류: ${message}`,
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "POST 메소드만 지원합니다." },
    { status: 405 }
  );
}
