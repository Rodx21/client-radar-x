import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { Screen, Container, Card, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { useLeads, MOCK_CONVERSATIONS } from "@/app/lib/mockCrm";
import { LEAD_STATUSES, leadStatusMeta } from "@/app/lib/leadStatus";

const STAGE_DOT: Record<string, string> = {
  novo: "#86b6ef", em_atendimento: "#6da7ec", qualificado: "#5598e7", agendado: "#3987e5",
  compareceu: "#2a78d6", vendido: "#16a34a", perdido: "#dc2626",
};

// Admin pipeline: leads grouped by funnel stage. Fictional data — reflects the real leads table shape audited in business-os.
export default function AdminPipelineScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const leads = useLeads();

  return (
    <Screen>
      <AdminHeader title={t("admin.pipeline.title")} onBack={() => (goBackOr(router, "/admin"))} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: tokens.color.muted, fontSize: 12, flex: 1, paddingRight: 10 }}>{t("admin.pipeline.subtitle")}</Text>
              <StatusBadge label={t("admin.conceptBadge")} color="amber" />
            </View>
          </FadeSlideIn>

          <View style={{ marginTop: tokens.space.lg, gap: tokens.space.lg }}>
            {LEAD_STATUSES.map((stage, sIdx) => {
              const stageLeads = leads.filter((l) => l.status === stage);
              const meta = leadStatusMeta(stage, t);
              if (stageLeads.length === 0) return null;
              return (
                <FadeSlideIn key={stage} delay={sIdx * 50}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: STAGE_DOT[stage] }} />
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>{meta.label}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "700" }}>· {stageLeads.length}</Text>
                  </View>
                  <View style={{ gap: 8 }}>
                    {stageLeads.map((l) => {
                      const conv = MOCK_CONVERSATIONS.find((c) => c.leadId === l.id);
                      return (
                        <Pressable
                          key={l.id}
                          disabled={!conv}
                          onPress={() => conv && router.push({ pathname: "/admin/inbox/[id]", params: { id: conv.id } })}
                          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
                        >
                          <Card>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <View style={{ flex: 1, paddingRight: 10 }}>
                                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>{l.contactName}</Text>
                                <Text style={{ color: tokens.color.muted, fontSize: 11.5, marginTop: 3 }}>{l.service} · {l.owner}</Text>
                              </View>
                              <Text style={{ color: tokens.color.accent, fontWeight: "800", fontSize: 12.5 }}>R$ {l.estimatedValue.toLocaleString("pt-BR")}</Text>
                            </View>
                          </Card>
                        </Pressable>
                      );
                    })}
                  </View>
                </FadeSlideIn>
              );
            })}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
