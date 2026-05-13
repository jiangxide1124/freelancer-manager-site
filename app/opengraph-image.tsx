import { ImageResponse } from "next/og";

// 카톡·X·페이스북·디스코드 등에서 사이트 링크 공유 시 표시되는 미리보기 이미지
export const alt = "프리랜서 관리 — 영상편집 의뢰·정산 자동화";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* 베타 뱃지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 24px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "2px solid rgba(16, 185, 129, 0.45)",
            borderRadius: "9999px",
            fontSize: "22px",
            fontWeight: 600,
            color: "#34d399",
            marginBottom: "40px",
            letterSpacing: "-0.02em",
          }}
        >
          🎁 베타 진행 중 · 무료
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "100px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            marginBottom: "24px",
            color: "#ffffff",
          }}
        >
          <span style={{ marginRight: "20px" }}>🎬</span>
          프리랜서 관리
        </div>

        {/* 서브 타이틀 (그라데이션) */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #60a5fa 0%, #34d399 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "40px",
            letterSpacing: "-0.02em",
          }}
        >
          영상편집 의뢰·정산 자동화
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "900px",
            letterSpacing: "-0.01em",
          }}
        >
          1인 미디어·콘텐츠 사업자를 위한 데스크톱 프로그램
          <br />
          작업자 의뢰 · 조회수 자동 추적 · 자동 정산 한 번에
        </div>

        {/* 푸터 — 작은 도메인 표시 */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "#64748b",
            letterSpacing: "-0.01em",
          }}
        >
          freelancer-manager-site.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
