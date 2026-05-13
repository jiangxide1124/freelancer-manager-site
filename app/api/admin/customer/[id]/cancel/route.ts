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
 * POST /api/admin/customer/[id]/cancel
 * 구독 해지 + 라이선스 무효화 (환불 처리에 해당)
 *
 * 1. customer의 모든 활성 subscription을 status='canceled', canceled_at=now()로
 * 2. customer의 모든 활성 license를 status='revoked'로
 * 3. 데이터는 보존 (이력 추적용)
 *
 * 인증: X-Admin-Secret
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "고객 ID가 필요합니다." },
        { status: 400, headers: ADMIN_CORS_HEADERS }
      );
    }

    // 1. 구독 해지
    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
      })
      .eq("customer_id", id)
      .in("status", ["trialing", "active", "past_due"]);

    if (subError) {
      console.error("Subscription cancel error:", subError);
      return NextResponse.json(
        { error: `구독 해지 실패: ${subError.message}` },
        { status: 500, headers: ADMIN_CORS_HEADERS }
      );
    }

    // 2. 라이선스 무효화 (활성/일시정지 모두)
    const { data: revokedLicenses, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .update({ status: "revoked" })
      .eq("customer_id", id)
      .in("status", ["active", "suspended"])
      .select("id");

    if (licenseError) {
      console.error("License revoke error:", licenseError);
      return NextResponse.json(
        { error: `라이선스 무효화 실패: ${licenseError.message}` },
        { status: 500, headers: ADMIN_CORS_HEADERS }
      );
    }

    // 3. 감사 로그
    if (revokedLicenses && revokedLicenses.length > 0) {
      const events = revokedLicenses.map((l) => ({
        license_id: l.id,
        event_type: "canceled_by_admin",
        ip_address:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        user_agent: request.headers.get("user-agent") ?? null,
        metadata: { source: "admin_panel" },
      }));
      supabaseAdmin
        .from("license_events")
        .insert(events)
        .then(() => {}, () => {});
    }

    return NextResponse.json(
      {
        success: true,
        message: `구독이 해지되고 라이선스 ${revokedLicenses?.length ?? 0}개가 무효화되었습니다.`,
        licensesRevoked: revokedLicenses?.length ?? 0,
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
