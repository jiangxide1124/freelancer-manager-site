import { NextRequest } from "next/server";

/**
 * Admin API 인증 — X-Admin-Secret 헤더 검증
 *
 * Admin app만 이 헤더와 함께 호출할 수 있고, 일반 사용자는 차단됨.
 * Vercel 환경변수 ADMIN_API_SECRET에 설정된 값과 정확히 일치해야 함.
 */
export function isAdminAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_API_SECRET;
  if (!expected) {
    console.error("ADMIN_API_SECRET environment variable not set");
    return false;
  }
  if (!secret) return false;
  // 타이밍 안전 비교는 짧은 헥스라 큰 차이 없지만 일관성 위해 길이 비교
  if (secret.length !== expected.length) return false;
  return secret === expected;
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "Unauthorized" }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
