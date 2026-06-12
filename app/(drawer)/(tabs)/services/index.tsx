import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { Screen, Container, Card, SoftCard, PrimaryButton, Pill, Divider, FadeSlideIn } from "@/app/theme/ui";

const ALL_SERVICES = [
  { id: "tint",     titleKey: "servicesData.tintTitle",     descKey: "servicesData.tintBlurb",     priceKey: "servicesData.tintPrice"     },
  { id: "audio",    titleKey: "servicesData.audioTitle",    descKey: "servicesData.audioBlurb",    priceKey: "servicesData.audioPrice"    },
  { id: "wrap",     titleKey: "servicesData.wrapTitle",     descKey: "servicesData.wrapBlurb",     priceKey: "servicesData.wrapPrice"     },
  { id: "chrome",   titleKey: "servicesData.chromeTitle",   descKey: "servicesData.chromeBlurb",   priceKey: "servicesData.chromePrice"   },
  { id: "lighting", titleKey: "servicesData.lightingTitle", descKey: "servicesData.lightingBlurb", priceKey: "servicesData.lightingPrice" },
  { id: "wheels",   titleKey: "servicesData.wheelsTitle",   descKey: "servicesData.wheelsBlurb",   priceKey: "servicesData.wheelsPrice"   },
];

export default function ServicesScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? ALL_SERVICES : ALL_SERVICES.filter((s) => s.id === filter);

  return (
    <Screen>
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

          <View style={{ marginTop: tokens.space.lg, gap: 10 }}>
            {shown.map((s, idx) => (
              <FadeSlideIn key={s.id} delay={idx * 60}>
                <Pressable onPress={() => router.push("/quote")} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                  <Card>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t(s.titleKey)}</Text>
                        <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 16 }}>{t(s.descKey)}</Text>
                      </View>
                      <View style={{ backgroundColor: tokens.color.accentSoft, borderWidth: 1, borderColor: `${tokens.color.accent}44`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 11 }}>{t(s.priceKey)}</Text>
                      </View>
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
