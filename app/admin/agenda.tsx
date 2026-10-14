import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { Screen, Container, Card, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { MOCK_AGENDA } from "@/app/lib/mockCrm";

// Admin agenda: confirmed appointments, tagged by origin (AI reading WhatsApp vs. the client app). Fictional data — mirrors the real Scheduling Event Engine's output shape.
export default function AdminAgendaScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const days = Array.from(new Set(MOCK_AGENDA.map((a) => a.date)));

  return (
    <Screen>
      <AdminHeader title={t("admin.agenda.title")} onBack={() => (goBackOr(router, "/admin"))} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: tokens.color.muted, fontSize: 12, flex: 1, paddingRight: 10 }}>{t("admin.agenda.subtitle")}</Text>
              <StatusBadge label={t("admin.conceptBadge")} color="amber" />
            </View>
          </FadeSlideIn>

          {MOCK_AGENDA.length === 0 ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("admin.agenda.empty")}</Text>
            </Card>
          ) : (
            <View style={{ marginTop: tokens.space.lg, gap: tokens.space.lg }}>
              {days.map((day, dIdx) => (
                <FadeSlideIn key={day} delay={dIdx * 60}>
                  <Text style={{ color: tokens.color.muted, fontWeight: "800", fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>{day}</Text>
                  <View style={{ gap: 8 }}>
                    {MOCK_AGENDA.filter((a) => a.date === day).map((a) => (
                      <Card key={a.id}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, width: 54 }}>{a.time}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: tokens.color.ink, fontWeight: "800", fontSize: 13 }}>{a.contactName}</Text>
                            <Text style={{ color: tokens.color.muted, fontSize: 11.5, marginTop: 2 }}>{a.service}</Text>
                          </View>
                          <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: a.origin === "ai" ? tokens.color.accentSoft : "rgba(34,197,94,0.12)" }}>
                            <Text style={{ color: a.origin === "ai" ? tokens.color.accent : "#16a34a", fontSize: 10, fontWeight: "800" }}>
                              {a.origin === "ai" ? `🤖 ${t("admin.agenda.originAi")}` : `📱 ${t("admin.agenda.originApp")}`}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    ))}
                  </View>
                </FadeSlideIn>
              ))}
              <Text style={{ color: tokens.color.muted, fontSize: 11, lineHeight: 16 }}>{t("admin.agenda.legend")}</Text>
            </View>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
