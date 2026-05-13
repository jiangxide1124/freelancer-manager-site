import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyLicenseKeyFormat, normalizeLicenseKey } from "@/lib/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/license/verify
 * 앱이 호출하는 라이선스 검증 엔드포인트
 *
 * Body: { key: string, hwid?: string }
 * Returns: {
 *   valid: boolean,
 *   status?: 'active' | 'suspended' | 'revoked' | 'expired',
 *   subscription_status?: string,
 *   expires_at?: string | null,
 *   plan?: string,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { valid: false, error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const rawKey = String(body.key ?? "");
    const hwid = body.hwid ? String(body.hwid).slice(0, 200) : null;
    const key = normalizeLicenseKey(rawKey);

    // 1. 형식 + HMAC 체크섬 검증 (DB 조회 없이 빠른 1차 필터)
    if (!verifyLicenseKeyFormat(key)) {
      return NextResponse.json(
        { valid: false, error: "올바르지 않은 시리얼 키 형식입니다." },
        { status: 400 }
      );
    }

    // 2. DB에서 키 조회
    const { data: license, error: lookupError } = await supabaseAdmin
      .from("licenses")
      .select(
        "id, key, customer_id, subscription_id, status, hwid, activated_at, expires_at"
      )
      .eq("key", key)
      .maybeSingle();

    if (lookupError) {
      console.error("License lookup error:", lookupError);
      return NextResponse.json(
        { valid: false, error: "서버 조회 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (!license) {
      return NextResponse.json(
        { valid: false, error: "등록되지 않은 시리얼 키입니다." },
        { status: 404 }
      );
    }

    // 3. 상태 체크
    if (license.status !== "active") {
      return NextResponse.json(
        {
          valid: false,
          status: license.status,
          error:
            license.status === "revoked"
              ? "이 시리얼 키는 사용 중지되었습니다."
              : license.status === "expired"
              ? "이 시리얼 키는 만료되었습니다."
              : "이 시리얼 키는 현재 사용할 수 없습니다.",
        },
        { status: 403 }
      );
    }

    // 4. 만료 체크 (expires_at < now)
    if (license.expires_at) {
      const expiresAt = new Date(license.expires_at);
      if (expiresAt < new Date()) {
        // 자동 만료 표시
        await supabaseAdmin
          .from("licenses")
          .update({ status: "expired" })
          .eq("id", license.id);

        return NextResponse.json(
          {
            valid: false,
            status: "expired",
            expires_at: license.expires_at,
            error: "구독이 만료되었습니다. 갱신 후 다시 시도해주세요.",
          },
          { status: 403 }
        );
      }
    }

    // 5. HWID 처리 (1컴퓨터 1키 원칙)
    let hwidMatch = true;
    if (hwid) {
      if (!license.hwid) {
        // 최초 활성화 → HWID 저장
        const { error: updateError } = await supabaseAdmin
          .from("licenses")
          .update({
            hwid,
            activated_at: new Date().toISOString(),
            last_verified_at: new Date().toISOString(),
          })
          .eq("id", license.id);

        if (updateError) {
          console.error("HWID set error:", updateError);
        }
      } else if (license.hwid !== hwid) {
        hwidMatch = false;
      } else {
        // HWID 일치 → last_verified_at 갱신
        await supabaseAdmin
          .from("licenses")
          .update({ last_verified_at: new Date().toISOString() })
          .eq("id", license.id);
      }
    } else {
      // HWID 미제공 → last_verified_at만 갱신
      await supabaseAdmin
        .from("licenses")
        .update({ last_verified_at: new Date().toISOString() })
        .eq("id", license.id);
    }

    if (!hwidMatch) {
      return NextResponse.json(
        {
          valid: false,
          error:
            "이 시리얼 키는 다른 컴퓨터에서 활성화되어 있습니다. 카카오톡 오픈채팅으로 문의해주세요.",
        },
        { status: 403 }
      );
    }

    // 6. 구독 정보 조회 (선택)
    let subscription = null;
    if (license.subscription_id) {
      const { data } = await supabaseAdmin
        .from("subscriptions")
        .select("status, plan, current_period_end, trial_ends_at")
        .eq("id", license.subscription_id)
        .maybeSingle();
      subscription = data;
    }

    // 7. 활동 로그 (비동기, 실패해도 무시)
    supabaseAdmin
      .from("license_events")
      .insert({
        license_id: license.id,
        event_type: "verified",
        ip_address:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        user_agent: request.headers.get("user-agent") ?? null,
        metadata: { hwid_provided: !!hwid },
      })
      .then(() => {}, () => {});

    return NextResponse.json(
      {
        valid: true,
        status: license.status,
        expires_at: license.expires_at,
        subscription_status: subscription?.status ?? null,
        plan: subscription?.plan ?? null,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("Verify endpoint error:", err);
    return NextResponse.json(
      { valid: false, error: `서버 오류: ${message}` },
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
