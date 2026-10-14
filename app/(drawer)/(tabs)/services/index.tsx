import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { Screen, Container, Card, SoftCard, PrimaryButton, Pill, Divider, FadeSlideIn, DesktopBackBar } from "@/app/theme/ui";

type Service = { id: string; name: string; description: string | null; price_from: number | null; category: string };

// Service catalogue screen; loads active services for this tenant from Supabase and filters by category.
export default function ServicesScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("services").select("*").eq("tenant_id", TENANT_ID).eq("active", true);
      if (data) setServices(data as Service[]);
      setLoading(false);
    })();
  }, []);

  const shown = filter === "all" ? services : services.filter((s) => s.category === filter);

  return (
    <Screen>
      <DesktopBackBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20 }}>{t("tabs.servicesTitle")}</Text>
            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 18 }}>{t("tabs.servicesSub")}</Text>
          </FadeSlideIn>

          <Divider style={{ marginTop: tokens.space.lg }} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: tokens.space.lg }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pill label={t("tabs.servicesAll")} active={filter === "all"} onPress={() => setFilter("all")} />
              {CLIENT.serviceCategories.map((c) => (
                <Pill key={c.id} label={c.label} active={filter === c.id} onPress={() => setFilter(c.id)} />
              ))}
            </View>
          </ScrollView>

          <SoftCard style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t("tabs.servicesCtaTitle")}</Text>
            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 16 }}>{t("tabs.servicesCtaSub")}</Text>
            <View style={{ marginTop: 12 }}><PrimaryButton label={t("common.getQuote")} onPress={() => router.push("/quote")} /></View>
          </SoftCard>

          {loading ? (
            <View style={{ marginTop: tokens.space.lg, alignItems: "center", paddingVertical: tokens.space.lg }}>
              <ActivityIndicator color={tokens.color.accent} />
            </View>
          ) : (
            <View style={{ marginTop: tokens.space.lg, gap: 10 }}>
              {shown.map((s, idx) => (
                <FadeSlideIn key={s.id} delay={idx * 60}>
                  <Pressable onPress={() => router.push("/quote")} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                    <Card>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{s.name}</Text>
                          <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 16 }}>{s.description}</Text>
                        </View>
                        {s.price_from != null && (
                          <View style={{ backgroundColor: tokens.color.accentSoft, borderWidth: 1, borderColor: `${tokens.color.accent}44`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 11 }}>{t("common.priceFrom")}{s.price_from}</Text>
                          </View>
                        )}
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
