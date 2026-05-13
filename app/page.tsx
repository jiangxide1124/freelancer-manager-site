import Link from "next/link";

const FEATURES = [
  {
    icon: "📋",
    title: "의뢰·작업자 한곳에서",
    desc: "주제, 작업자, 상태, 영상 링크까지 — 모든 의뢰가 흐름대로 정렬됩니다. 칸반 보드로 진행 상태도 한눈에.",
  },
  {
    icon: "📊",
    title: "조회수 자동 추적",
    desc: "YouTube·TikTok·Instagram API와 직접 연동. 영상별 조회수·좋아요·댓글이 매일 자동 갱신됩니다.",
  },
  {
    icon: "💰",
    title: "정산·급여명세서 자동",
    desc: "작업자별 단가·구간 보너스·누적 보너스까지 계산해서 한 번에 정산. 원천징수 3.3% 자동 차감 + 명세서 PDF 출력.",
  },
  {
    icon: "📧",
    title: "보고서 자동 발송",
    desc: "주간/월간 성과 보고서를 정한 요일에 자동으로 이메일 발송. SMTP만 설정하면 끝.",
  },
  {
    icon: "👥",
    title: "여러 채널 통합 관리",
    desc: "메인 채널·부채널·여러 플랫폼을 하나의 대시보드에서. 채널별 예상 수익도 분리해서 표시.",
  },
  {
    icon: "🔒",
    title: "데이터 완전 로컬 저장",
    desc: "SQLite 기반. 외부 서버 없이 내 컴퓨터에만 저장. 백업·복원 한 번에. 사업 기밀 안전.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50 text-xs font-medium text-blue-300 mb-6">
              🎬 영상 콘텐츠 사업자를 위한 관리 프로그램
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              프리랜서 관리,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                자동화로 끝내세요
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              영상편집 의뢰부터 조회수 추적, 작업자 정산까지.
              <br />
              엑셀에서 손으로 하던 모든 일을 한 프로그램에서.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-900/50"
              >
                ⬇ 다운로드 (무료 체험)
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium transition-colors"
              >
                기능 자세히 보기
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              macOS · Windows 지원 · 데이터는 내 컴퓨터에만 저장 · 평생 사용
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-2">
            기능
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            엑셀·메모장으로 흩어졌던 일들을, 한 곳으로
          </h2>
          <p className="text-slate-400">의뢰 관리부터 자동 정산·보고서까지 — 데스크톱 앱 하나로</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download */}
      <section
        id="download"
        className="border-t border-slate-800 bg-gradient-to-b from-slate-900/40 to-slate-950"
      >
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-2">
            다운로드
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">바로 시작하세요</h2>
          <p className="text-slate-400 mb-10">
            다운로드 → 설치 → 시리얼 키 입력. 5분 안에 첫 의뢰 등록 가능.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/jiangxide1124/freelancer-manager-releases/releases/latest/download/-Mac-Client.dmg"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-colors min-w-[240px]"
            >
              <span className="text-2xl"></span>
              <div className="text-left">
                <div className="text-xs text-slate-500">macOS (Apple Silicon)</div>
                <div className="text-base">⬇ 바로 다운로드 (208MB)</div>
              </div>
            </a>
            <span
              aria-disabled="true"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-slate-800/60 text-slate-400 font-semibold min-w-[240px] border border-slate-700 cursor-not-allowed"
              title="Windows 빌드 준비 중입니다"
            >
              <span className="text-2xl">⊞</span>
              <div className="text-left">
                <div className="text-xs text-slate-500">Windows 10 / 11 (x64)</div>
                <div className="text-base">준비 중</div>
              </div>
            </span>
          </div>
          <p className="mt-8 text-xs text-slate-500">
            ※ 현재 베타 운영 중. 다운로드 후 시리얼 키 입력 화면이 나오면{' '}
            <a
              href="mailto:contact@example.com?subject=프리랜서%20관리%20시리얼%20키%20신청"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              이메일로 키 신청
            </a>
            해주세요.
          </p>
        </div>
      </section>

      {/* Contact / FAQ */}
      <section className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-2">
              문의
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">궁금한 점이 있다면</h2>
            <p className="text-slate-400">제품 도입·시연·요금 안내 모두 이메일로 답변드립니다</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-8 text-center">
            <a
              href="mailto:contact@example.com?subject=프리랜서%20관리%20프로그램%20문의"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors text-lg"
            >
              ✉ 문의 메일 보내기
            </a>
            <p className="mt-6 text-sm text-slate-400">
              평일 24시간 내 답변 · 주말은 다음 평일 답변
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} 프리랜서 관리 · 영상 콘텐츠 사업자용 자동화</div>
          <div className="flex gap-4">
            <Link href="#features" className="hover:text-slate-300">
              기능
            </Link>
            <Link href="#download" className="hover:text-slate-300">
              다운로드
            </Link>
            <a href="mailto:contact@example.com" className="hover:text-slate-300">
              문의
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
