import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/app/version
 * Client 앱이 시작할 때 호출해서 최신 버전 정보 확인.
 *
 * ⚠️ 새 버전 출시 시 아래 VERSION_INFO를 수정한 후 배포하세요.
 * - latest: 최신 버전 (semver: "MAJOR.MINOR.PATCH")
 * - downloadUrl: 기본(Mac) Client DMG — 하위 호환용 (구버전 앱이 이걸 읽음)
 * - downloadUrls: OS별 안정 다운로드 URL (신규)
 *
 * GitHub Releases의 /latest/download/ URL 패턴은 태그가 바뀌어도 안정적으로 유지됨.
 */
const VERSION_INFO = {
  latest: "0.3.75",
  downloadUrl:
    "https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Mac-Client.dmg",
  downloadUrls: {
    mac: {
      admin:
        "https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Mac-Admin.dmg",
      client:
        "https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Mac-Client.dmg",
    },
    win: {
      // NSIS Installer (Setup.exe) — 옛 버전 자동 제거 + 바탕화면/시작 메뉴 자동 등록.
      // Portable EXE는 fallback으로 유지 (-Win-Admin.exe, -Win-Client.exe).
      admin:
        "https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Win-Admin-Setup.exe",
      client:
        "https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Win-Client-Setup.exe",
    },
  },
  releaseNotes: "YT 자동 가져오기 — OAuth 만료/없음 시 명확한 errors 노출 (예약·비공개 영상 누락 진단)",
  publishedAt: "2026-05-25",
};

export async function GET() {
  return NextResponse.json(VERSION_INFO, {
    headers: {
      "Cache-Control": "public, max-age=300", // 5분 캐시
      "Access-Control-Allow-Origin": "*", // Electron app에서 호출 허용
    },
  });
}
