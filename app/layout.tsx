import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import SiteNav from "./_components/SiteNav";

const SITE_URL = "https://freelancer-manager-site.vercel.app";
const SITE_NAME = "프리랜서 관리";
const SITE_TITLE = "프리랜서 관리 — 영상편집 의뢰·정산 자동화";
const SITE_DESC =
  "1인 미디어·콘텐츠 사업자를 위한 데스크톱 프로그램. 작업자 의뢰, 영상 조회수 자동 추적, 정산서·급여명세서 자동 생성까지 — 엑셀에서 손으로 하던 모든 일을 한 프로그램에서.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | 프리랜서 관리",
  },
  description: SITE_DESC,
  keywords: [
    "프리랜서 관리",
    "영상편집 정산",
    "유튜브 프리랜서",
    "1인 미디어",
    "자동 정산",
    "급여명세서",
    "조회수 추적",
    "콘텐츠 사업자",
    "영상 외주",
    "프로젝트 관리",
  ],
  authors: [{ name: "수우튜디오" }],
  creator: "수우튜디오",
  publisher: "수우튜디오",
  applicationName: SITE_NAME,
  // 카톡·X·페이스북 등 미리보기 카드용
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    // images는 app/opengraph-image.tsx 가 자동 생성
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  // 검색엔진 크롤링 허용
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // 모바일/앱 메타데이터
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <SiteNav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
