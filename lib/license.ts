import { createHmac, randomBytes } from "crypto";

/**
 * 시리얼 키 생성·검증 모듈
 * 형식: FRMG-XXXXX-XXXXX-XXXXX-CCCCC
 *       └ 프리픽스 + 무작위 ID 15자 + HMAC 5자 체크섬
 *
 * HMAC 체크섬으로 위·변조 방지 (LICENSE_SIGNING_SECRET 모르면 위조 불가)
 */

const SIGNING_SECRET = process.env.LICENSE_SIGNING_SECRET;

if (!SIGNING_SECRET) {
  throw new Error("Missing LICENSE_SIGNING_SECRET environment variable");
}

// 헷갈리는 글자 제외 (0/O, 1/I/L 등)
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomChars(length: number): string {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
}

function computeChecksum(data: string): string {
  const hmac = createHmac("sha256", SIGNING_SECRET as string);
  hmac.update(data);
  const hex = hmac.digest("hex").toUpperCase();
  // 헥스를 알파벳 문자로 매핑 (5자)
  let checksum = "";
  for (let i = 0; i < 5; i++) {
    const byte = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    checksum += ALPHABET[byte % ALPHABET.length];
  }
  return checksum;
}

/**
 * 새 시리얼 키 생성
 * @returns "FRMG-XXXXX-XXXXX-XXXXX-CCCCC" 형식
 */
export function generateLicenseKey(): string {
  const part1 = randomChars(5);
  const part2 = randomChars(5);
  const part3 = randomChars(5);
  const data = `FRMG${part1}${part2}${part3}`;
  const checksum = computeChecksum(data);
  return `FRMG-${part1}-${part2}-${part3}-${checksum}`;
}

/**
 * 시리얼 키 형식 + 체크섬 검증 (오프라인 검증, DB 조회 없음)
 * @param key "FRMG-XXXXX-XXXXX-XXXXX-CCCCC" 형식
 * @returns true if format and checksum match
 */
export function verifyLicenseKeyFormat(key: string): boolean {
  if (typeof key !== "string") return false;
  const trimmed = key.trim().toUpperCase();

  // 형식 검증: FRMG-XXXXX-XXXXX-XXXXX-CCCCC
  const pattern = /^FRMG-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$/;
  if (!pattern.test(trimmed)) return false;

  // 체크섬 검증
  const parts = trimmed.split("-");
  const data = `FRMG${parts[1]}${parts[2]}${parts[3]}`;
  const expectedChecksum = computeChecksum(data);
  return expectedChecksum === parts[4];
}

/**
 * 시리얼 키 정규화 (대소문자/공백 처리)
 */
export function normalizeLicenseKey(key: string): string {
  return key.trim().toUpperCase().replace(/\s+/g, "");
}
