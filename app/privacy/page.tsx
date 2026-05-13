import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 프리랜서 관리",
  description: "프리랜서 관리 개인정보처리방침",
};

const COMPANY = {
  name: "수우튜디오",
  ceo: "강희덕",
  bizNumber: "735-36-01496",
  address: "인천시 남동구 담방로21번길 24, 광명아파트 101동 1206호",
  phone: "010-5068-4607",
  email: "jiangxide@naver.com",
  kakao: "https://open.kakao.com/o/g39v5pui",
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

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      {/* Top navigation */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>←</span>
            <span>홈으로</span>
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-12 pb-8 border-b border-slate-800">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            개인정보처리방침
          </h1>
          <p className="text-sm text-slate-500">
            시행일: {COMPANY.effectiveDate}
          </p>
        </header>

        {/* Highlight box */}
        <div className="mb-10 p-5 rounded-xl bg-emerald-900/15 border border-emerald-800/40 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 flex-shrink-0 text-lg">🔒</span>
            <div>
              <p className="font-semibold text-emerald-300 mb-1">
                중요: 이용자 데이터는 로컬에만 저장됩니다
              </p>
              <p className="text-slate-300 leading-relaxed">
                프리랜서 관리는 데스크톱 애플리케이션입니다. 작업자 정보, 의뢰 내역,
                정산 자료 등 모든 업무 데이터는 이용자의 컴퓨터에만 로컬로
                저장되며, 회사 서버에 전송되지 않습니다. 회사는 서비스 운영에
                필요한 최소한의 정보(이메일, 결제 정보 등)만 처리합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 leading-relaxed text-sm">
          <Article title="제1조 (수집하는 개인정보 항목)">
            <p>회사는 서비스 제공을 위해 다음의 최소한의 개인정보를 수집합니다.</p>

            <div className="ml-2 space-y-3 mt-3">
              <div>
                <p className="font-semibold text-slate-200 mb-1">
                  ① 필수 수집 항목
                </p>
                <ul className="list-disc ml-5 space-y-1 text-slate-400">
                  <li>이메일 주소</li>
                  <li>
                    결제 정보 (결제대행사를 통한 카드 정보 처리, 회사는 카드 번호를
                    직접 보관하지 않음)
                  </li>
                  <li>시리얼 키 발급·관리에 필요한 식별자</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-slate-200 mb-1">
                  ② 선택 수집 항목
                </p>
                <ul className="list-disc ml-5 space-y-1 text-slate-400">
                  <li>이름 또는 닉네임</li>
                  <li>연락처 (카카오톡 오픈채팅 ID)</li>
                  <li>사업자 정보 (B2B 결제 시)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-slate-200 mb-1">
                  ③ 자동 수집 항목
                </p>
                <ul className="list-disc ml-5 space-y-1 text-slate-400">
                  <li>서비스 이용 기록 (라이선스 인증 로그)</li>
                  <li>결제 거래 정보</li>
                </ul>
              </div>
            </div>
          </Article>

          <Article title="제2조 (개인정보의 수집 및 이용목적)">
            <p>
              회사는 수집한 개인정보를 다음의 목적으로만 이용하며, 목적이 변경될
              경우 사전에 동의를 구합니다.
            </p>
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>서비스 가입 및 시리얼 키 발급·관리</li>
              <li>정기 결제 처리 및 영수증 발급</li>
              <li>고객 문의 응대 및 기술 지원</li>
              <li>서비스 이용 안내, 약관 변경 등 필수적 공지</li>
              <li>부정 이용 방지 및 비인가 사용 차단</li>
            </ol>
          </Article>

          <Article title="제3조 (개인정보의 보유 및 이용기간)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                이용자의 개인정보는 회원 가입 시점부터 구독 해지 후 1년까지
                보유합니다.
              </li>
              <li>
                다음의 정보는 관련 법령에 따라 명시된 기간 동안 보관합니다.
                <ul className="list-disc ml-5 mt-1.5 space-y-1 text-slate-400">
                  <li>결제 및 거래 기록: 5년 (전자상거래법)</li>
                  <li>소비자 불만 및 분쟁처리 기록: 3년 (전자상거래법)</li>
                  <li>표시·광고에 관한 기록: 6개월 (전자상거래법)</li>
                </ul>
              </li>
            </ol>
          </Article>

          <Article title="제4조 (개인정보의 제3자 제공)">
            <p>
              회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의
              경우는 예외로 합니다.
            </p>
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의해 요구되는 경우</li>
              <li>수사기관의 적법한 절차에 따른 요청이 있는 경우</li>
            </ol>
          </Article>

          <Article title="제5조 (개인정보 처리위탁)">
            <p>
              회사는 서비스 제공을 위해 다음 업체에 개인정보 처리를 위탁하고
              있습니다.
            </p>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold border-b border-slate-800">
                      수탁업체
                    </th>
                    <th className="px-3 py-2 text-left font-semibold border-b border-slate-800">
                      위탁업무
                    </th>
                    <th className="px-3 py-2 text-left font-semibold border-b border-slate-800">
                      보유 및 이용기간
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-slate-800">
                    <td className="px-3 py-2.5">토스페이먼츠</td>
                    <td className="px-3 py-2.5">결제 처리 및 정산</td>
                    <td className="px-3 py-2.5">결제 종료 후 5년</td>
                  </tr>
                  <tr className="border-b border-slate-800 bg-slate-900/30">
                    <td className="px-3 py-2.5">Resend</td>
                    <td className="px-3 py-2.5">이메일 발송</td>
                    <td className="px-3 py-2.5">발송 후 즉시 파기</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="px-3 py-2.5">Vercel</td>
                    <td className="px-3 py-2.5">웹사이트 호스팅</td>
                    <td className="px-3 py-2.5">서비스 종료 시까지</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2.5">Supabase</td>
                    <td className="px-3 py-2.5">시리얼 키 관리 DB</td>
                    <td className="px-3 py-2.5">구독 해지 후 1년</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Article>

          <Article title="제6조 (정보주체의 권리와 행사방법)">
            <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>개인정보 열람 요청</li>
              <li>개인정보 수정 요청</li>
              <li>개인정보 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>개인정보 처리 동의 철회</li>
            </ol>
            <p className="mt-2">
              권리 행사는 아래 개인정보 보호책임자의 연락처로 요청하실 수 있으며,
              회사는 지체 없이 조치하겠습니다.
            </p>
          </Article>

          <Article title="제7조 (개인정보의 파기절차 및 방법)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                회사는 개인정보 보유기간이 경과한 경우 지체 없이 해당 정보를
                파기합니다.
              </li>
              <li>
                전자적 파일 형태의 정보는 복구 불가능한 방법으로 영구 삭제하며,
                종이 문서는 분쇄하거나 소각합니다.
              </li>
            </ol>
          </Article>

          <Article title="제8조 (개인정보의 안전성 확보조치)">
            <p>
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다.
            </p>
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                <span className="font-medium text-slate-200">관리적 조치</span>:
                내부관리계획 수립·시행, 정기적 직원 교육
              </li>
              <li>
                <span className="font-medium text-slate-200">기술적 조치</span>:
                개인정보처리시스템의 접근권한 관리, 접근통제, 암호화 전송(HTTPS),
                중요 정보 암호화 저장
              </li>
              <li>
                <span className="font-medium text-slate-200">물리적 조치</span>:
                전산실 및 자료보관실 접근통제
              </li>
            </ol>
          </Article>

          <Article title="제9조 (개인정보 보호책임자 및 담당부서)">
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 개인정보 처리와
              관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
              보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-3 p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-slate-300">
              <div>
                <span className="text-slate-500 mr-2">개인정보 보호책임자:</span>
                {COMPANY.ceo} (대표)
              </div>
              <div>
                <span className="text-slate-500 mr-2">연락처:</span>
                {COMPANY.phone}
              </div>
              <div>
                <span className="text-slate-500 mr-2">이메일:</span>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  {COMPANY.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 mr-2">카카오톡:</span>
                <a
                  href={COMPANY.kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  오픈채팅 바로가기
                </a>
              </div>
            </div>
          </Article>

          <Article title="제10조 (권익침해 구제방법)">
            <p>
              이용자는 개인정보 침해로 인한 신고나 상담이 필요할 경우 아래 기관에
              문의하실 수 있습니다.
            </p>
            <ul className="list-disc ml-5 space-y-1 text-slate-400 mt-2">
              <li>개인정보보호위원회 (privacy.go.kr / ☎ 국번없이 1833-6972)</li>
              <li>개인정보침해 신고센터 (privacy.go.kr / ☎ 국번없이 118)</li>
              <li>대검찰청 사이버범죄수사단 (spo.go.kr / ☎ 국번없이 1301)</li>
              <li>경찰청 사이버수사국 (ecrm.cyber.go.kr / ☎ 국번없이 182)</li>
            </ul>
          </Article>

          <Article title="제11조 (개인정보처리방침의 변경)">
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>
                본 개인정보처리방침은 {COMPANY.effectiveDate}부터 적용됩니다.
              </li>
              <li>
                본 방침의 변경이 있는 경우 회사는 변경 사항을 시행일 7일 전부터
                공지합니다.
              </li>
            </ol>
          </Article>

          <section className="pt-8 mt-12 border-t border-slate-800">
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
