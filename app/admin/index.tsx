import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { Screen, Container, Card, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { ADMIN_MODULES } from "@/app/lib/adminModules";

// Admin hub; lists the manageable sections (appointments, quotes, services, gallery, tenant settings).
export default function AdminHubScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  return (
    <Screen>
      <AdminHeader title={t("admin.hub.title")} onBack={() => router.replace("/(drawer)/(tabs)/inicio")} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 18 }}>{t("admin.hub.subtitle")}</Text>
          </FadeSlideIn>

          <View style={{ marginTop: tokens.space.lg, gap: 10 }}>
            {ADMIN_MODULES.map((m, idx) => (
              <FadeSlideIn key={m.key} delay={idx * 60}>
                <Pressable onPress={() => router.push(m.href)} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                  <Card>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: tokens.color.accentSoft, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <Ionicons name={m.icon} size={20} color={tokens.color.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t(`admin.hub.${m.key}Title`)}</Text>
                        <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{t(`admin.hub.${m.key}Sub`)}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={tokens.color.muted} />
                    </View>
                  </Card>
                </Pressable>
              </FadeSlideIn>
            ))}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
