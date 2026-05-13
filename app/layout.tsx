import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "./_components/SiteNav";

export const metadata: Metadata = {
  title: "프리랜서 관리 — 영상편집 의뢰·정산 자동화",
  description:
    "1인 미디어·콘텐츠 사업자를 위한 데스크톱 프로그램. 작업자 의뢰, 영상 조회수 자동 추적, 정산서·급여명세서 자동 생성까지.",
  openGraph: {
    title: "프리랜서 관리",
    description: "영상편집 의뢰·정산 자동화 프로그램",
    locale: "ko_KR",
    type: "website",
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
      </body>
    </html>
  );
}
