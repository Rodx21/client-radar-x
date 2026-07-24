import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { supabase } from "@/app/lib/supabase";
import { Screen, Container, Card, Divider, PrimaryButton, GhostButton, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { AppointmentStatus, APPOINTMENT_STATUSES, appointmentStatusMeta } from "@/app/lib/appointmentStatus";

type Detail = {
  id: string;
  car_model: string;
  car_year: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string | null;
  services: { name: string } | null;
  profiles: { full_name: string | null; phone: string | null } | null;
};

// Admin detail view for a single appointment; lets the admin change its status.
export default function AdminAppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [appt, setAppt] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("appointments")
      .select("id,car_model,car_year,date,time,status,notes,services(name),profiles(full_name,phone)")
      .eq("id", id)
      .single();
    if (data) setAppt(data as unknown as Detail);
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches this record on mount/id change
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  async function setStatus(status: AppointmentStatus) {
    if (!appt) return;
    setSaving(true);
    const { error } = await supabase.from("appointments").update({ status }).eq("id", appt.id);
    if (!error) setAppt({ ...appt, status });
    setSaving(false);
  }

  if (loading || !appt) {
    return (
      <Screen>
        <AdminHeader title={t("admin.appointments.detailTitle")} onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={tokens.color.accent} />
        </View>
      </Screen>
    );
  }

  const meta = appointmentStatusMeta(appt.status, t);

  return (
    <Screen>
      <AdminHeader title={t("admin.appointments.detailTitle")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20 }}>{appt.car_model}</Text>
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{appt.car_year}</Text>
              </View>
              <StatusBadge label={meta.label} color={meta.color} />
            </View>
          </FadeSlideIn>

          <Card style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800" }}>{t("admin.appointments.customer")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }}>{appt.profiles?.full_name ?? t("admin.appointments.unknownCustomer")}</Text>
            {appt.profiles?.phone && <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{appt.profiles.phone}</Text>}
            <Divider style={{ marginVertical: 12 }} />
            <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800" }}>{t("admin.appointments.service")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }}>{appt.services?.name ?? t("tabs.serviceFallback")}</Text>
            <Divider style={{ marginVertical: 12 }} />
            <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800" }}>{t("admin.appointments.when")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }}>{appt.date} · {appt.time.slice(0, 5)}</Text>
            {appt.notes && (
              <>
                <Divider style={{ marginVertical: 12 }} />
                <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800" }}>{t("admin.appointments.notes")}</Text>
                <Text style={{ color: tokens.color.ink, fontSize: 13, marginTop: 4, lineHeight: 18 }}>{appt.notes}</Text>
              </>
            )}
          </Card>

          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, marginTop: tokens.space.lg, marginBottom: 10 }}>{t("admin.appointments.changeStatus")}</Text>
          <View style={{ gap: 8 }}>
            {APPOINTMENT_STATUSES.map((s) => {
              const m = appointmentStatusMeta(s, t);
              return s === appt.status ? (
                <PrimaryButton key={s} label={m.label} onPress={() => {}} disabled />
              ) : (
                <GhostButton key={s} label={m.label} onPress={() => setStatus(s)} disabled={saving} />
              );
            })}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
