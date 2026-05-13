import Link from "next/link";
import BetaSignupButton from "./_components/BetaSignupButton";
import LicenseRecoveryButton from "./_components/LicenseRecoveryButton";

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

const FAQ_CATEGORIES: {
  title: string;
  items: { q: string; a: string }[];
}[] = [
  {
    title: "💳 구독·결제",
    items: [
      {
        q: "어떤 요금제인가요?",
        a: "월 구독제로 운영됩니다. 구독 기간 동안 모든 기능을 무제한으로 사용하실 수 있고, 정기 무료 업데이트도 함께 제공됩니다. 언제든 해지 가능하며, 7일 무료 체험 후 자동 결제됩니다. 자세한 가격은 정식 출시 시점에 공개됩니다.",
      },
      {
        q: "환불 정책은 어떻게 되나요?",
        a: "구독제는 언제든 해지 가능하며, 해지 시 다음 결제부터 중단됩니다(이미 결제된 기간은 그대로 사용 가능). 7일 무료 체험 기간 중 해지하시면 결제가 발생하지 않으니 부담 없이 충분히 사용해보세요. 단, 결제 후 서비스를 한 번도 이용하지 않은 경우 7일 이내 청약 철회가 가능합니다(전자상거래법). 자세한 내용은 이용약관을 참조해주세요.",
      },
      {
        q: "결제 수단은 무엇이 가능한가요?",
        a: "정식 출시 시 토스페이먼츠를 통해 카드 결제, 카카오페이, 네이버페이 모두 지원할 예정입니다. 모든 한국 주요 카드사를 지원하며, 자동 정기결제로 매월 신경 쓸 필요 없이 사용 가능합니다.",
      },
      {
        q: "사업자등록증이 없어도 사용 가능한가요?",
        a: "네, 개인도 가능합니다. 단, 사업자등록증이 있으시면 세금계산서 발행이 가능하여 비용 처리에 유리합니다. 정식 출시 시 사업자/개인 구분 없이 모두 결제 가능합니다.",
      },
    ],
  },
  {
    title: "🎫 시리얼 키",
    items: [
      {
        q: "시리얼 키는 어떻게 받나요?",
        a: "사이트의 \"🎁 베타 무료로 시작하기\" 버튼을 클릭해서 이메일을 입력하시면 즉시 시리얼 키가 이메일로 발송됩니다. 메일이 안 오시면 스팸함도 확인해주세요.",
      },
      {
        q: "시리얼 키를 잃어버렸어요. 다시 받을 수 있나요?",
        a: "네, 가능합니다. 페이지 하단 푸터 또는 요금제 섹션의 \"🔍 시리얼 키를 잊으셨나요?\" 링크를 클릭하시고 신청 시 사용한 이메일을 입력하시면 시리얼 키를 다시 이메일로 발송해드립니다. 보안상 이메일이 등록되지 않은 경우에도 동일한 메시지가 표시되니, 메일이 안 오면 다른 이메일로 시도해보세요.",
      },
      {
        q: "여러 컴퓨터에서 같은 키로 사용할 수 있나요?",
        a: "아니요. 한 시리얼 키는 한 컴퓨터에서만 사용 가능합니다. 첫 활성화 시 하드웨어 ID가 자동으로 등록되어 다른 컴퓨터에서는 같은 키로 사용할 수 없습니다. 컴퓨터를 교체하시려면 카카오톡 오픈채팅으로 문의해주세요. 기존 키를 새 컴퓨터로 이전해드립니다.",
      },
      {
        q: "사용 중 컴퓨터가 고장 나면 라이선스는 어떻게 되나요?",
        a: "걱정 마세요. 새 컴퓨터에서 사이트로 \"시리얼 키 찾기\" 하시거나 카카오톡 오픈채팅으로 문의주시면, 이전 컴퓨터의 등록을 해제하고 새 컴퓨터에 활성화해드립니다. 데이터도 백업 파일로 그대로 이전 가능합니다.",
      },
    ],
  },
  {
    title: "💾 데이터·보안",
    items: [
      {
        q: "데이터는 어디에 저장되나요? 안전한가요?",
        a: "모든 데이터는 내 컴퓨터에 SQLite 파일로 로컬 저장됩니다. 외부 서버에 어떤 정보도 전송되지 않아 의뢰 내역·작업자 정보·정산 기록 등 사업 기밀이 안전합니다. 백업·복원 기능도 한 번에 제공됩니다.",
      },
      {
        q: "다른 컴퓨터로 데이터를 옮길 수 있나요?",
        a: "네. 설정 → 데이터 백업 메뉴에서 백업 파일을 만들어 USB·클라우드 등으로 옮긴 뒤, 새 컴퓨터에서 복원하면 됩니다. 작업자·의뢰·정산 내역 전체가 그대로 이전됩니다.",
      },
      {
        q: "베타 기간 동안 입력한 데이터는 정식 출시 후에도 유지되나요?",
        a: "네, 100% 유지됩니다. 데이터는 본인 컴퓨터의 로컬 SQLite 파일에 저장되므로 베타·정식 구분 없이 동일하게 사용됩니다. 정식 출시 후에도 따로 데이터 이전 작업 없이 그대로 이어서 사용하시면 됩니다.",
      },
    ],
  },
  {
    title: "📊 기능·사용법",
    items: [
      {
        q: "작업자(프리랜서)는 몇 명까지 등록 가능한가요?",
        a: "인원 제한 없습니다. 5명도, 50명도, 100명도 동일한 가격으로 관리하실 수 있습니다. 작업자별 단가·구간 보너스·누적 보너스를 개별 설정 가능합니다.",
      },
      {
        q: "YouTube·TikTok 조회수 자동 추적은 어떻게 작동하나요?",
        a: "각 플랫폼에서 무료로 발급되는 API 키를 설정에 한 번 등록하시면, 매일 자동으로 영상별 조회수·좋아요·댓글이 갱신됩니다. API 키 발급 가이드는 프로그램 안에 포함되어 있어 따라 하시면 됩니다.",
      },
      {
        q: "YouTube API 키는 어디서 받나요? 무료인가요?",
        a: "Google Cloud Console (console.cloud.google.com)에서 무료로 발급받을 수 있습니다. 일일 10,000 단위까지 무료 사용 가능하여 일반적인 사용량에는 충분합니다. 프로그램 내 설정 페이지에 상세한 발급 가이드가 포함되어 있어 따라 하시면 5분 내에 발급 가능합니다.",
      },
      {
        q: "광고 단가가 채널마다 다른데 채널별로 설정 가능한가요?",
        a: "네, 가능합니다. 설정 페이지에서 채널별 1조회수당 단가(CPV)를 따로 설정할 수 있습니다. 예: 메인 채널 ₩3.5, 부채널 ₩1.8, 쇼츠 채널 ₩0.5 등 자유롭게 입력 가능합니다.",
      },
      {
        q: "정산·급여명세서 계산은 정확한가요?",
        a: "작업자별 단가, 구간 보너스, 누적 보너스, 원천징수 3.3%까지 모두 자동으로 계산합니다. 확정 전에 수동으로 확인·수정도 가능하니 안심하고 사용하실 수 있습니다. 한국 표준 양식에 맞춰 PDF 출력도 자동 지원합니다.",
      },
      {
        q: "정산서를 PDF로 받을 수 있나요?",
        a: "네, 정산 확정 후 한 번의 클릭으로 PDF 출력이 가능합니다. 회사 로고·도장 이미지가 포함된 깔끔한 한국식 양식의 명세서로 작업자에게 바로 전달 가능합니다.",
      },
      {
        q: "작업자가 매번 보고서를 보고 싶다는데 자동화 가능한가요?",
        a: "네, 가능합니다. 설정 페이지의 \"자동 이메일 발송\"에서 주간/월간 보고서를 활성화하시면, 매주 정해진 요일에 자동으로 보고서가 발송됩니다. 발송 대상 작업자, 발송 시간, 포함할 내용을 자유롭게 설정 가능합니다.",
      },
    ],
  },
  {
    title: "🌐 시스템·플랫폼",
    items: [
      {
        q: "Windows 버전은 언제 출시되나요?",
        a: "현재 개발 중이며 곧 출시 예정입니다. 출시 즉시 카카오톡 오픈채팅방으로 공지드리며, 베타 신청하신 이메일로도 안내드립니다.",
      },
      {
        q: "인터넷 연결이 항상 필요한가요?",
        a: "아니요. 조회수 자동 추적·이메일 보고서 발송·라이선스 활성화 시에만 인터넷이 필요합니다. 의뢰 등록·정산 계산·급여명세서 PDF 출력 등 핵심 기능은 오프라인에서도 정상 작동합니다.",
      },
      {
        q: "프로그램 업데이트는 어떻게 받나요?",
        a: "새 버전이 출시되면 프로그램 실행 시 상단에 \"새 버전 출시!\" 알림 배너가 자동으로 표시됩니다. \"업데이트 받기\" 버튼을 클릭하면 새 버전 파일이 자동 다운로드되어 Finder에 표시됩니다. /Applications 폴더로 드래그하면 설치 완료, 다음 실행 시 새 버전이 작동합니다.",
      },
      {
        q: "macOS 어떤 버전부터 지원하나요?",
        a: "macOS 10.12 (Sierra) 이상에서 작동합니다. 최신 macOS 모두 지원하며 Intel Mac과 Apple Silicon (M1·M2·M3·M4) 둘 다 호환됩니다.",
      },
    ],
  },
];

