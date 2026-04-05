import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../theme/theme";
import { useT } from "../../../i18n";
import { Screen, Container, Card, SoftCard, PrimaryButton, Divider, FadeSlideIn, StatusBadge } from "../../../theme/ui";
import { getSession, Session } from "../../../auth/session";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS = [
  {
    id: "1",
    time: "09:00",
    duration: "2h",
    car: "Honda Civic",
    year: "2021",
    service: "Película Premium",
    status: "confirmed" as const,
    dayOffset: 0,
  },
  {
    id: "2",
    time: "11:30",
    duration: "3h",
    car: "Toyota Corolla",
    year: "2022",
    service: "Som + Multimídia",
    status: "confirmed" as const,
    dayOffset: 0,
  },
  {
    id: "3",
    time: "14:00",
    duration: "1h30",
    car: "VW Polo",
    year: "2023",
    service: "Chrome Delete",
    status: "pending" as const,
    dayOffset: 1,
  },
  {
    id: "4",
    time: "10:00",
    duration: "4h",
    car: "BMW 320i",
    year: "2020",
    service: "Envelopamento Total",
    status: "confirmed" as const,
    dayOffset: 2,
  },
  {
    id: "5",
    time: "15:00",
    duration: "2h",
    car: "Hyundai HB20",
    year: "2024",
    service: "Iluminação LED",
    status: "pending" as const,
    dayOffset: 4,
  },
];

const STATUS_LABELS = {
  confirmed: { label: "Confirmado", color: "green" as const },
  pending: { label: "Aguardando", color: "amber" as const },
};

