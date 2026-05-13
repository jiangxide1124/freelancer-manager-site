import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLicenseRecoveryEmail } from "@/lib/resend";
import {
  checkAndRecordRateLimit,
  extractClientIp,
  cleanupOldRateLimits,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit 정책
const IP_LIMIT_PER_HOUR = 10;       // IP당 시간당 10번 (서버 부하 방지)
const EMAIL_LIMIT_PER_HOUR = 3;     // 이메일당 시간당 3번 (수신자 inbox 보호)
const WINDOW_MINUTES = 60;

/**
 * POST /api/license/recover
 * 시리얼 키 찾기 — 이메일로 활성 키를 재발송
 *
 * 보안:
 *  - 이메일이 DB에 있든 없든 같은 응답 반환 (열거 공격 방지)
 *  - 키 자체를 응답에 포함하지 않음 (반드시 이메일로만 전달)
 *
 * Body: { email: string }
 * Returns: { success: boolean, message: string }
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

    // 이메일 기반 안내 메시지 (DB 존재 여부 노출 X)
    const genericResponse = {
      success: true,
      message:
        "해당 이메일로 발급된 시리얼 키가 있다면 이메일로 다시 발송했습니다. 메일함을 확인해주세요. (스팸함도 확인)",
    };

    // ── Rate limit 체크 ──
    const clientIp = extractClientIp(request.headers);

    // 1) IP rate limit (서버 부하 방지) — 너무 자주면 명시적 429
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

    // 2) 이메일 rate limit (수신자 inbox 보호) — 한도 초과 시 조용히 성공 응답
    //    (실제로는 발송 안 함. 공격자에게 한도 정보 노출 X)
    const emailCheck = await checkAndRecordRateLimit(
      "recover_email",
      rawEmail,
      EMAIL_LIMIT_PER_HOUR,
      WINDOW_MINUTES
    );
    if (!emailCheck.allowed) {
      return NextResponse.json(genericResponse, { status: 200 });
    }

    // 1% 확률로 옛 rate limit 레코드 청소 (비동기, 실패 무시)
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
      // 조용히 일반 응답 (보안)
      return NextResponse.json(genericResponse, { status: 200 });
    }

    if (!customer) {
      // 등록 안 된 이메일도 같은 응답 (보안)
      return NextResponse.json(genericResponse, { status: 200 });
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
      return NextResponse.json(genericResponse, { status: 200 });
    }

    if (!licenses || licenses.length === 0) {
      // 키 없음 — 같은 응답 (보안)
      return NextResponse.json(genericResponse, { status: 200 });
    }

    // 3. 이메일 발송
    const emailResult = await sendLicenseRecoveryEmail({
      to: rawEmail,
      name: customer.name,
      licenses: licenses.map((l) => ({
        key: l.key,
        status: l.status,
        expiresAt: l.expires_at,
      })),
    });

    if (!emailResult.success) {
      console.error("Recovery email send failed:", emailResult.error);
      // 그래도 일반 응답 반환 (사용자에게 실패 노출 X)
      return NextResponse.json(genericResponse, { status: 200 });
    }

    // 4. 로깅 (감사 추적) — 비동기, 실패 무시
    for (const license of licenses) {
      supabaseAdmin
        .from("license_events")
        .insert({
          license_id: license.id,
          event_type: "recovery_requested",
          ip_address:
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
          user_agent: request.headers.get("user-agent") ?? null,
          metadata: { email: rawEmail },
        })
        .then(() => {}, () => {});
    }

    return NextResponse.json(genericResponse, { status: 200 });
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
