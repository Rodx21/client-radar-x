-- ============================================================
-- ClientRadarX — Initial Schema
-- Project: clientradarx-auto-music
-- ============================================================

-- ─── TENANTS ─────────────────────────────────────────────────
CREATE TABLE tenants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  brand_color TEXT DEFAULT '#FF0000',
  logo_url    TEXT,
  whatsapp    TEXT,
  address     TEXT,
  instagram   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── PROFILES ────────────────────────────────────────────────
CREATE TABLE profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT,
  full_name  TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── SERVICES ────────────────────────────────────────────────
CREATE TABLE services (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  price_from  NUMERIC,
  category    TEXT NOT NULL,
  image_url   TEXT,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── APPOINTMENTS ─────────────────────────────────────────────
CREATE TABLE appointments (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id  UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  car_model  TEXT NOT NULL,
  car_year   TEXT NOT NULL,
  date       DATE NOT NULL,
  time       TIME NOT NULL,
  status     TEXT DEFAULT 'pending'
               CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── QUOTES ───────────────────────────────────────────────────
CREATE TABLE quotes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id     UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service       TEXT NOT NULL,
  car_model     TEXT NOT NULL,
  car_year      TEXT NOT NULL,
  photos        TEXT[] DEFAULT '{}',
  contact_name  TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'viewed', 'replied')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── GALLERY ITEMS ────────────────────────────────────────────
CREATE TABLE gallery_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  title       TEXT,
  description TEXT,
  category    TEXT,
  before_url  TEXT,
  after_url   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tenants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- tenants: public read
CREATE POLICY "Tenants are publicly readable"
  ON tenants FOR SELECT USING (true);

-- profiles: users manage only their own
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- services: public read of active services
CREATE POLICY "Active services are publicly readable"
  ON services FOR SELECT USING (active = true);

-- appointments: users see only their own
CREATE POLICY "Users can read own appointments"
  ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments"
  ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE USING (auth.uid() = user_id);

-- quotes: users see their own; anyone can submit (unauthenticated)
CREATE POLICY "Users can read own quotes"
  ON quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can submit a quote"
  ON quotes FOR INSERT WITH CHECK (true);

-- gallery: public read
CREATE POLICY "Gallery is publicly readable"
  ON gallery_items FOR SELECT USING (true);

-- ============================================================
-- TRIGGER: auto-create profile on sign-up
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED: First tenant — Auto Music Sound e Film
-- ============================================================

INSERT INTO tenants (id, name, slug, brand_color, whatsapp, address, instagram)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Auto Music Sound e Film',
  'auto-music-sound',
  '#FF0000',
  '5511943814636',
  'R. Serra de Botucatu, 2100, Tatuapé, São Paulo SP',
  'automusicsound'
);

INSERT INTO services (tenant_id, name, description, price_from, category, active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Película Premium',       'Conforto térmico e proteção UV com película de alta performance.',       399,  'tint',     true),
  ('00000000-0000-0000-0000-000000000001', 'Som e Multimídia',        'Instalação profissional de som e central multimídia.',                   450,  'audio',    true),
  ('00000000-0000-0000-0000-000000000001', 'Envelopamento',           'Proteção e personalização com vinil de acabamento premium.',             1200, 'wrap',     true),
  ('00000000-0000-0000-0000-000000000001', 'Chrome Delete',           'Remoção de cromados com envelopamento fosco ou brilhante.',              350,  'chrome',   true),
  ('00000000-0000-0000-0000-000000000001', 'Iluminação LED',          'Kit LED interno e externo com instalação limpa e garantia.',             280,  'lighting', true),
  ('00000000-0000-0000-0000-000000000001', 'Rodas e Pneus',           'Personalização de rodas, pintura e instalação de pneus de alta performance.', 300, 'wheels', true);
