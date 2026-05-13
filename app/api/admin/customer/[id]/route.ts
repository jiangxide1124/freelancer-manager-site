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
 * DELETE /api/admin/customer/[id]
 * 고객 완전 삭제 — customers, subscriptions, licenses, events 전부 cascade 삭제
 *
 * ⚠️ 되돌릴 수 없음. 신중하게.
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
        { error: "고객 ID가 필요합니다." },
        { status: 400, headers: ADMIN_CORS_HEADERS }
      );
    }

    // 고객 정보 미리 조회 (감사용)
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("email, name")
      .eq("id", id)
      .maybeSingle();

    // CASCADE 삭제 (FK ON DELETE CASCADE 덕분에 자식 행도 자동 삭제)
    const { error } = await supabaseAdmin
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Customer delete error:", error);
      return NextResponse.json(
        { error: `삭제 실패: ${error.message}` },
        { status: 500, headers: ADMIN_CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${customer?.email ?? "고객"} 정보가 완전 삭제되었습니다.`,
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
