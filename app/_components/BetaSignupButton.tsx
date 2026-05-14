"use client";

import { useState, useEffect } from "react";

/**
 * 한국 전화번호 자동 하이픈 (3-4-4 패턴)
 * 입력값에서 숫자만 추출 후 위치별로 "-" 삽입
 */
function formatKoreanPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

type Result =
  | { type: "issued"; licenseKey: string }   // 키 발급 성공 — 화면에 직접 표시
  | { type: "error"; message: string }
  | null;

export default function BetaSignupButton({ kakaoUrl }: { kakaoUrl: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        setOpen(false);
        setResult(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, submitting]);

  // 모달 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const close = () => {
    if (submitting) return;
    setOpen(false);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!agreed) {
      setResult({
        type: "error",
        message: "이용약관 및 개인정보처리방침에 동의해주세요.",
      });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/license/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success && data?.license_key) {
        setResult({
          type: "issued",
          licenseKey: data.license_key,
        });
        setEmail("");
        setName("");
        setPhone("");
        setAgreed(false);
      } else {
        setResult({
          type: "error",
          message: data?.error || `처리 중 오류가 발생했습니다. (HTTP ${response.status})`,
        });
      }
    } catch (err) {
      setResult({
        type: "error",
        message:
          err instanceof Error
            ? `네트워크 오류: ${err.message}`
            : "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-base transition-all shadow-lg shadow-blue-900/50 cursor-pointer"
      >
        🎁 베타 무료로 시작하기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              disabled={submitting}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-40 transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>

            {result?.type === "issued" ? (
              <div className="py-2">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-emerald-300 mb-2">
                    시리얼 키 발급 완료!
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    아래 키를 <strong className="text-amber-300">꼭 복사해서</strong> 안전한 곳에 보관해주세요.
                  </p>
                </div>

                {/* 라이선스 키 박스 — 강조 */}
                <div className="p-4 rounded-xl bg-slate-950 border-2 border-emerald-700/50 mb-4 text-center">
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                    Your License Key
                  </p>
                  <p className="font-mono text-lg font-bold text-emerald-300 break-all select-all leading-relaxed mb-3">
                    {result.licenseKey}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(result.licenseKey).then(
                        () => alert("✅ 클립보드에 복사됐습니다.\n메모장이나 안전한 곳에 붙여넣어 보관해주세요."),
                        () => alert("복사 실패 — 직접 선택해서 복사해주세요.")
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
                  >
                    📋 키 복사하기
                  </button>
                </div>

                {/* 강력한 보관 안내 */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs text-amber-100 text-left mb-3 leading-relaxed">
                  <p className="font-bold text-amber-200 mb-1.5">⚠️ 반드시 보관 — 분실 시 재발급 어려움</p>
                  <p className="mb-2 text-amber-100/90">위 키를 다음 중 한 곳 이상에 <strong>꼭 복사</strong>해두세요:</p>
                  <ul className="ml-4 space-y-0.5 list-disc text-amber-100/80">
                    <li>메모장 / 텍스트 파일</li>
                    <li>1Password · Bitwarden 등 비밀번호 관리자</li>
                    <li>카카오톡 "나에게 보내기"</li>
                    <li>휴대폰 메모 앱</li>
                  </ul>
                </div>

                {/* 다음 단계 */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 text-left mb-4 leading-relaxed">
                  <p className="font-medium text-slate-200 mb-1.5">📥 다음 단계</p>
                  <ol className="list-decimal ml-4 space-y-0.5 text-slate-400">
                    <li>위 키 복사 → 안전한 곳 보관</li>
                    <li>프로그램 다운로드 (Mac DMG 또는 Windows EXE)</li>
                    <li>실행 → 시리얼 키 입력 화면에 붙여넣기 → 완료</li>
                  </ol>
                </div>

                {/* 카톡 백업 안내 */}
                <div className="p-3 rounded-lg bg-blue-900/15 border border-blue-700/40 text-xs text-slate-300 text-left mb-4 leading-relaxed">
                  <p className="font-medium text-blue-200 mb-1.5">💬 키를 잃어버리면</p>
                  <p className="mb-2 text-slate-400">사이트 메인의 "🔍 시리얼 키를 잊으셨나요?" 버튼으로 다시 확인하거나, 카카오톡 오픈채팅으로 문의해주세요.</p>
                  <a
                    href={kakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-xs font-semibold transition-colors"
                  >
                    💬 카카오톡 오픈채팅 열기
                  </a>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
                >
                  ✅ 키를 복사했습니다 — 닫기
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 mb-3">
                    🎁 베타 진행 중 · 무료
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    베타 무료 신청
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    이메일을 입력하시면 <strong className="text-emerald-300">시리얼 키가 즉시 화면에 표시</strong>됩니다. 키를 복사해서 안전한 곳에 보관해주세요.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      이메일 <span className="text-rose-400">*</span>
                      <span className="ml-1 text-slate-500 font-normal">— 본인 식별용</span>
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      placeholder="your-name@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-600 disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      이름{" "}
                      <span className="text-slate-600 font-normal">(선택)</span>
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                      maxLength={60}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-600 disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      전화번호{" "}
                      <span className="text-slate-600 font-normal">(선택)</span>
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) =>
                        setPhone(formatKoreanPhone(e.target.value))
                      }
                      disabled={submitting}
                      maxLength={13}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-600 disabled:opacity-50 transition-colors"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      긴급 안내·결제 문의 시 연락드릴 수 있어요
                    </p>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      disabled={submitting}
                      className="mt-0.5 flex-shrink-0 w-4 h-4 rounded cursor-pointer accent-blue-500"
                    />
                    <span>
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        이용약관
                      </a>
                      {" 및 "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        개인정보처리방침
                      </a>
                      에 동의합니다.
                    </span>
                  </label>

                  {result?.type === "error" && (
                    <div className="p-3 rounded-lg bg-rose-900/30 border border-rose-700/40 text-sm text-rose-200 leading-relaxed">
                      ⚠️ {result.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !email || !agreed}
                    className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        발송 중...
                      </span>
                    ) : (
                      "🎁 시리얼 키 받기"
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    문의는{" "}
                    <a
                      href={kakaoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 hover:underline"
                    >
                      카카오톡 오픈채팅
                    </a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
