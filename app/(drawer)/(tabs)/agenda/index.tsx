import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT, WEEKDAY_ABBR, MONTH_ABBR } from "@/app/i18n";
import { getSession, Session } from "@/app/lib/session";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { Screen, Container, Card, SoftCard, PrimaryButton, Divider, FadeSlideIn, StatusBadge } from "@/app/theme/ui";
import { weekDays, toDate } from "@/app/lib/agendaDates";
import { appointmentStatusMeta } from "@/app/lib/appointmentStatus";

type Appt = { id: string; car_model: string; car_year: string; date: string; time: string; status: "pending" | "confirmed" | "cancelled" | "completed"; services: { name: string }[] | null };

// Weekly agenda screen; shows the signed-in user's appointments for the selected day.
export default function AgendaScreen() {
  const { tokens } = useTheme();
  const { t, lang } = useT();
  const router = useRouter();
  const DAYS = WEEKDAY_ABBR[lang];
  const MONTHS = MONTH_ABBR[lang];
  const [session, setSession] = useState<Session | null>(null);
  const [offset, setOffset] = useState(0);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => weekDays(today), [today]);

  useEffect(() => { getSession().then(setSession); }, []);

  // Loads the current user's appointments for this tenant from Supabase.
  const fetch = useCallback(async () => {
    const s = await getSession();
    if (!s) return;
    setLoading(true);
    const { data } = await supabase.from("appointments").select("id,car_model,car_year,date,time,status,services(name)").eq("tenant_id", TENANT_ID).order("date").order("time");
    if (data) setAppts(data as Appt[]);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- refetches when the session resolves, not a render-time update
  useEffect(() => { if (session) fetch(); }, [session, fetch]);
  // Refetches whenever this tab regains focus, so a newly created booking shows up on return.
  useFocusEffect(useCallback(() => { if (session) fetch(); }, [session, fetch]));

  const selected = toDate(days[offset]);
  const filtered = appts.filter((a) => a.date === selected);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetch(); setRefreshing(false); }} tintColor={tokens.color.accent} />}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20 }}>{t("tabs.agendaTitle")}</Text>
            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 18 }}>{t("tabs.agendaSub")}</Text>
          </FadeSlideIn>

          {/* Week strip */}
          <FadeSlideIn delay={60}>
            <View style={{ marginTop: tokens.space.lg }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{MONTHS[today.getMonth()]} {today.getFullYear()}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {days.map((day, idx) => {
                  const sel = idx === offset;
                  const has = appts.some((a) => a.date === toDate(day));
                  return (
                    <Pressable key={idx} onPress={() => setOffset(idx)} style={({ pressed }) => ({ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: sel ? `${tokens.color.accent}88` : tokens.color.hairline, backgroundColor: sel ? tokens.color.accentSoft : tokens.color.surface, opacity: pressed ? 0.85 : 1 })}>
                      <Text style={{ color: sel ? tokens.color.accent : tokens.color.muted, fontSize: 10, fontWeight: "700" }}>{DAYS[day.getDay()]}</Text>
                      <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "900", marginTop: 4 }}>{day.getDate()}</Text>
                      {has ? <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: sel ? tokens.color.accent : tokens.color.muted, marginTop: 4 }} /> : <View style={{ height: 9 }} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </FadeSlideIn>

          <Divider style={{ marginTop: tokens.space.lg }} />

          {!session ? (
            <FadeSlideIn delay={120}>
              <View style={{ marginTop: tokens.space.lg }}>
                {[1,2].map((i) => <View key={i} style={{ height: 72, borderRadius: 18, borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surface, opacity: 0.35, marginBottom: 10 }} />)}
                <Card style={{ marginTop: 4 }}>
                  <View style={{ alignItems: "center", paddingVertical: tokens.space.sm }}>
                    <Ionicons name="lock-closed-outline" size={22} color={tokens.color.accent} style={{ marginBottom: 10 }} />
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, textAlign: "center" }}>{t("tabs.loginRequiredTitle")}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, textAlign: "center" }}>{t("tabs.loginRequiredSub")}</Text>
                    <View style={{ marginTop: 14, width: "100%" }}><PrimaryButton label={t("tabs.loginCTA")} onPress={() => router.push("/login")} /></View>
                  </View>
                </Card>
              </View>
            </FadeSlideIn>
          ) : (
            <>
              <SoftCard style={{ marginTop: tokens.space.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t("tabs.agendaSection")}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{loading ? t("common.loading") : filtered.length ? `${filtered.length} ${t("tabs.appointmentsCount")}` : t("tabs.agendaEmptyTitle")}</Text>
                  </View>
                  <Pressable onPress={() => router.push("/booking")} style={{ width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: tokens.color.hairline, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="add" size={20} color={tokens.color.accent} />
                  </Pressable>
                </View>
              </SoftCard>
              <View style={{ marginTop: tokens.space.md, gap: 10 }}>
                {filtered.map((a, idx) => {
                  const s = appointmentStatusMeta(a.status, t);
                  return (
                    <FadeSlideIn key={a.id} delay={idx * 60}>
                      <Card>
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                          <View style={{ width: 52, marginRight: 12, alignItems: "center" }}>
                            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 15 }}>{a.time.slice(0,5)}</Text>
                          </View>
                          <View style={{ width: 2, alignSelf: "stretch", backgroundColor: a.status === "confirmed" ? "rgba(34,197,94,0.5)" : "rgba(245,158,11,0.5)", borderRadius: 2, marginRight: 12 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{a.car_model}</Text>
                            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{a.services?.[0]?.name ?? t("tabs.serviceFallback")} · {a.car_year}</Text>
                            <View style={{ marginTop: 8 }}><StatusBadge label={s.label} color={s.color} /></View>
                          </View>
                        </View>
                      </Card>
                    </FadeSlideIn>
                  );
                })}
              </View>
            </>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
