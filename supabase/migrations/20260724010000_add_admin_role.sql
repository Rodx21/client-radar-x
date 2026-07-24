-- ============================================================
-- ClientRadarX — Admin role + RLS policies
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('customer', 'admin'));

-- SECURITY DEFINER so it can read profiles without recursing into this table's own RLS, and STABLE so Postgres can cache it within a query.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- profiles: admins can read every profile (needed to show customer name/phone on the admin appointments/quotes lists)
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT USING (is_admin());

-- appointments: view all + change status
CREATE POLICY "Admins can read all appointments"
  ON appointments FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all appointments"
  ON appointments FOR UPDATE USING (is_admin());

-- quotes: view all + change status
CREATE POLICY "Admins can read all quotes"
  ON quotes FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all quotes"
  ON quotes FOR UPDATE USING (is_admin());

-- services: full CRUD (previously unwritable by anyone)
CREATE POLICY "Admins can read all services"
  ON services FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert services"
  ON services FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update services"
  ON services FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete services"
  ON services FOR DELETE USING (is_admin());

-- gallery_items: full CRUD (previously unwritable by anyone)
CREATE POLICY "Admins can insert gallery items"
  ON gallery_items FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update gallery items"
  ON gallery_items FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete gallery items"
  ON gallery_items FOR DELETE USING (is_admin());

-- tenants: no UPDATE policy existed for anyone — add one for admins
CREATE POLICY "Admins can update tenants"
  ON tenants FOR UPDATE USING (is_admin());