// 평탄화 (총 개수 등 계산용)
const ALL_FAQS = FAQ_CATEGORIES.flatMap((c) => c.items);

const PERSONAS: { icon: string; title: string; desc: string }[] = [
  {
    icon: "🎬",
    title: "외주 영상편집자가 3명 이상",
    desc: "여러 작업자에게 의뢰는 줬는데, 누가 어디까지 했는지 매번 카톡으로 묻고 답하는 게 일이 된 1인 미디어 운영자",
  },
  {
    icon: "💼",
    title: "매달 정산이 스트레스",
    desc: "월말마다 작업자별 영상 수·단가·구간 보너스를 엑셀에 손으로 계산하고, 명세서는 따로 또 만들고 있는 사장님",
  },
  {
    icon: "📺",
    title: "채널을 여러 개 운영 중",
    desc: "메인·부채널·여러 플랫폼을 함께 굴리고 있는데 어느 채널이 진짜 돈이 되는지 헷갈리는 콘텐츠 사업자",
  },
];

const STEPS: { icon: string; title: string; desc: string }[] = [
  {
    icon: "⬇",
    title: "다운로드 & 설치",
    desc: "macOS 한 번 클릭으로 설치 완료. 시리얼 키 입력하면 바로 시작.",
  },
  {
    icon: "👥",
    title: "작업자 등록",
    desc: "이름·연락처·단가·구간 보너스 설정. 한 번만 등록하면 끝.",
  },
  {
    icon: "📋",
    title: "의뢰 등록",
    desc: "주제·작업자·영상 URL 입력. 칸반 보드에서 진행 상태 자동 추적.",
  },
  {
    icon: "💰",
    title: "자동 정산",
    desc: "월말에 버튼 한 번 → 정산서·급여명세서 PDF 자동 생성.",
  },
];

