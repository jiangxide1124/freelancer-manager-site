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

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g39v5pui";

const FAQS: { q: string; a: string }[] = [
  {
    q: "시리얼 키는 어떻게 받나요?",
    a: "다운로드 후 첫 실행 시 시리얼 키 입력 화면이 나옵니다. 아래 카카오톡 오픈채팅방에 \"시리얼 키 신청\"이라고 남겨주시면 안내드립니다. 베타 기간 동안은 무료로 발급해드립니다.",
  },
  {
    q: "데이터는 어디에 저장되나요? 안전한가요?",
    a: "모든 데이터는 내 컴퓨터에 SQLite 파일로 로컬 저장됩니다. 외부 서버에 어떤 정보도 전송되지 않아 의뢰 내역·작업자 정보·정산 기록 등 사업 기밀이 안전합니다. 백업·복원 기능도 한 번에 제공됩니다.",
  },
  {
    q: "다른 컴퓨터로 데이터를 옮길 수 있나요?",
    a: "네. 설정 → 백업 메뉴에서 백업 파일을 만들어 USB·클라우드 등으로 옮긴 뒤, 새 컴퓨터에서 복원하면 됩니다. 작업자·의뢰·정산 내역 전체가 그대로 이전됩니다.",
  },
  {
    q: "작업자(프리랜서)는 몇 명까지 등록 가능한가요?",
    a: "인원 제한 없습니다. 5명도, 50명도, 100명도 동일한 가격으로 관리하실 수 있습니다.",
  },
  {
    q: "YouTube·TikTok 조회수 자동 추적은 어떻게 작동하나요?",
    a: "각 플랫폼에서 무료로 발급되는 API 키를 설정에 한 번 등록하시면, 매일 자동으로 영상별 조회수·좋아요·댓글이 갱신됩니다. API 키 발급 가이드는 프로그램 안에 포함되어 있어 따라 하시면 됩니다.",
  },
  {
    q: "Windows 버전은 언제 출시되나요?",
    a: "현재 개발 중이며 곧 출시 예정입니다. 출시 즉시 카카오톡 오픈채팅방으로 공지드립니다.",
  },
  {
    q: "인터넷 연결이 항상 필요한가요?",
    a: "아니요. 조회수 자동 추적·이메일 보고서 발송 기능에만 인터넷이 필요합니다. 의뢰 등록·정산 계산·급여명세서 PDF 출력 등 핵심 기능은 오프라인에서도 정상 작동합니다.",
  },
  {
    q: "정산·급여명세서 계산은 정확한가요?",
    a: "작업자별 단가, 구간 보너스, 누적 보너스, 원천징수 3.3%까지 모두 자동으로 계산합니다. 확정 전에 수동으로 확인·수정도 가능하니 안심하고 사용하실 수 있습니다.",
  },
  {
    q: "한 번 결제하면 매월 비용이 나가나요?",
    a: "아니요. 구독제가 아닙니다. 한 번 구매하시면 평생 사용 가능하며, 무료 업데이트도 함께 제공됩니다.",
  },
  {
    q: "환불은 가능한가요?",
    a: "정식 출시 후 구매하신 분께는 결제일로부터 7일 내 환불을 보장합니다. 베타 기간 동안은 무료로 충분히 체험해보실 수 있으니 부담 없이 사용해보세요.",
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
              href={KAKAO_OPEN_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              카카오톡 오픈채팅으로 키 신청
            </a>
            해주세요.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-wider text-purple-400 uppercase mb-2">
              자주 묻는 질문
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQ</h2>
            <p className="text-slate-400">궁금증을 먼저 풀어드릴게요</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none">
                  <span className="text-base font-medium text-slate-100 leading-snug">
                    <span className="text-purple-400 mr-2 font-semibold">Q.</span>
                    {f.q}
                  </span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform text-xl leading-none flex-shrink-0 select-none">
                    ⌄
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-1 text-sm text-slate-400 leading-relaxed">
                  <span className="text-emerald-400 mr-2 font-semibold">A.</span>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
          <p className="text-center mt-10 text-sm text-slate-500">
            더 궁금한 점이 있다면{' '}
            <a
              href={KAKAO_OPEN_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline font-medium"
            >
              카카오톡 오픈채팅
            </a>
            으로 문의해주세요
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-2">
              문의
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">실시간으로 답변드립니다</h2>
            <p className="text-slate-400">시리얼 키 신청 · 기능 문의 · 시연 요청 · 도입 상담 모두 카카오톡 오픈채팅으로</p>
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-8 text-center">
            <a
              href={KAKAO_OPEN_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold transition-colors text-lg shadow-lg shadow-yellow-900/30"
            >
              💬 카카오톡 오픈채팅 입장하기
            </a>
            <p className="mt-6 text-sm text-slate-400">
              가입·로그인 없이 바로 입장 · 실명 노출 없음 · 평일 빠른 답변
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
            <Link href="#faq" className="hover:text-slate-300">
              FAQ
            </Link>
            <a
              href={KAKAO_OPEN_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              문의
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
