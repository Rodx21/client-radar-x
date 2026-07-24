import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { Screen, Container, Card, Pill, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { AppointmentStatus, APPOINTMENT_STATUSES, appointmentStatusMeta } from "@/app/lib/appointmentStatus";

type Row = {
  id: string;
  car_model: string;
  car_year: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  services: { name: string } | null;
  profiles: { full_name: string | null } | null;
};

// Admin list of every appointment for this tenant, filterable by status.
export default function AdminAppointmentsScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("appointments")
      .select("id,car_model,car_year,date,time,status,services(name),profiles(full_name)")
      .eq("tenant_id", TENANT_ID)
      .order("date", { ascending: false })
      .order("time", { ascending: false });
    if (data) setRows(data as unknown as Row[]);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches the list on mount
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <Screen>
      <AdminHeader title={t("admin.appointments.title")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={tokens.color.accent} />}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.muted, fontSize: 12 }}>{t("admin.appointments.subtitle")}</Text>
          </FadeSlideIn>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: tokens.space.lg }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pill label={t("admin.filterAll")} active={filter === "all"} onPress={() => setFilter("all")} />
              {APPOINTMENT_STATUSES.map((s) => (
                <Pill key={s} label={appointmentStatusMeta(s, t).label} active={filter === s} onPress={() => setFilter(s)} />
              ))}
            </View>
          </ScrollView>

          {loading ? (
            <View style={{ marginTop: tokens.space.lg, alignItems: "center", paddingVertical: tokens.space.lg }}>
              <ActivityIndicator color={tokens.color.accent} />
            </View>
          ) : shown.length === 0 ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("admin.appointments.empty")}</Text>
            </Card>
          ) : (
            <View style={{ marginTop: tokens.space.lg, gap: 10 }}>
              {shown.map((r, idx) => {
                const meta = appointmentStatusMeta(r.status, t);
                return (
                  <FadeSlideIn key={r.id} delay={idx * 50}>
                    <Pressable onPress={() => router.push({ pathname: "/admin/appointments/[id]", params: { id: r.id } })} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                      <Card>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{r.car_model} · {r.car_year}</Text>
                            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{r.profiles?.full_name ?? t("admin.appointments.unknownCustomer")} · {r.services?.name ?? t("tabs.serviceFallback")}</Text>
                            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{r.date} {r.time.slice(0, 5)}</Text>
                          </View>
                          <StatusBadge label={meta.label} color={meta.color} />
                        </View>
                      </Card>
                    </Pressable>
                  </FadeSlideIn>
                );
              })}
            </View>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
