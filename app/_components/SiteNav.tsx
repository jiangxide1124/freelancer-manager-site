import Link from "next/link";
import LicenseRecoveryButton from "./LicenseRecoveryButton";

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g39v5pui";

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-100 text-base sm:text-lg shrink-0 hover:text-white transition-colors"
        >
          <span className="text-xl">🎬</span>
          <span className="hidden sm:inline">프리랜서 관리</span>
        </Link>

        {/* Center nav — 빈 공간 활용해서 우측에 배치 + 폰트 키움 */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-sm sm:text-base flex-1 justify-end overflow-x-auto scrollbar-hide">
          <Link
            href="/#features"
            className="px-3 sm:px-3.5 py-2 text-slate-300 hover:text-white whitespace-nowrap transition-colors hidden sm:inline-flex"
          >
            기능
          </Link>
          <Link
            href="/#how"
            className="px-3 sm:px-3.5 py-2 text-slate-300 hover:text-white whitespace-nowrap transition-colors hidden md:inline-flex"
          >
            사용 흐름
          </Link>
          <Link
            href="/#pricing"
            className="px-3 sm:px-3.5 py-2 text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap transition-colors"
          >
            💰 요금제
          </Link>
          <Link
            href="/#faq"
            className="px-3 sm:px-3.5 py-2 text-slate-300 hover:text-white whitespace-nowrap transition-colors hidden md:inline-flex"
          >
            FAQ
          </Link>
          <LicenseRecoveryButton className="px-3 sm:px-3.5 py-2 text-slate-300 hover:text-purple-300 whitespace-nowrap transition-colors hidden lg:inline-flex text-sm sm:text-base cursor-pointer" />
          <a
            href={KAKAO_OPEN_CHAT}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-3.5 py-2 text-slate-300 hover:text-yellow-400 whitespace-nowrap transition-colors hidden lg:inline-flex"
          >
            문의
          </a>
        </div>

        {/* CTA — #signup으로 점프 */}
        <Link
          href="/#signup"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-900/30 transition-all whitespace-nowrap"
        >
          🎁 베타 무료
        </Link>
      </div>
    </nav>
  );
}
