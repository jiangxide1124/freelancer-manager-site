"use client";

import { useState, useEffect } from "react";

interface RecoveredLicense {
  key: string;
  status: string;
  expiresAt: string | null;
}

type Result =
  | { type: "found"; licenses: RecoveredLicense[] }
  | { type: "error"; message: string }
  | null;

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g39v5pui";

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

  function fmtExpiry(iso: string | null): string {
    if (!iso) return "무제한";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  async function copyKey(key: string) {
    try {
      await navigator.clipboard.writeText(key);
      alert("✅ 클립보드에 복사됐습니다.\n메모장이나 안전한 곳에 붙여넣어 보관해주세요.");
    } catch {
      alert("복사 실패 — 직접 선택해서 복사해주세요.");
    }
  }

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

      if (response.ok && data?.success && Array.isArray(data.licenses)) {
        setResult({
          type: "found",
          licenses: data.licenses as RecoveredLicense[],
        });
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

            {result?.type === "found" ? (
              <div className="py-2">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🔓</div>
                  <h3 className="text-xl font-bold text-emerald-300 mb-2">
                    {result.licenses.length}개의 키를 찾았습니다
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    아래 키를 <strong className="text-amber-300">복사해서</strong> 안전한 곳에 보관해주세요.
                  </p>
                </div>

                <div className="space-y-2.5 mb-4 max-h-[400px] overflow-y-auto">
                  {result.licenses.map((lic, idx) => (
                    <div
                      key={`${lic.key}-${idx}`}
                      className="p-3 rounded-xl bg-slate-950 border-2 border-emerald-700/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                          License Key {result.licenses.length > 1 ? `#${idx + 1}` : ""}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            lic.status === "active"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                              : "bg-amber-500/15 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          {lic.status === "active" ? "활성" : lic.status}
                        </span>
                      </div>
                      <p className="font-mono text-sm font-bold text-emerald-300 break-all select-all leading-relaxed mb-2">
                        {lic.key}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          만료: {fmtExpiry(lic.expiresAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyKey(lic.key)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                        >
                          📋 복사
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs text-amber-100 text-left mb-4 leading-relaxed">
                  <p className="font-bold text-amber-200 mb-1">⚠️ 이번엔 꼭 보관해주세요</p>
                  <p className="text-amber-100/90">
                    메모장 · 1Password · 카카오톡 "나에게 보내기" 등 안전한 곳에 복사해두시면 다음에 잊을 일이 없습니다.
                  </p>
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-xs font-semibold text-purple-300 mb-3">
                    🔍 시리얼 키 찾기
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    키를 잊으셨나요?
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    신청 시 사용한 이메일을 입력하시면{" "}
                    <strong className="text-purple-300">발급된 키를 화면에 바로 표시</strong>해드립니다.
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
                      "🔍 시리얼 키 찾기"
                    )}
                  </button>

                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                    <p className="mb-1 text-slate-300 font-medium">💬 이메일이 기억 안 나거나 조회 안 되면</p>
                    <p className="mb-2">카카오톡 오픈채팅으로 문의해주세요. 본인 확인 후 키를 알려드립니다.</p>
                    <a
                      href={KAKAO_OPEN_CHAT}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-xs font-semibold transition-colors"
                    >
                      💬 카카오톡 오픈채팅 열기
                    </a>
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
