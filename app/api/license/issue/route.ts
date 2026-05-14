import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateLicenseKey } from "@/lib/license";
import { sendLicenseKeyEmail } from "@/lib/resend";
import {
  checkAndRecordRateLimit,
  extractClientIp,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 같은 IP에서 시간당 5번까지만 신청 허용 (베타 스팸 방지)
const ISSUE_IP_LIMIT_PER_HOUR = 5;
const ISSUE_WINDOW_MINUTES = 60;

/**
 * POST /api/license/issue
 * 베타 신청자에게 시리얼 키를 발급하고 이메일 발송
 *
 * Body: { email: string, name?: string, phone?: string }
 * Returns: { success: boolean, license_key?: string, error?: string }
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
    const name = body.name ? String(body.name).trim().slice(0, 60) : null;
    const phone = body.phone ? String(body.phone).trim().slice(0, 30) : null;

    // 이메일 검증
    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "올바른 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    // Rate limit (IP 기준 — 베타 신청 스팸 방지)
    const clientIp = extractClientIp(request.headers);
    const ipCheck = await checkAndRecordRateLimit(
      "issue_ip",
      clientIp,
      ISSUE_IP_LIMIT_PER_HOUR,
      ISSUE_WINDOW_MINUTES
    );
    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `요청이 너무 많습니다. ${ISSUE_WINDOW_MINUTES}분 후 다시 시도해주세요.`,
        },
        { status: 429 }
      );
    }

    // 1. 기존 고객 확인 (이메일 기준)
    let customerId: string;
    const { data: existingCustomer, error: lookupError } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", rawEmail)
      .maybeSingle();

    if (lookupError) {
      console.error("Customer lookup error:", lookupError);
      return NextResponse.json(
        {
          success: false,
          error: `고객 조회 오류: ${lookupError.message}${lookupError.code ? ` (code: ${lookupError.code})` : ""}`,
        },
        { status: 500 }
      );
    }

    if (existingCustomer) {
      customerId = existingCustomer.id;

      // 같은 이메일로 이미 활성 라이선스가 있는지 확인
      const { data: existingLicense } = await supabaseAdmin
        .from("licenses")
        .select("id, key")
        .eq("customer_id", customerId)
        .eq("status", "active")
        .maybeSingle();

      if (existingLicense) {
        return NextResponse.json(
          {
            success: false,
            error:
              "이미 발급된 시리얼 키가 있습니다. 이메일을 확인하시거나 카카오톡 오픈채팅으로 문의해주세요.",
          },
          { status: 409 }
        );
      }
    } else {
      // 2. 새 고객 생성
      const { data: newCustomer, error: insertError } = await supabaseAdmin
        .from("customers")
        .insert({ email: rawEmail, name, phone })
        .select("id")
        .single();

      if (insertError || !newCustomer) {
        console.error("Customer insert error:", insertError);
        return NextResponse.json(
          {
            success: false,
            error: `고객 등록 오류: ${insertError?.message ?? "unknown"}${insertError?.code ? ` (code: ${insertError.code})` : ""}`,
          },
          { status: 500 }
        );
      }
      customerId = newCustomer.id;
    }

    // 3. 베타 구독 생성 (trialing, 가격 0원)
    const now = new Date();
    const trialEnds = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 베타: 1년 trial

    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        customer_id: customerId,
        status: "trialing",
        plan: "beta_free",
        amount_krw: 0,
        trial_starts_at: now.toISOString(),
        trial_ends_at: trialEnds.toISOString(),
      })
      .select("id")
      .single();

    if (subError || !subscription) {
      console.error("Subscription insert error:", subError);
      return NextResponse.json(
        {
          success: false,
          error: `구독 생성 오류: ${subError?.message ?? "unknown"}${subError?.code ? ` (code: ${subError.code})` : ""}`,
        },
        { status: 500 }
      );
    }

    // 4. 시리얼 키 생성 + 저장 (중복 방지를 위해 최대 3회 재시도)
    let licenseKey: string | null = null;
    let licenseId: string | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const candidate = generateLicenseKey();
      const { data: insertedLicense, error: licenseError } = await supabaseAdmin
        .from("licenses")
        .insert({
          key: candidate,
          customer_id: customerId,
          subscription_id: subscription.id,
          status: "active",
          expires_at: trialEnds.toISOString(),
        })
        .select("id")
        .single();

      if (!licenseError && insertedLicense) {
        licenseKey = candidate;
        licenseId = insertedLicense.id;
        break;
      }

      // unique constraint 위반이면 재시도, 그 외는 즉시 실패
      if (licenseError && !licenseError.message?.includes("duplicate")) {
        console.error("License insert error:", licenseError);
        return NextResponse.json(
          { success: false, error: "시리얼 키 생성 중 오류가 발생했습니다." },
          { status: 500 }
        );
      }
    }

    if (!licenseKey || !licenseId) {
      return NextResponse.json(
        { success: false, error: "시리얼 키 생성에 실패했습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    // 5. 활동 로그 (비동기, 실패해도 무시)
    supabaseAdmin
      .from("license_events")
      .insert({
        license_id: licenseId,
        event_type: "issued",
        ip_address:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        user_agent: request.headers.get("user-agent") ?? null,
        metadata: { email: rawEmail, plan: "beta_free" },
      })
      .then(() => {}, () => {});

    // 6. 이메일 발송
    const emailResult = await sendLicenseKeyEmail({
      to: rawEmail,
      name,
      licenseKey,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);

      // 이메일 발송 실패 정보를 license_events에 기록 — Resend 대시보드와 별개로 추적용
      supabaseAdmin
        .from("license_events")
        .insert({
          license_id: licenseId,
          event_type: "email_failed",
          ip_address:
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
          user_agent: request.headers.get("user-agent") ?? null,
          metadata: {
            email: rawEmail,
            error: emailResult.error,
            domain: rawEmail.split("@")[1] ?? null,
          },
        })
        .then(() => {}, () => {});

      // 이메일 실패해도 키는 발급됨 — 사용자에게 응답에 키 포함
      return NextResponse.json(
        {
          success: true,
          license_key: licenseKey,
          email_sent: false,
          warning:
            "이메일 발송에 실패했습니다. 아래 시리얼 키를 직접 보관해주세요.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        email_sent: true,
        message: "이메일로 시리얼 키를 발송했습니다. 메일함을 확인해주세요.",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("Issue endpoint error:", err);
    return NextResponse.json(
      { success: false, error: `서버 오류: ${message}` },
      { status: 500 }
    );
  }
}

// 다른 메소드 차단
export function GET() {
  return NextResponse.json(
    { error: "POST 메소드만 지원합니다." },
    { status: 405 }
  );
}
