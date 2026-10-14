-- ============================================================
-- Business OS — Core event/CRM backbone (Phase 1)
-- Pipeline: incoming_events -> contacts -> conversations -> messages -> leads
-- Scope: no accounts/business_units (tenants already plays that role for a
-- single store); no platforms/campaigns yet (only needed once Meta/Google Ads
-- attribution lands).
-- ============================================================

-- ─── CHANNELS ────────────────────────────────────────────────
CREATE TABLE channels (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO channels (code, name) VALUES
  ('whatsapp', 'WhatsApp'),
  ('clientradarx_app', 'ClientRadarX App');

-- ─── WHATSAPP NUMBERS ────────────────────────────────────────
CREATE TABLE whatsapp_numbers (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id            UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  channel_id           UUID REFERENCES channels(id) NOT NULL,
  phone_number_id      TEXT UNIQUE NOT NULL,
  display_phone_number TEXT,
  waba_id              TEXT,
  label                TEXT,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- ─── CONTACTS ────────────────────────────────────────────────
-- phone must be normalized to E.164 by the caller (Edge Function) before
-- insert — this is the identity/dedup key referenced by the dossier as the
-- critical risk to get right.
CREATE TABLE contacts (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  full_name        TEXT,
  phone            TEXT NOT NULL,
  email            TEXT,
  profile_id       UUID REFERENCES profiles(id) ON DELETE SET NULL UNIQUE,
  first_channel_id UUID REFERENCES channels(id),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tenant_id, phone)
);

-- ─── CONVERSATIONS ───────────────────────────────────────────
CREATE TABLE conversations (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id          UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  contact_id         UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  channel_id         UUID REFERENCES channels(id) NOT NULL,
  whatsapp_number_id UUID REFERENCES whatsapp_numbers(id),
  status             TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  last_message_at    TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX conversations_contact_id_idx ON conversations (contact_id);

-- ─── MESSAGES ────────────────────────────────────────────────
CREATE TABLE messages (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id     UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  direction           TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  content             TEXT,
  media_url           TEXT,
  external_message_id TEXT UNIQUE,
  wa_timestamp        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX messages_conversation_id_wa_timestamp_idx
  ON messages (conversation_id, wa_timestamp);

-- ─── INCOMING EVENTS ─────────────────────────────────────────
-- Raw webhook payloads, persisted before any processing (persist-first
-- principle). UNIQUE(channel_id, external_id) is the idempotency key that
-- absorbs webhook redelivery without duplicating downstream records.
CREATE TABLE incoming_events (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id    UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  channel_id   UUID REFERENCES channels(id) NOT NULL,
  external_id  TEXT NOT NULL,
  payload      JSONB NOT NULL,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  error        TEXT,
  received_at  TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  UNIQUE (channel_id, external_id)
);

CREATE INDEX incoming_events_status_idx ON incoming_events (status);

-- ─── LEADS ───────────────────────────────────────────────────
CREATE TABLE leads (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id        UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  contact_id       UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  conversation_id  UUID REFERENCES conversations(id),
  appointment_id   UUID REFERENCES appointments(id),
  quote_id         UUID REFERENCES quotes(id),
  status           TEXT DEFAULT 'novo' CHECK (status IN
                     ('novo', 'em_atendimento', 'qualificado', 'agendado',
                      'compareceu', 'vendido', 'perdido')),
  owner_id         UUID REFERENCES profiles(id),
  lost_reason      TEXT,
  source_channel_id UUID REFERENCES channels(id),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX leads_contact_id_idx ON leads (contact_id);
CREATE INDEX leads_status_idx ON leads (status);

-- ─── LEAD STATUS HISTORY ─────────────────────────────────────
CREATE TABLE lead_status_history (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  from_status TEXT,
  to_status   TEXT NOT NULL,
  reason      TEXT,
  changed_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Updates a lead's status and records the transition atomically so the
-- funnel always has an auditable trail instead of a silent UPDATE.
CREATE OR REPLACE FUNCTION update_lead_status(
  p_lead_id UUID,
  p_new_status TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_status TEXT;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT status INTO v_old_status FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'lead not found';
  END IF;

  UPDATE leads SET status = p_new_status, updated_at = now() WHERE id = p_lead_id;

  INSERT INTO lead_status_history (lead_id, from_status, to_status, reason, changed_by)
  VALUES (p_lead_id, v_old_status, p_new_status, p_reason, auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION update_lead_status(UUID, TEXT, TEXT) TO authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- All Business OS tables are internal operational data — customers never
-- read these directly. Writes come from the Edge Function (service_role,
-- bypasses RLS) or, for leads, from update_lead_status() above.

ALTER TABLE channels            ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_numbers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE incoming_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read channels"
  ON channels FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read whatsapp_numbers"
  ON whatsapp_numbers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read contacts"
  ON contacts FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read conversations"
  ON conversations FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read messages"
  ON messages FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read incoming_events"
  ON incoming_events FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read leads"
  ON leads FOR SELECT USING (is_admin());
CREATE POLICY "Admins can read lead_status_history"
  ON lead_status_history FOR SELECT USING (is_admin());

NOTIFY pgrst, 'reload schema';
