import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/customers
 * 고객 목록 + 구독·라이선스 정보
 *
 * Query params:
 *   search : 이메일·이름·전화번호로 검색
 *   limit  : 최대 결과 수 (기본 100, 최대 500)
 *
 * 인증: X-Admin-Secret 헤더
 */
export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 1),
      500
    );

    let query = supabaseAdmin
      .from("customers")
      .select(
        `
        id,
        email,
        name,
        phone,
        business_name,
        business_number,
        created_at,
        subscriptions (
          id,
          status,
          plan,
          amount_krw,
          trial_starts_at,
          trial_ends_at,
          current_period_end,
          canceled_at,
          created_at
        ),
        licenses (
          id,
          key,
          status,
          hwid,
          activated_at,
          last_verified_at,
          expires_at,
          created_at
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (search) {
      // OR 검색: 이메일·이름·전화·사업자명 (ilike = case-insensitive partial match)
      query = query.or(
        `email.ilike.%${search}%,name.ilike.%${search}%,phone.ilike.%${search}%,business_name.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Customers query error:", error);
      return NextResponse.json(
        { error: `고객 조회 오류: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customers: data ?? [],
      count: data?.length ?? 0,
    });
  } catch (err) {
    console.error("Customers endpoint error:", err);
    return NextResponse.json(
      { error: `서버 오류: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
