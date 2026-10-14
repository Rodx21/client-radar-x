import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/app/theme/theme";
import { useT, WEEKDAY_ABBR, MONTH_ABBR } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { useSession } from "@/app/lib/auth";
import { notify } from "@/app/lib/notify";
import { Screen, Container, Card, SoftCard, PrimaryButton, Divider, FormField, DesktopBackBar } from "@/app/theme/ui";
import { nextDays, toDate } from "@/app/lib/agendaDates";
import { availableSlots } from "@/app/lib/timeSlots";

type Service = { id: string; name: string; category: string };

// Real appointment booking: pick a service, a day, a free 30-minute slot, then the vehicle.
export default function BookingScreen() {
  const { tokens } = useTheme();
  const { t, lang } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, loading: sessionLoading } = useSession();

  const DAYS = WEEKDAY_ABBR[lang];
  const MONTHS = MONTH_ABBR[lang];
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => nextDays(today, 14), [today]);

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("services").select("id,name,category").eq("tenant_id", TENANT_ID).eq("active", true).then(({ data }) => {
      if (data) setServices(data as Service[]);
    });
  }, []);

  const selectedDay = days[dayIdx];
  const selectedDateStr = toDate(selectedDay);
  const hours = CLIENT.businessHours[selectedDay.getDay()];

  const loadBookedTimes = useCallback(async (dateStr: string) => {
    setSlotsLoading(true);
    setSlot("");
    const { data } = await supabase.rpc("get_booked_times", { p_tenant_id: TENANT_ID, p_date: dateStr });
    setBookedTimes((data ?? []).map((r: { slot_time: string }) => r.slot_time));
    setSlotsLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- refetches booked times when the selected day changes
  useEffect(() => { loadBookedTimes(selectedDateStr); }, [selectedDateStr, loadBookedTimes]);

  // Booking requires an account; bounce straight to login if this route is reached while signed out.
  useEffect(() => { if (!sessionLoading && !session) router.replace("/login"); }, [sessionLoading, session, router]);
  if (sessionLoading || !session) return null;

  const isToday = selectedDateStr === toDate(today);
  const slots = availableSlots(hours, bookedTimes, isToday ? { isToday: true, nowMinutes: today.getHours() * 60 + today.getMinutes() } : undefined);

  const canNext = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!slot;
    if (step === 2) return model.trim().length >= 2 && year.trim().length >= 2;
    return false;
  };

  async function submit() {
    if (!session) return;
    setSaving(true);
    const { error } = await supabase.from("appointments").insert({
      tenant_id: TENANT_ID,
      user_id: session.userId,
      service_id: serviceId,
      car_model: model.trim(),
      car_year: year.trim(),
      date: selectedDateStr,
      time: slot,
      status: "pending",
    });
    setSaving(false);
    if (error) {
      if (error.code === "23505") {
        notify(t("booking.slotTakenTitle"), t("booking.slotTakenSub"));
        loadBookedTimes(selectedDateStr);
        setStep(1);
        return;
      }
      notify(t("login.errorTitle"), error.message);
      return;
    }
    router.back();
  }

  return (
    <Screen>
      <DesktopBackBar />
      <View style={{ paddingTop: Math.max(insets.top, 20) + 8, paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline, backgroundColor: tokens.color.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={() => { if (step === 0) router.back(); else setStep((s) => s - 1); }} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-back" size={22} color={tokens.color.ink} />
        </Pressable>
        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16 }}>{t("booking.title")}</Text>
        <Pressable onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="close" size={20} color={tokens.color.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          {step === 0 && (
            <View>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 4 }}>{t("booking.pickService")}</Text>
              <Text style={{ color: tokens.color.muted, fontSize: 12, marginBottom: 16 }}>{t("booking.pickServiceSub")}</Text>
              {services.length === 0 ? (
                <View style={{ alignItems: "center", paddingVertical: tokens.space.lg }}><ActivityIndicator color={tokens.color.accent} /></View>
              ) : (
                <View style={{ gap: 10 }}>
                  {services.map((svc) => (
                    <Pressable key={svc.id} onPress={() => setServiceId(svc.id)}>
                      {({ pressed }) => (
                        <Card style={{ borderColor: serviceId === svc.id ? `${tokens.color.accent}99` : tokens.color.hairline, backgroundColor: serviceId === svc.id ? tokens.color.accentSoft : tokens.color.surface, opacity: pressed ? 0.9 : 1 }}>
                          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{svc.name}</Text>
                        </Card>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 4 }}>{t("booking.pickDateTime")}</Text>
              <Text style={{ color: tokens.color.muted, fontSize: 12, marginBottom: 16 }}>{t("booking.pickDateTimeSub")}</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {days.map((day, idx) => {
                    const sel = idx === dayIdx;
                    const closed = !CLIENT.businessHours[day.getDay()];
                    return (
                      <Pressable key={idx} onPress={() => setDayIdx(idx)} disabled={closed} style={{ width: 52, alignItems: "center", paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: sel ? `${tokens.color.accent}88` : tokens.color.hairline, backgroundColor: sel ? tokens.color.accentSoft : tokens.color.surface, opacity: closed ? 0.4 : 1 }}>
                        <Text style={{ color: sel ? tokens.color.accent : tokens.color.muted, fontSize: 10, fontWeight: "700" }}>{DAYS[day.getDay()]}</Text>
                        <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "900", marginTop: 4 }}>{day.getDate()}</Text>
                        <Text style={{ color: tokens.color.muted, fontSize: 9, marginTop: 2 }}>{MONTHS[day.getMonth()]}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>

              <Divider style={{ marginTop: tokens.space.lg, marginBottom: tokens.space.lg }} />

              {!hours ? (
                <Card><Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("booking.dayClosed")}</Text></Card>
              ) : slotsLoading ? (
                <View style={{ alignItems: "center", paddingVertical: tokens.space.lg }}><ActivityIndicator color={tokens.color.accent} /></View>
              ) : slots.length === 0 ? (
                <Card><Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("booking.noSlots")}</Text></Card>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {slots.map((s) => {
                    const sel = s === slot;
                    return (
                      <Pressable key={s} onPress={() => setSlot(s)} style={{ width: "31%", alignItems: "center", paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: sel ? `${tokens.color.accent}88` : tokens.color.hairline, backgroundColor: sel ? tokens.color.accentSoft : tokens.color.surface }}>
                        <Text style={{ color: sel ? tokens.color.accent : tokens.color.ink, fontWeight: "800", fontSize: 13 }}>{s}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 16 }}>{t("quote.vehicleInfo")}</Text>
              <SoftCard style={{ marginBottom: 16 }}>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>{services.find((s) => s.id === serviceId)?.name}</Text>
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{DAYS[selectedDay.getDay()]} {selectedDay.getDate()}/{selectedDay.getMonth() + 1} · {slot}</Text>
              </SoftCard>
              <FormField label={t("quote.model")} value={model} onChangeText={setModel} placeholder={t("quote.modelPh")} />
              <FormField label={t("quote.year")} value={year} onChangeText={setYear} placeholder={t("quote.yearPh")} keyboardType="number-pad" />
              <View style={{ marginTop: 8 }}>
                <PrimaryButton label={saving ? t("login.loading") : t("booking.confirm")} onPress={submit} disabled={saving || !canNext()} />
              </View>
            </View>
          )}

          {step < 2 && (
            <View style={{ marginTop: tokens.space.xl }}>
              <PrimaryButton label={t("common.continue")} onPress={() => { if (canNext()) setStep((s) => s + 1); }} disabled={!canNext()} />
            </View>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
