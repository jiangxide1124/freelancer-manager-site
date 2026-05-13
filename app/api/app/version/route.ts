import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/app/version
 * Client 앱이 시작할 때 호출해서 최신 버전 정보 확인
 *
 * ⚠️ 새 버전 출시 시 아래 VERSION_INFO를 수정한 후 배포하세요.
 * - latest: 최신 버전 (semver: "MAJOR.MINOR.PATCH")
 * - downloadUrl: 해당 버전의 Mac DMG 다운로드 URL
 * - releaseNotes: 사용자에게 보여줄 짧은 변경사항
 */
const VERSION_INFO = {
  latest: "0.2.1",
  downloadUrl:
    "https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Mac-Client.dmg",
  releaseNotes: "자동 배포 시스템 도입 — 빌드/업로드/사이트 갱신/재설치 한 번에",
  publishedAt: "2026-05-13",
  // CORS 차단되지 않게 응답 헤더 추가
};

export async function GET() {
  return NextResponse.json(VERSION_INFO, {
    headers: {
      "Cache-Control": "public, max-age=300", // 5분 캐시
      "Access-Control-Allow-Origin": "*", // Electron app에서 호출 허용
    },
  });
}
