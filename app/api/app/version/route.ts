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
  latest: "0.2.9",
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
  releaseNotes: "옛 영상에 대한 월 델타 과대계상 패치 — '월초 직전 스냅샷이 없는 옛 영상'은 0으로 보수적 처리. 5월에 새로 올린 영상만 정확히 카운트. 옛 영상 데이터는 YouTube Analytics API 통합 후 정확해질 예정.",
  publishedAt: "2026-05-15",
};

export async function GET() {
  return NextResponse.json(VERSION_INFO, {
    headers: {
      "Cache-Control": "public, max-age=300", // 5분 캐시
      "Access-Control-Allow-Origin": "*", // Electron app에서 호출 허용
    },
  });
}