// ─── Week strip helpers ───────────────────────────────────────────────────────

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function getWeekDays(baseDate: Date) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    days.push(d);
  }
  return days;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AgendaScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [selectedOffset, setSelectedOffset] = useState(0);

  useEffect(() => {
    (async () => setSession(await getSession()))();
  }, []);

  const today = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => getWeekDays(today), [today]);

  const filteredAppointments = MOCK_APPOINTMENTS.filter(
    (a) => a.dayOffset === selectedOffset
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>

          {/* Header */}
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20, letterSpacing: -0.2 }}>
              {t("tabs.agendaTitle")}
            </Text>
            <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 18 }}>
              {t("tabs.agendaSub")}
            </Text>
          </FadeSlideIn>

          {/* Week strip — always visible */}
          <FadeSlideIn delay={80}>
            <View style={{ marginTop: tokens.space.lg }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>
                  {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="calendar-outline" size={14} color={tokens.color.muted} />
                  <Text style={{ color: tokens.color.muted, fontSize: 12, marginLeft: 4 }}>
                    Semana atual
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 6 }}>
                {weekDays.map((day, idx) => {
                  const isSelected = idx === selectedOffset;
                  const hasAppt = MOCK_APPOINTMENTS.some((a) => a.dayOffset === idx);

                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setSelectedOffset(idx)}
                      style={({ pressed }) => ({
                        flex: 1,
                        alignItems: "center",
                        paddingVertical: 10,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? "rgba(255,0,0,0.55)"
                          : tokens.color.hairline,
                        backgroundColor: isSelected
                          ? tokens.color.accentSoft
                          : tokens.color.surface,
                        opacity: pressed ? 0.88 : 1,
                      })}
                    >
                      <Text
                        style={{
                          color: isSelected ? tokens.color.accent : tokens.color.muted,
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        {DAY_NAMES[day.getDay()]}
                      </Text>
                      <Text
                        style={{
                          color: isSelected ? tokens.color.ink : tokens.color.ink,
                          fontSize: 14,
                          fontWeight: "900",
                          marginTop: 4,
                        }}
                      >
                        {day.getDate()}
                      </Text>
                      {hasAppt ? (
                        <View
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 3,
                            backgroundColor: isSelected ? tokens.color.accent : tokens.color.muted,
                            marginTop: 4,
                          }}
                        />
                      ) : (
                        <View style={{ height: 9 }} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={140}>
            <View style={{ marginTop: tokens.space.lg }}>
              <Divider />
            </View>
          </FadeSlideIn>

          {/* Content: locked if not logged in */}
          {!session ? (
            <FadeSlideIn delay={200}>
              {/* Blurred preview of appointments */}
              <View style={{ marginTop: tokens.space.lg }}>
                {/* Mock blurred cards */}
                {[1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      marginBottom: 10,
                      borderRadius: tokens.radius.lg,
                      borderWidth: 1,
                      borderColor: tokens.color.hairline,
                      backgroundColor: tokens.color.surface,
                      padding: tokens.space.md,
                      opacity: 0.35,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ height: 12, width: "60%", backgroundColor: tokens.color.muted, borderRadius: 6 }} />
                        <View style={{ height: 10, width: "40%", backgroundColor: tokens.color.hairline, borderRadius: 6, marginTop: 8 }} />
                      </View>
                      <View style={{ height: 24, width: 60, backgroundColor: tokens.color.hairline, borderRadius: 12 }} />
                    </View>
                  </View>
                ))}

                {/* Lock card */}
                <Card style={{ marginTop: 4 }}>
                  <View style={{ alignItems: "center", paddingVertical: tokens.space.sm }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 18,
                        backgroundColor: tokens.color.accentSoft,
                        borderWidth: 1,
                        borderColor: "rgba(255,0,0,0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Ionicons name="lock-closed-outline" size={22} color={tokens.color.accent} />
                    </View>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, textAlign: "center" }}>
                      {t("tabs.loginRequiredTitle")}
                    </Text>
                    <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16, textAlign: "center" }}>
                      {t("tabs.loginRequiredSub")}
                    </Text>
                    <View style={{ marginTop: 14, width: "100%" }}>
                      <PrimaryButton label={t("tabs.loginCTA")} onPress={() => router.push("/login")} />
                    </View>
                  </View>
                </Card>
              </View>
            </FadeSlideIn>
          ) : (
            <>
              {/* Section header */}
              <FadeSlideIn delay={200}>
                <SoftCard style={{ marginTop: tokens.space.lg }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                        {t("tabs.agendaSection")}
                      </Text>
                      <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 12 }}>
                        {filteredAppointments.length > 0
                          ? `${filteredAppointments.length} agendamento${filteredAppointments.length > 1 ? "s" : ""}`
                          : "Sem agendamentos neste dia"}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => router.push("/quote")}
                      accessibilityLabel={t("tabs.agendaNewAppointment")}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.9 : 1,
                        width: 44,
                        height: 44,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: tokens.color.hairline,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: tokens.color.surface,
                      })}
                    >
                      <Ionicons name="add" size={20} color={tokens.color.accent} />
                    </Pressable>
                  </View>
                </SoftCard>
              </FadeSlideIn>

              {/* Appointment list */}
              {filteredAppointments.length > 0 ? (
                <View style={{ marginTop: tokens.space.md }}>
                  {filteredAppointments.map((appt, idx) => {
                    const s = STATUS_LABELS[appt.status];
                    return (
                      <FadeSlideIn key={appt.id} delay={240 + idx * 60}>
                        <Pressable
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.92 : 1,
                            marginBottom: 10,
                          })}
                        >
                          <Card>
                            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                              {/* Time column */}
                              <View
                                style={{
                                  width: 56,
                                  paddingTop: 2,
                                  marginRight: 12,
                                  alignItems: "center",
                                }}
                              >
                                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 15, letterSpacing: -0.1 }}>
                                  {appt.time}
                                </Text>
                                <Text style={{ color: tokens.color.muted, fontSize: 10, marginTop: 2 }}>
                                  {appt.duration}
                                </Text>
                              </View>

                              {/* Vertical line */}
                              <View
                                style={{
                                  width: 2,
                                  alignSelf: "stretch",
                                  backgroundColor: appt.status === "confirmed"
                                    ? "rgba(34,197,94,0.5)"
                                    : "rgba(245,158,11,0.5)",
                                  borderRadius: 2,
                                  marginRight: 12,
                                }}
                              />

                              {/* Content */}
                              <View style={{ flex: 1 }}>
                                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>
                                  {appt.car}
                                </Text>
                                <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 12 }}>
                                  {appt.service} · {appt.year}
                                </Text>
                                <View style={{ marginTop: 8 }}>
                                  <StatusBadge label={s.label} color={s.color} />
                                </View>
                              </View>

                              <Ionicons name="chevron-forward" size={16} color={tokens.color.muted} style={{ marginTop: 2 }} />
                            </View>
                          </Card>
                        </Pressable>
                      </FadeSlideIn>
                    );
                  })}
                </View>
              ) : (
                <FadeSlideIn delay={240}>
                  <Card style={{ marginTop: tokens.space.md }}>
                    <View style={{ alignItems: "center", paddingVertical: 8 }}>
                      <Ionicons name="calendar-outline" size={28} color={tokens.color.muted} />
                      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, marginTop: 10, textAlign: "center" }}>
                        {t("tabs.agendaEmptyTitle")}
                      </Text>
                      <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16, textAlign: "center" }}>
                        {t("tabs.agendaEmptySub")}
                      </Text>
                    </View>
                  </Card>
                </FadeSlideIn>
              )}
            </>
          )}

        </Container>
      </ScrollView>
    </Screen>
  );
}
