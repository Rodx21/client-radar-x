-- ============================================================
-- ClientRadarX — Real appointment booking (time slots)
-- ============================================================

-- Prevents two non-cancelled appointments from occupying the same tenant/date/time slot, closing a race condition a client-side check alone can't cover.
CREATE UNIQUE INDEX appointments_tenant_slot_unique
  ON appointments (tenant_id, date, time)
  WHERE status <> 'cancelled';

-- Lets any signed-in customer see which times are taken on a given day without exposing other customers' details; SECURITY DEFINER bypasses the caller's own-row RLS and only ever returns bare time values.
CREATE OR REPLACE FUNCTION get_booked_times(p_tenant_id UUID, p_date DATE)
RETURNS TABLE(slot_time TIME)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT time FROM appointments
  WHERE tenant_id = p_tenant_id AND date = p_date AND status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION get_booked_times(UUID, DATE) TO authenticated;
