import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

export const resend = new Resend(apiKey);

// 발송 도메인 — 본인 도메인 등록 시 변경
const FROM_EMAIL = "프리랜서 관리 <onboarding@resend.dev>";
const REPLY_TO = "freelancer-manager@naver.com";

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g39v5pui";

/**
 * 시리얼 키 발급 이메일 발송
 */
export async function sendLicenseKeyEmail(params: {
  to: string;
  name: string | null;
  licenseKey: string;
}): Promise<{ success: boolean; error?: string }> {
  const { to, name, licenseKey } = params;
  const greeting = name ? `${name}님,` : "안녕하세요,";

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>프리랜서 관리 시리얼 키 안내</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#0f172a;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#0f172a 100%);padding:32px;text-align:center;">
              <div style="display:inline-block;padding:6px 14px;border-radius:9999px;background:rgba(255,255,255,0.1);color:#93c5fd;font-size:12px;font-weight:600;letter-spacing:0.05em;margin-bottom:16px;">
                🎬 프리랜서 관리
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.02em;">
                시리얼 키 발급 완료
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${greeting}</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#334155;">
                프리랜서 관리 베타 신청해주셔서 감사합니다. 아래 시리얼 키로 프로그램을 활성화하실 수 있습니다.
              </p>

              <!-- License Key Box -->
              <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <div style="color:#94a3b8;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
                  Your License Key
                </div>
                <div style="font-family:'SF Mono','Menlo','Monaco','Courier New',monospace;font-size:20px;font-weight:700;color:#34d399;letter-spacing:0.05em;word-break:break-all;">
                  ${licenseKey}
                </div>
              </div>

              <!-- Instructions -->
              <h3 style="margin:32px 0 12px;font-size:15px;font-weight:700;color:#0f172a;">
                사용 방법
              </h3>
              <ol style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:#475569;">
                <li>프로그램 실행 시 시리얼 키 입력 화면이 나타납니다</li>
                <li>위 키를 정확히 복사하여 입력해주세요</li>
                <li>인증 완료 후 즉시 사용 가능합니다</li>
              </ol>

              <!-- Beta Notice -->
              <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;margin:24px 0;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#78350f;">
                  <strong>🎁 베타 기간 안내</strong><br>
                  베타 기간 동안은 무료로 모든 기능을 사용하실 수 있습니다.
                  정식 출시 시점에 별도로 안내드릴 예정입니다.
                </p>
              </div>

              <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
                문의사항이 있으시면 카카오톡 오픈채팅으로 연락주세요:<br>
                <a href="${KAKAO_OPEN_CHAT}" style="color:#2563eb;text-decoration:none;">💬 카카오톡 오픈채팅 입장</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:#94a3b8;">
                수우튜디오 · 대표 강희덕 · 사업자등록번호 735-36-01496<br>
                인천시 남동구 담방로21번길 24, 광명아파트 101동 1206호<br>
                <a href="https://freelancer-manager-site.vercel.app/terms" style="color:#94a3b8;">이용약관</a> ·
                <a href="https://freelancer-manager-site.vercel.app/privacy" style="color:#94a3b8;">개인정보처리방침</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      replyTo: REPLY_TO,
      subject: "🎬 프리랜서 관리 — 시리얼 키 안내",
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Resend exception:", err);
    return { success: false, error: message };
  }
}
