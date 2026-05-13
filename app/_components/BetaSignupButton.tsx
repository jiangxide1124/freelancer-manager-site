"use client";

import { useState, useEffect } from "react";

type Result =
  | { type: "success"; message: string }
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

      if (response.ok && data?.success) {
        setResult({
          type: "success",
          message:
            data.message ||
            "시리얼 키를 이메일로 발송했습니다. 메일함을 확인해주세요.",
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
        className="block w-full text-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg transition-all shadow-lg shadow-blue-900/50 cursor-pointer"
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

            {result?.type === "success" ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">📬</div>
                <h3 className="text-xl font-bold text-emerald-300 mb-3">
                  발송 완료!
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {result.message}
                </p>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left mb-6 leading-relaxed">
                  <p className="font-medium text-slate-300 mb-1">📩 다음 단계</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>이메일 메일함 확인 (스팸함도 한 번 보세요)</li>
                    <li>받은 시리얼 키 복사</li>
                    <li>프로그램 다운로드 후 키 입력</li>
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
                >
                  확인
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
                    이메일을 입력하시면 시리얼 키를 즉시 발송해드립니다.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      이메일 <span className="text-rose-400">*</span>
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
                      placeholder="your@email.com"
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
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={submitting}
                      maxLength={30}
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
