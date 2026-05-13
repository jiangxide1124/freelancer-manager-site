import Link from "next/link";

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g39v5pui";

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-100 text-sm sm:text-base shrink-0 hover:text-white transition-colors"
        >
          <span className="text-lg">🎬</span>
          <span className="hidden sm:inline">프리랜서 관리</span>
        </Link>

        {/* Center nav */}
        <div className="flex items-center gap-0 text-xs sm:text-sm flex-1 justify-end sm:justify-center overflow-x-auto scrollbar-hide">
          <Link
            href="/#features"
            className="px-2.5 sm:px-3 py-1.5 text-slate-400 hover:text-slate-100 whitespace-nowrap transition-colors"
          >
            기능
          </Link>
          <Link
            href="/#how"
            className="px-2.5 sm:px-3 py-1.5 text-slate-400 hover:text-slate-100 whitespace-nowrap transition-colors hidden md:inline-flex"
          >
            사용 흐름
          </Link>
          <Link
            href="/#pricing"
            className="px-2.5 sm:px-3 py-1.5 text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap transition-colors"
          >
            💰 요금제
          </Link>
          <Link
            href="/#faq"
            className="px-2.5 sm:px-3 py-1.5 text-slate-400 hover:text-slate-100 whitespace-nowrap transition-colors hidden md:inline-flex"
          >
            FAQ
          </Link>
          <a
            href={KAKAO_OPEN_CHAT}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-1.5 text-slate-400 hover:text-yellow-400 whitespace-nowrap transition-colors hidden lg:inline-flex"
          >
            문의
          </a>
        </div>

        {/* CTA — #signup으로 점프해서 베타 신청 버튼 바로 보이게 */}
        <Link
          href="/#signup"
          className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-900/30 transition-all whitespace-nowrap"
        >
          🎁 베타 무료
        </Link>
      </div>
    </nav>
  );
}
