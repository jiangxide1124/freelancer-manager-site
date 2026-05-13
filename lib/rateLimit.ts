import { supabaseAdmin } from "@/lib/supabase";

/**
 * 슬라이딩 윈도우 rate limit 체크 + 기록
 *
 * @param bucket      카테고리 (예: "recover_email", "recover_ip", "issue_ip")
 * @param identifier  대상 (예: 이메일, IP)
 * @param maxRequests 윈도우 내 허용 횟수
 * @param windowMinutes 시간 윈도우 (분)
 * @returns { allowed: boolean, retryAfter?: 초 }
 */
export async function checkAndRecordRateLimit(
  bucket: string,
  identifier: string,
  maxRequests: number,
  windowMinutes: number
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const windowStart = new Date(
    Date.now() - windowMinutes * 60 * 1000
  ).toISOString();

  // 1. 윈도우 내 요청 수 카운트
  const { count, error: countError } = await supabaseAdmin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("bucket", bucket)
    .eq("identifier", identifier)
    .gte("created_at", windowStart);

  if (countError) {
    // 카운트 실패 시 안전한 쪽으로 — 허용 (DB 장애가 사용자 차단 X)
    console.error("Rate limit count error:", countError);
    return { allowed: true };
  }

  if ((count ?? 0) >= maxRequests) {
    return { allowed: false, retryAfter: windowMinutes * 60 };
  }

  // 2. 이번 요청 기록
  const { error: insertError } = await supabaseAdmin
    .from("rate_limits")
    .insert({ bucket, identifier });

  if (insertError) {
    console.error("Rate limit insert error:", insertError);
    // 기록 실패해도 허용 (UX 우선)
  }

  return { allowed: true };
}

/**
 * 7일 이상 된 rate limit 레코드 정리 (스토리지 청소)
 * 호출 빈도: 가끔 (예: 1% 확률로 호출하여 분산)
 */
export async function cleanupOldRateLimits(): Promise<void> {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  try {
    await supabaseAdmin
      .from("rate_limits")
      .delete()
      .lt("created_at", cutoff);
  } catch {
    // 무시 — 청소 실패는 치명적 X
  }
}

/**
 * 요청에서 클라이언트 IP 추출 (Vercel 환경)
 */
export function extractClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
