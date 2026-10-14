-- ============================================================
-- Revert Business OS Phase 1 (20260819000000_business_os_core.sql)
-- ============================================================
-- Superseded: an audit of the client's real "business-os" Supabase project
-- (a separate project, not this one) revealed a much more mature CRM/AI/
-- scheduling pipeline already in production there with real data. Keeping
-- this empty, redundant CRM schema in clientradarx-auto-music would just
-- create a second, competing "leads"/"contacts" model. ClientRadarX stays
-- the customer-facing app (tenants/profiles/services/appointments/quotes/
-- gallery_items, untouched by this revert); the real CRM/ops brain is the
-- other project, to be integrated once access is granted.

DROP FUNCTION IF EXISTS update_lead_status(UUID, TEXT, TEXT);

DROP TABLE IF EXISTS lead_status_history;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS incoming_events;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS whatsapp_numbers;
DROP TABLE IF EXISTS channels;

NOTIFY pgrst, 'reload schema';
