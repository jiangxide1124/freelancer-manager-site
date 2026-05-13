-- =====================================================
-- 프리랜서 관리 — 결제·라이선스 시스템 스키마
-- =====================================================
-- 실행 위치: Supabase SQL Editor
-- 안전성: 기존 테이블에 영향 없음 (CREATE TABLE IF NOT EXISTS)
-- 작성일: 2026-05-13
-- =====================================================

-- 0. updated_at 자동 갱신 트리거 함수 (재실행 가능)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 1. customers — 결제 고객 정보
-- =====================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  name            TEXT,
  phone           TEXT,
  business_name   TEXT,
  business_number TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.customers IS '결제 고객 정보 (이메일 기준 유일)';

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- 2. subscriptions — 구독 상태·결제 이력
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id          UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  status               TEXT NOT NULL DEFAULT 'trialing'
                       CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')),
  plan                 TEXT NOT NULL DEFAULT 'pro_monthly',
  amount_krw           INTEGER NOT NULL DEFAULT 0,
  trial_starts_at      TIMESTAMPTZ,
  trial_ends_at        TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  canceled_at          TIMESTAMPTZ,
  toss_billing_key     TEXT,
  toss_customer_key    TEXT,
  metadata             JSONB,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.subscriptions IS '구독 상태 및 토스 결제 키 관리';

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON public.subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- 3. licenses — 발급된 시리얼 키 (메인 자산)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.licenses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key               TEXT UNIQUE NOT NULL,
  customer_id       UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription_id   UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended', 'revoked', 'expired')),
  hwid              TEXT,
  activated_at      TIMESTAMPTZ,
  last_verified_at  TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.licenses IS '발급된 시리얼 키 (HWID로 1컴퓨터 1키 강제)';

CREATE INDEX IF NOT EXISTS idx_licenses_customer ON public.licenses(customer_id);
CREATE INDEX IF NOT EXISTS idx_licenses_subscription ON public.licenses(subscription_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON public.licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON public.licenses(status);

DROP TRIGGER IF EXISTS update_licenses_updated_at ON public.licenses;
CREATE TRIGGER update_licenses_updated_at
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- 4. license_events — 라이선스 활동 감사 로그
-- =====================================================
CREATE TABLE IF NOT EXISTS public.license_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id  UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.license_events IS '라이선스 활동 로그 (issued/activated/verified/suspended/revoked)';

CREATE INDEX IF NOT EXISTS idx_license_events_license ON public.license_events(license_id);
CREATE INDEX IF NOT EXISTS idx_license_events_created ON public.license_events(created_at DESC);

ALTER TABLE public.license_events ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- 완료
-- =====================================================
-- 생성: 테이블 4개 + 인덱스 8개 + 트리거 3개 + 함수 1개
-- 보안: 모든 테이블 RLS 활성화 (service_role만 접근 가능)
-- =====================================================
