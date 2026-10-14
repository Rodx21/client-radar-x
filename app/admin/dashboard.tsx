import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { Screen, Container, Card, Divider, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { MOCK_KPIS, MOCK_FUNNEL, MOCK_CHANNEL_SHARE, MOCK_VENDORS } from "@/app/lib/mockCrm";

const CHANNEL_COLORS = ["#2a78d6", "#eb6834", "#1baf7a"];

// Admin dashboard: KPI tiles, conversion funnel, channel mix, and rep performance. Backed by fictional data until the real business-os project is connected.
export default function AdminDashboardScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const maxFunnel = MOCK_FUNNEL[0].count;

  return (
    <Screen>
      <AdminHeader title={t("admin.dashboard.title")} onBack={() => (goBackOr(router, "/admin"))} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: tokens.color.muted, fontSize: 12, flex: 1, paddingRight: 10 }}>{t("admin.dashboard.subtitle")}</Text>
              <StatusBadge label={t("admin.conceptBadge")} color="amber" />
            </View>
          </FadeSlideIn>

          {/* KPI tiles */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: tokens.space.lg }}>
            {MOCK_KPIS.map((k, idx) => (
              <FadeSlideIn key={k.label} delay={idx * 40} style={{ width: "48%" }}>
                <Card>
                  <Text style={{ color: tokens.color.muted, fontSize: 10.5, fontWeight: "700" }}>{k.label}</Text>
                  <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 21, marginTop: 4 }}>{k.value}</Text>
                  <Text style={{ color: k.good ? "#16a34a" : "#dc2626", fontWeight: "800", fontSize: 11, marginTop: 4 }}>{k.delta}</Text>
                </Card>
              </FadeSlideIn>
            ))}
          </View>

          {/* Funnel */}
          <FadeSlideIn delay={80}>
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, marginBottom: 12 }}>{t("admin.dashboard.funnelTitle")}</Text>
              <View style={{ gap: 8 }}>
                {MOCK_FUNNEL.map((f) => {
                  const pct = Math.max(12, Math.round((f.count / maxFunnel) * 100));
                  return (
                    <View key={f.stage}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                        <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "700" }}>{f.stage}</Text>
                        <Text style={{ color: tokens.color.ink, fontSize: 11, fontWeight: "800" }}>{f.count}</Text>
                      </View>
                      <View style={{ height: 10, borderRadius: 6, backgroundColor: tokens.color.surfaceSoft, overflow: "hidden" }}>
                        <View style={{ width: `${pct}%`, height: "100%", borderRadius: 6, backgroundColor: tokens.color.accent }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          </FadeSlideIn>

          {/* Channel share */}
          <FadeSlideIn delay={110}>
            <Card style={{ marginTop: tokens.space.md }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, marginBottom: 12 }}>{t("admin.dashboard.channelTitle")}</Text>
              <View style={{ flexDirection: "row", height: 26, borderRadius: 6, overflow: "hidden", gap: 2 }}>
                {MOCK_CHANNEL_SHARE.map((c, i) => (
                  <View key={c.name} style={{ width: `${c.pct}%`, backgroundColor: CHANNEL_COLORS[i], alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>{c.pct}%</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 12 }}>
                {MOCK_CHANNEL_SHARE.map((c, i) => (
                  <View key={c.name} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: CHANNEL_COLORS[i] }} />
                    <Text style={{ color: tokens.color.muted, fontSize: 11 }}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </FadeSlideIn>

          {/* Vendor performance */}
          <FadeSlideIn delay={140}>
            <Card style={{ marginTop: tokens.space.md }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, marginBottom: 10 }}>{t("admin.dashboard.vendorsTitle")}</Text>
              <View style={{ flexDirection: "row", paddingBottom: 8 }}>
                <Text style={{ flex: 1.4, color: tokens.color.muted, fontSize: 10, fontWeight: "800" }}>{t("admin.dashboard.colVendor")}</Text>
                <Text style={{ flex: 1, color: tokens.color.muted, fontSize: 10, fontWeight: "800", textAlign: "right" }}>{t("admin.dashboard.colConversas")}</Text>
                <Text style={{ flex: 1, color: tokens.color.muted, fontSize: 10, fontWeight: "800", textAlign: "right" }}>{t("admin.dashboard.colVendas")}</Text>
                <Text style={{ flex: 1.2, color: tokens.color.muted, fontSize: 10, fontWeight: "800", textAlign: "right" }}>{t("admin.dashboard.colConversao")}</Text>
              </View>
              <Divider />
              {MOCK_VENDORS.map((v) => (
                <View key={v.name} style={{ flexDirection: "row", paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline }}>
                  <Text style={{ flex: 1.4, color: tokens.color.ink, fontSize: 12, fontWeight: "700" }}>{v.name}</Text>
                  <Text style={{ flex: 1, color: tokens.color.ink, fontSize: 12, textAlign: "right" }}>{v.conversas}</Text>
                  <Text style={{ flex: 1, color: tokens.color.ink, fontSize: 12, textAlign: "right" }}>{v.vendas}</Text>
                  <Text style={{ flex: 1.2, color: tokens.color.ink, fontSize: 12, textAlign: "right" }}>{v.conversao}</Text>
                </View>
              ))}
            </Card>
          </FadeSlideIn>
        </Container>
      </ScrollView>
    </Screen>
  );
}
