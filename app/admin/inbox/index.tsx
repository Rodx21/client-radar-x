import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { Screen, Container, Card, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { MOCK_CONVERSATIONS, AiSentiment } from "@/app/lib/mockCrm";

const SENTIMENT_COLOR: Record<AiSentiment, string> = { quente: "#d8431c", positivo: "#16a34a", neutro: "#6b7280" };

// Admin inbox: every WhatsApp conversation, unified by contact. Fictional data — real data comes from the separate business-os project once connected.
export default function AdminInboxScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  return (
    <Screen>
      <AdminHeader title={t("admin.inbox.title")} onBack={() => (goBackOr(router, "/admin"))} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: tokens.color.muted, fontSize: 12, flex: 1, paddingRight: 10 }}>{t("admin.inbox.subtitle")}</Text>
              <StatusBadge label={t("admin.conceptBadge")} color="amber" />
            </View>
          </FadeSlideIn>

          {MOCK_CONVERSATIONS.length === 0 ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("admin.inbox.empty")}</Text>
            </Card>
          ) : (
            <View style={{ marginTop: tokens.space.lg, gap: 10 }}>
              {MOCK_CONVERSATIONS.map((c, idx) => (
                <FadeSlideIn key={c.id} delay={idx * 40}>
                  <Pressable onPress={() => router.push({ pathname: "/admin/inbox/[id]", params: { id: c.id } })} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                    <Card>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: tokens.color.surfaceSoft, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                          <Text style={{ color: tokens.color.muted, fontWeight: "800", fontSize: 12 }}>{c.initials}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: tokens.color.ink, fontWeight: c.unread ? "900" : "700", fontSize: 14 }}>{c.contactName}</Text>
                            <Text style={{ color: tokens.color.muted, fontSize: 10.5 }}>{c.lastMessageAt}</Text>
                          </View>
                          <Text numberOfLines={1} style={{ color: c.unread ? tokens.color.ink : tokens.color.muted, fontSize: 12, fontWeight: c.unread ? "600" : "400", marginTop: 3 }}>{c.snippet}</Text>
                          {c.aiIntent && (
                            <View style={{ alignSelf: "flex-start", marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: `${SENTIMENT_COLOR[c.aiSentiment ?? "neutro"]}1A` }}>
                              <Text style={{ color: SENTIMENT_COLOR[c.aiSentiment ?? "neutro"], fontSize: 10, fontWeight: "800" }}>🤖 {c.aiIntent}</Text>
                            </View>
                          )}
                        </View>
                        {c.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tokens.color.accent, marginLeft: 8, marginTop: 4 }} />}
                      </View>
                    </Card>
                  </Pressable>
                </FadeSlideIn>
              ))}
            </View>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
