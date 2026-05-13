import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 관리자 클라이언트 (service_role 키 사용)
 * - 서버 사이드 전용 — 절대 클라이언트 코드에서 import 금지
 * - RLS 우회 가능 (모든 테이블 접근권한)
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 테이블 타입 정의 (선택, 자동완성용)
export type Customer = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  business_name: string | null;
  business_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  customer_id: string;
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  plan: string;
  amount_krw: number;
  trial_starts_at: string | null;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  toss_billing_key: string | null;
  toss_customer_key: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type License = {
  id: string;
  key: string;
  customer_id: string;
  subscription_id: string | null;
  status: "active" | "suspended" | "revoked" | "expired";
  hwid: string | null;
  activated_at: string | null;
  last_verified_at: string | null;
  expires_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
