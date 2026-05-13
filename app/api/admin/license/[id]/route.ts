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
 * DELETE /api/admin/license/[id]
 * 시리얼 키 무효화 (revoke) — 키 자체는 DB에 남고 status만 'revoked'로
 *
 * 인증: X-Admin-Secret
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "라이선스 ID가 필요합니다." },
        { status: 400, headers: ADMIN_CORS_HEADERS }
      );
    }

    // 상태를 revoked로 업데이트
    const { error } = await supabaseAdmin
      .from("licenses")
      .update({ status: "revoked" })
      .eq("id", id);

    if (error) {
      console.error("License revoke error:", error);
      return NextResponse.json(
        { error: `무효화 실패: ${error.message}` },
        { status: 500, headers: ADMIN_CORS_HEADERS }
      );
    }

    // 감사 로그 (비동기, 실패해도 OK)
    supabaseAdmin
      .from("license_events")
      .insert({
        license_id: id,
        event_type: "revoked",
        ip_address:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        user_agent: request.headers.get("user-agent") ?? null,
        metadata: { source: "admin_panel" },
      })
      .then(() => {}, () => {});

    return NextResponse.json(
      { success: true, message: "시리얼 키가 무효화되었습니다." },
      { headers: ADMIN_CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `서버 오류: ${(err as Error).message}` },
      { status: 500, headers: ADMIN_CORS_HEADERS }
    );
  }
}
