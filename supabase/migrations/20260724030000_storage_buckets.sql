-- ============================================================
-- ClientRadarX — Storage buckets for gallery & quote photos
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-photos', 'quote-photos', true)
ON CONFLICT (id) DO NOTHING;

-- gallery bucket: public read, admin-only write (mirrors gallery_items RLS)
CREATE POLICY "Public read gallery bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload to gallery bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND is_admin());

CREATE POLICY "Admins can update gallery bucket objects"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND is_admin());

CREATE POLICY "Admins can delete gallery bucket objects"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND is_admin());

-- quote-photos bucket: anyone can upload (mirrors the quotes table policy allowing unauthenticated submissions); public read so admins can view them via URL.
CREATE POLICY "Public read quote-photos bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quote-photos');

CREATE POLICY "Anyone can upload to quote-photos bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'quote-photos');
