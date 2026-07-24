-- ============================================================
-- ClientRadarX — Seed gallery_items for the Auto Music Sound tenant
-- ============================================================
-- gallery_items existed since the initial schema but was never populated, so the Gallery screen fell back to a hardcoded local image array.
-- These rows use placeholder image URLs so the live query has real data to render; replace with real Storage URLs ahead of the final demo.

INSERT INTO gallery_items (tenant_id, title, category, before_url, after_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Película Premium — Ford Focus',   'tint',     'https://picsum.photos/seed/crx-tint-before/800/800',     'https://picsum.photos/seed/crx-tint-after/800/800'),
  ('00000000-0000-0000-0000-000000000001', 'Chrome Delete — VW Jetta',        'chrome',   'https://picsum.photos/seed/crx-chrome-before/800/800',   'https://picsum.photos/seed/crx-chrome-after/800/800'),
  ('00000000-0000-0000-0000-000000000001', 'Envelopamento — BYD Dolphin',     'wrap',     'https://picsum.photos/seed/crx-wrap-before/800/800',     'https://picsum.photos/seed/crx-wrap-after/800/800'),
  ('00000000-0000-0000-0000-000000000001', 'Película + Som — BMW 320i',       'tint',     'https://picsum.photos/seed/crx-audio-before/800/800',    'https://picsum.photos/seed/crx-audio-after/800/800');