const COMPARISON: { item: string; excel: string; ours: string }[] = [
  { item: "조회수 추적", excel: "매일 사이트 들어가 수동 입력", ours: "API 연동으로 매일 자동 갱신" },
  { item: "정산 계산", excel: "수기 계산 + 검산 반복", ours: "단가·보너스·원천징수 자동 계산" },
  { item: "급여명세서", excel: "워드·엑셀로 따로 작성", ours: "버튼 한 번 → PDF 자동 출력" },
  { item: "주간/월간 보고서", excel: "직접 차트 그리기", ours: "정한 요일에 자동 이메일 발송" },
  { item: "데이터 백업", excel: "파일 일일이 복사", ours: "백업·복원 메뉴 한 번 클릭" },
  { item: "여러 채널 수익 분리", excel: "시트마다 따로 정리", ours: "채널별 예상 수익 자동 분리" },
];

const SCREENSHOTS: { icon: string; title: string; desc: string }[] = [
  { icon: "📊", title: "대시보드 KPI", desc: "월간 조회수·예상 수익·작업 진행률을 한 화면에" },
  { icon: "📋", title: "칸반 보드", desc: "제안 → 작업중 → 완료. 드래그 한 번으로 상태 변경" },
  { icon: "💰", title: "자동 정산", desc: "작업자별 단가·보너스·세금이 실시간으로 계산" },
  { icon: "📄", title: "급여명세서 PDF", desc: "회사 로고·도장 이미지 포함 깔끔한 명세서 출력" },
  { icon: "📈", title: "주간 보고서", desc: "조회수 추이·작업자별 성과를 차트로 시각화" },
  { icon: "🎬", title: "영상 라이브러리", desc: "플랫폼별 영상 통합 관리 + 자동 메타데이터 추적" },
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
              macOS · Windows 지원 · 데이터는 내 컴퓨터에만 저장 · 베타 기간 무료
            </p>
          </div>
        </div>
      </section>

      {/* Target Persona */}
      <section id="who" className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-2">
              이런 분께 추천
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">혹시 이런 상황이세요?</h2>
            <p className="text-slate-400">한 가지라도 해당된다면 — 이 프로그램이 답입니다</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PERSONAS.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-xl bg-emerald-900/10 border border-emerald-800/40 hover:border-emerald-600/70 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-emerald-400 text-xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-100 leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
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

      {/* How it works */}
      <section id="how" className="border-t border-slate-800 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-2">
              사용 흐름
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">5분이면 시작합니다</h2>
            <p className="text-slate-400">복잡한 설정 없이, 4단계로 끝</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="relative p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-700/50 transition-colors"
              >
                <div className="absolute -top-3 -left-2 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-blue-900/50">
                  {i + 1}
                </div>
                <div className="text-3xl mb-3 mt-1">{s.icon}</div>
                <h3 className="text-base font-semibold mb-2 text-slate-100">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Excel vs Ours */}
      <section id="why" className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-wider text-rose-400 uppercase mb-2">
              엑셀과 비교하면
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">손으로 하던 일, 자동으로</h2>
            <p className="text-slate-400">엑셀로 8시간 걸리던 일이 클릭 한 번으로</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl shadow-black/30">
            <div className="grid grid-cols-3 bg-slate-900 text-xs sm:text-sm font-semibold">
              <div className="px-3 sm:px-5 py-4 text-slate-400">항목</div>
              <div className="px-3 sm:px-5 py-4 border-l border-slate-800 text-rose-300">
                엑셀로 할 때
              </div>
              <div className="px-3 sm:px-5 py-4 border-l border-slate-800 text-emerald-300">
                프리랜서 관리
              </div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 text-xs sm:text-sm ${
                  i % 2 === 0 ? 'bg-slate-950/60' : 'bg-slate-900/30'
                }`}
              >
                <div className="px-3 sm:px-5 py-4 font-medium text-slate-200">
                  {row.item}
                </div>
                <div className="px-3 sm:px-5 py-4 border-l border-slate-800 text-slate-500">
                  <span className="text-rose-500 mr-1">✕</span>
                  {row.excel}
                </div>
                <div className="px-3 sm:px-5 py-4 border-l border-slate-800 text-emerald-200">
                  <span className="text-emerald-400 mr-1">✓</span>
                  {row.ours}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section id="screenshots" className="border-t border-slate-800 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-wider text-sky-400 uppercase mb-2">
              화면 미리보기
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">실제 작동하는 화면</h2>
            <p className="text-slate-400">백 마디 설명보다 한 장의 화면</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCREENSHOTS.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-700/50 transition-colors overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-800/40 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-700 border-b border-slate-800">
                  <div className="text-5xl mb-2 opacity-70">{s.icon}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-600">
                    coming soon
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold mb-1 text-slate-100">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-xs text-slate-500">
            📷 실제 화면 캡처는 곧 업데이트됩니다
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-800 bg-gradient-to-b from-slate-950 via-blue-950/10 to-slate-950">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-2">
              요금제
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              간단한 요금, 모든 기능 포함
            </h2>
            <p className="text-slate-400">복잡한 플랜 비교 없이, 한 가지면 충분합니다</p>
          </div>

          <div
            id="signup"
            className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-blue-700/40 p-8 md:p-10 shadow-2xl shadow-blue-900/30 overflow-hidden scroll-mt-24"
          >
            {/* 베타 뱃지 */}
            <div className="absolute top-6 right-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
                🎁 베타 진행 중
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">프리랜서 관리 Pro</h3>
            <p className="text-sm text-slate-400 mb-8">
              영상 콘텐츠 사업자를 위한 올인원 자동화
            </p>

            {/* 가격 영역 */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  무료
                </span>
                <span className="text-lg text-slate-400">/ 베타 기간</span>
              </div>
              <div className="text-sm text-slate-500">
                정식 출시 시 가격을 별도 안내드립니다
              </div>
            </div>

            {/* 혜택 리스트 */}
            <ul className="space-y-3 mb-8">
              {[
                "무제한 작업자 등록",
                "무제한 의뢰·영상 관리",
                "조회수 자동 추적 (YouTube·TikTok·Instagram)",
                "정산·급여명세서 PDF 자동 생성",
                "주간/월간 자동 보고서 이메일 발송",
                "채널별 예상 수익 자동 분리",
                "데이터 로컬 저장 + 백업·복원",
                "정기 무료 업데이트",
                "우선 카카오톡 지원",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0 font-bold">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA 버튼 — 클릭 시 베타 신청 모달 열림 */}
            <BetaSignupButton kakaoUrl={KAKAO_OPEN_CHAT} />

            <p className="text-center mt-4 text-xs text-slate-500">
              이메일 입력 → 시리얼 키 즉시 발송 (수동 발급 X)
            </p>

            {/* 키 찾기 — 이미 신청한 사용자용 */}
            <div className="mt-5 pt-5 border-t border-slate-800/60 text-center">
              <LicenseRecoveryButton />
            </div>
          </div>

          {/* 정식 출시 후 안내 */}
          <div className="mt-8 p-5 rounded-xl bg-slate-900/40 border border-slate-800 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 flex-shrink-0 text-lg">ℹ️</span>
              <div className="flex-1">
                <p className="font-medium text-slate-200 mb-2">정식 출시 후 안내</p>
                <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
                  <li>· 월 구독제로 운영되며, 언제든 해지 가능합니다</li>
                  <li>· 7일 무료 체험 후 자동 결제 (체험 기간 중 해지 시 결제 X)</li>
                  <li>· 토스페이먼츠 정기결제 — 카드 · 카카오페이 · 네이버페이 지원 예정</li>
                  <li>· 구독 해지 시 다음 결제만 중단 (이미 결제된 기간 계속 이용 가능)</li>
                  <li>· 베타 사용자에게는 정식 출시 직전 별도 안내드립니다</li>
                </ul>
              </div>
            </div>
          </div>
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

      {/* FAQ — 항상 펼친 형태, 카테고리별 그룹 */}
      <section id="faq" className="border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-wider text-purple-400 uppercase mb-2">
              자주 묻는 질문
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQ</h2>
            <p className="text-slate-400">
              {ALL_FAQS.length}개 질문에 미리 답변드렸습니다
            </p>
          </div>

          {FAQ_CATEGORIES.map((cat) => (
            <div key={cat.title} className="mb-10 last:mb-0">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-800/70">
                {cat.title}
              </h3>
              <div className="space-y-5">
                {cat.items.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-900/60 border border-slate-800 px-5 py-4 hover:border-slate-700 transition-colors"
                  >
                    <p className="text-base font-semibold text-slate-100 leading-snug mb-2.5">
                      <span className="text-purple-400 mr-2">Q.</span>
                      {f.q}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed pl-5">
                      <span className="text-emerald-400 mr-2 font-semibold -ml-5">
                        A.
                      </span>
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-center mt-12 text-sm text-slate-500">
            여기에 없는 궁금증이 있다면{" "}
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
        <div className="max-w-6xl mx-auto px-6">
          {/* 메인 네비게이션 */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 mb-8">
            <div>© {new Date().getFullYear()} 프리랜서 관리 · 영상 콘텐츠 사업자용 자동화</div>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="#features" className="hover:text-slate-300">
                기능
              </Link>
              <Link href="#how" className="hover:text-slate-300">
                사용 흐름
              </Link>
              <Link href="#pricing" className="hover:text-slate-300">
                요금제
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

          {/* 법적 링크 + 사업자 정보 */}
          <div className="pt-6 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-start gap-4 text-xs text-slate-500">
            <div className="space-y-1.5 leading-relaxed">
              <div className="text-slate-400 font-medium">수우튜디오</div>
              <div>대표: 강희덕 · 사업자등록번호 735-36-01496</div>
              <div>인천시 남동구 담방로21번길 24, 광명아파트 101동 1206호</div>
              <div>
                <a href="mailto:freelancer-manager@naver.com" className="hover:text-slate-300">
                  freelancer-manager@naver.com
                </a>
                {' · '}
                <a href="tel:01050684607" className="hover:text-slate-300">
                  010-5068-4607
                </a>
              </div>
            </div>
            <div className="flex gap-4 shrink-0 flex-wrap justify-end">
              <LicenseRecoveryButton className="hover:text-slate-300 cursor-pointer transition-colors" />
              <Link href="/terms" className="hover:text-slate-300">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-slate-300 font-medium text-slate-400">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
