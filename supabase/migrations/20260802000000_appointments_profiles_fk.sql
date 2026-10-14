-- ============================================================
-- ClientRadarX — Foreign key from appointments to profiles
-- ============================================================

-- appointments.user_id already references auth.users(id), and profiles.id
-- also references auth.users(id) — but PostgREST needs a direct FK between
-- appointments and profiles to embed profiles(full_name) in admin queries.
ALTER TABLE appointments
  ADD CONSTRAINT appointments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id);

NOTIFY pgrst, 'reload schema';
