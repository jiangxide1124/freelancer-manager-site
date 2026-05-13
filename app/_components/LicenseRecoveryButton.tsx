"use client";

import { useState, useEffect } from "react";

type Result =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export default function LicenseRecoveryButton({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, submitting]);

  // body 스크롤 잠금
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
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/license/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setResult({
          type: "success",
          message:
            data.message ||
            "발급된 시리얼 키가 있다면 이메일로 다시 발송했습니다.",
        });
        setEmail("");
      } else {
        setResult({
          type: "error",
          message:
            data?.error ||
            `오류가 발생했습니다 (HTTP ${response.status}). 다시 시도해주세요.`,
        });
      }
    } catch (err) {
      setResult({
        type: "error",
        message:
          err instanceof Error
            ? `네트워크 오류: ${err.message}`
            : "네트워크 오류가 발생했습니다.",
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
        className={
          className ||
          "text-xs text-slate-400 hover:text-slate-300 underline underline-offset-2 transition-colors"
        }
      >
        🔍 시리얼 키를 잊으셨나요?
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
                  메일을 보냈습니다
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {result.message}
                </p>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left mb-6 leading-relaxed">
                  <p className="font-medium text-slate-300 mb-1">📩 다음 단계</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>입력하신 이메일 메일함 확인</li>
                    <li>스팸함도 한 번 보세요</li>
                    <li>도착한 메일에서 시리얼 키 복사</li>
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-xs font-semibold text-purple-300 mb-3">
                    🔍 시리얼 키 찾기
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    키를 잊으셨나요?
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    신청 시 사용한 이메일을 입력하시면 발급된 시리얼 키를 다시
                    보내드립니다.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="recover-email"
                      className="block text-xs font-medium text-slate-400 mb-1.5"
                    >
                      신청 시 사용한 이메일{" "}
                      <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="recover-email"
                      type="email"
                      required
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white placeholder-slate-600 disabled:opacity-50 transition-colors"
                    />
                  </div>

                  {result?.type === "error" && (
                    <div className="p-3 rounded-lg bg-rose-900/30 border border-rose-700/40 text-sm text-rose-200 leading-relaxed">
                      ⚠️ {result.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !email}
                    className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold transition-all shadow-lg shadow-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        조회 중...
                      </span>
                    ) : (
                      "🔍 키 다시 보내기"
                    )}
                  </button>

                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-500 leading-relaxed">
                    <p className="mb-1 text-slate-400 font-medium">🔒 보안 안내</p>
                    <p>
                      이메일이 등록되지 않았어도 같은 응답이 표시됩니다.
                      이는 이메일 노출을 방지하기 위한 정책입니다.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
