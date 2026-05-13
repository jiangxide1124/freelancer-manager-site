import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 — 프리랜서 관리",
  description: "프리랜서 관리 서비스 이용약관",
};

const COMPANY = {
  name: "수우튜디오",
  ceo: "강희덕",
  bizNumber: "735-36-01496",
  address: "인천시 남동구 담방로21번길 24, 광명아파트 101동 1206호",
  phone: "010-5068-4607",
  email: "freelancer-manager@naver.com",
  effectiveDate: "2026년 5월 13일",
};

function Article({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-100 mb-3">{title}</h2>
      <div className="space-y-2 text-slate-300">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="flex-1">
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-12 pb-8 border-b border-slate-800">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">서비스 이용약관</h1>
          <p className="text-sm text-slate-500">
            시행일: {COMPANY.effectiveDate}
          </p>
        </header>

        <div className="space-y-10 leading-relaxed text-sm">
          <Article title="제1조 (목적)">
            <p>
              본 약관은 {COMPANY.name}(이하 &ldquo;회사&rdquo;)가 제공하는 영상 콘텐츠 사업자용
              프리랜서 관리 프로그램 &ldquo;프리랜서 관리&rdquo;(이하 &ldquo;서비스&rdquo;)의
              이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한
              사항을 규정함을 목적으로 합니다.
            </p>
          </Article>

          <Article title="제2조 (용어의 정의)">
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                &ldquo;서비스&rdquo;란 회사가 데스크톱 애플리케이션 형태로 제공하는 영상
                콘텐츠 의뢰·정산·작업자 관리 자동화 프로그램을 의미합니다.
              </li>
              <li>
                &ldquo;이용자&rdquo;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는
                회원 및 비회원을 의미합니다.
              </li>
              <li>
                &ldquo;시리얼 키&rdquo;란 이용자가 서비스를 이용할 수 있도록 회사가
                발급하는 고유 인증 키를 의미합니다.
              </li>
              <li>
                &ldquo;구독&rdquo;이란 이용자가 일정 기간 동안 정기 결제를 통해
                서비스를 이용할 수 있는 권리를 의미합니다.
              </li>
            </ol>
          </Article>

          <Article title="제3조 (약관의 효력 및 변경)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을
                발생합니다.
              </li>
              <li>
                회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 개정할 수
                있으며, 약관이 변경되는 경우 변경된 약관의 적용일자 7일 전부터
                공지합니다. 다만 이용자에게 불리한 변경의 경우에는 30일 전부터
                공지합니다.
              </li>
              <li>
                이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고
                구독을 해지할 수 있습니다.
              </li>
            </ol>
          </Article>

          <Article title="제4조 (서비스의 제공)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                회사는 다음과 같은 서비스를 제공합니다.
                <ul className="list-disc ml-5 mt-1.5 space-y-1 text-slate-400">
                  <li>영상편집 외주 의뢰 관리 (제안·작업중·완료 상태 추적)</li>
                  <li>프리랜서 작업자 정보 관리</li>
                  <li>YouTube·TikTok·Instagram 영상 조회수 자동 추적</li>
                  <li>작업자별 정산 자동 계산 및 급여명세서 PDF 출력</li>
                  <li>주간·월간 성과 보고서 자동 이메일 발송</li>
                  <li>데이터 백업 및 복원</li>
                </ul>
              </li>
              <li>
                회사는 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 합니다.
                다만 시스템 점검, 장애, 천재지변 등의 사유로 일시적으로 서비스가
                중단될 수 있습니다.
              </li>
            </ol>
          </Article>

          <Article title="제5조 (서비스의 변경 및 중단)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                회사는 안정적인 서비스 제공을 위해 서비스의 내용을 변경할 수
                있으며, 이 경우 변경된 내용을 사전에 공지합니다.
              </li>
              <li>
                회사는 다음 각 호의 경우 서비스의 전부 또는 일부를 제한하거나
                중단할 수 있습니다.
                <ul className="list-disc ml-5 mt-1.5 space-y-1 text-slate-400">
                  <li>서비스 설비의 보수 등 공사로 인한 부득이한 경우</li>
                  <li>정전, 통신 장애, 시스템 점검 등 운영상 필요한 경우</li>
                  <li>전시, 사변, 천재지변, 국가 비상사태 등 불가항력적 사유</li>
                </ul>
              </li>
            </ol>
          </Article>

          <Article title="제6조 (이용계약의 성립 및 시리얼 키 발급)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                이용계약은 이용자가 본 약관에 동의하고 회사가 발급한 시리얼 키를
                서비스에 입력하여 인증을 완료한 시점에 성립합니다.
              </li>
              <li>
                시리얼 키는 결제 완료 후 회사가 이용자에게 이메일 또는 카카오톡
                오픈채팅을 통해 발급합니다.
              </li>
              <li>
                시리얼 키는 1개의 컴퓨터에서만 사용 가능하며, 이용자는 이를
                제3자에게 양도, 대여, 판매할 수 없습니다.
              </li>
            </ol>
          </Article>

          <Article title="제7조 (이용료 및 결제)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                서비스의 이용료는 월 구독 형태로 부과되며, 구체적인 요금은 회사
                웹사이트에 게시된 바에 따릅니다.
              </li>
              <li>
                결제 수단은 회사가 지정한 결제대행사(토스페이먼츠 등)를 통해
                처리됩니다.
              </li>
              <li>
                회사는 신규 가입자에게 7일의 무료 체험 기간을 제공하며, 무료 체험
                기간 종료 후 자동으로 정기 결제가 진행됩니다.
              </li>
              <li>
                베타 서비스 기간 동안은 무료로 제공되며, 정식 출시 시 회사는 베타
                사용자에게 별도 안내합니다.
              </li>
            </ol>
          </Article>

          <Article title="제8조 (구독 해지 및 환불)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                이용자는 언제든지 구독을 해지할 수 있으며, 해지 시 다음 결제일부터
                결제가 중단됩니다. 이미 결제된 기간 동안에는 서비스를 계속
                이용하실 수 있습니다.
              </li>
              <li>
                환불 정책은 다음과 같습니다.
                <ul className="list-disc ml-5 mt-1.5 space-y-1 text-slate-400">
                  <li>
                    <span className="text-slate-300 font-medium">
                      7일 무료 체험 기간 중 해지
                    </span>
                    : 결제가 발생하지 않습니다.
                  </li>
                  <li>
                    <span className="text-slate-300 font-medium">
                      결제 완료 후
                    </span>
                    : 구독 해지로 다음 결제만 중단되며, 이미 결제된 금액은 환불되지
                    않습니다.
                  </li>
                  <li>
                    <span className="text-slate-300 font-medium">
                      청약 철회 (전자상거래법 제17조)
                    </span>
                    : 결제일로부터 7일 이내, 서비스를 한 번도 이용하지 않은 경우에
                    한하여 청약 철회 및 환불이 가능합니다. 서비스 이용(시리얼 키
                    인증 또는 앱 실행) 시점부터는 청약 철회가 제한됩니다.
                  </li>
                  <li>
                    <span className="text-slate-300 font-medium">
                      회사 귀책 사유
                    </span>
                    : 서비스 장기 중단 등 회사의 귀책 사유로 서비스 이용이 불가능한
                    경우 잔여 기간을 일할 계산하여 환불해드립니다.
                  </li>
                </ul>
              </li>
              <li>
                구독 해지 및 환불 신청은 카카오톡 오픈채팅 또는 이메일을 통해
                요청하실 수 있습니다.
              </li>
              <li>
                구독제는 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조
                제2항 제5호(용역 또는 디지털콘텐츠의 제공이 개시된 경우)에 따라
                청약 철회가 제한될 수 있음을 회사는 결제 전 명확히 고지합니다.
              </li>
            </ol>
          </Article>

          <Article title="제9조 (이용자의 의무)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                이용자는 다음 각 호의 행위를 하여서는 안 됩니다.
                <ul className="list-disc ml-5 mt-1.5 space-y-1 text-slate-400">
                  <li>시리얼 키의 불법 복제, 양도, 판매</li>
                  <li>
                    서비스의 역공학(reverse engineering), 디컴파일, 소스 코드 추출
                  </li>
                  <li>
                    자동화된 방법으로 서비스에 접근하거나 부하를 발생시키는 행위
                  </li>
                  <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
                  <li>서비스를 통해 제3자의 권리를 침해하는 행위</li>
                  <li>관련 법령에 위반되는 행위</li>
                </ul>
              </li>
              <li>
                이용자는 자신의 시리얼 키 및 계정 정보를 안전하게 관리할 책임이
                있습니다.
              </li>
            </ol>
          </Article>

          <Article title="제10조 (지적재산권)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                서비스에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.
              </li>
              <li>
                이용자가 서비스를 통해 입력·생성한 데이터(작업자 정보, 의뢰 내역,
                정산 자료 등)에 대한 모든 권리는 이용자에게 귀속되며, 회사는 이에
                대한 어떠한 권리도 주장하지 않습니다.
              </li>
              <li>
                이용자의 데이터는 이용자의 컴퓨터에 로컬로 저장되며, 회사 서버에
                전송되지 않습니다.
              </li>
            </ol>
          </Article>

          <Article title="제11조 (개인정보의 보호)">
            <p>
              회사는 이용자의 개인정보를 보호하기 위해 별도의{" "}
              <Link
                href="/privacy"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                개인정보처리방침
              </Link>
              을 두며, 관련 법령에 따라 이를 준수합니다.
            </p>
          </Article>

          <Article title="제12조 (면책 및 손해배상)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                회사는 천재지변, 전쟁, 기간 통신사업자의 서비스 중지 등 불가항력적
                사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
              </li>
              <li>
                회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을
                지지 않습니다.
              </li>
              <li>
                회사는 이용자가 서비스를 통해 얻은 자료를 신뢰함으로 인해 발생한
                손해에 대해 책임을 지지 않습니다.
              </li>
              <li>
                회사는 무료로 제공되는 서비스의 이용과 관련하여 관련 법령에 특별한
                규정이 없는 한 책임을 지지 않습니다.
              </li>
              <li>
                외부 API(YouTube, TikTok 등)의 정책 변경, 응답 지연, 오류 등으로
                인한 서비스 일부 기능의 제한에 대해 회사는 책임을 지지 않습니다.
              </li>
            </ol>
          </Article>

          <Article title="제13조 (관할 법원)">
            <p>
              서비스 이용으로 발생한 분쟁에 관한 소송은 회사의 소재지를 관할하는
              법원을 전속관할 법원으로 합니다.
            </p>
          </Article>

          <section className="pt-8 mt-12 border-t border-slate-800">
            <h2 className="text-lg font-bold text-slate-100 mb-3">부칙</h2>
            <p className="text-slate-300 mb-6">
              본 약관은 {COMPANY.effectiveDate}부터 시행합니다.
            </p>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-200 mb-2">사업자 정보</div>
              <div>회사명: {COMPANY.name}</div>
              <div>대표자: {COMPANY.ceo}</div>
              <div>사업자등록번호: {COMPANY.bizNumber}</div>
              <div>사업장 주소: {COMPANY.address}</div>
              <div>연락처: {COMPANY.phone}</div>
              <div>이메일: {COMPANY.email}</div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
