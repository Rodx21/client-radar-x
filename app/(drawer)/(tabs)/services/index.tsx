import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../theme/theme";
import { useT } from "../../../i18n";
import { Screen, Container, Card, SoftCard, PrimaryButton, Divider, FadeSlideIn } from "../../../theme/ui";

type Filter = "all" | "tint" | "audio" | "wrap" | "chrome" | "lighting" | "wheels";

export default function ServicesScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("all");

  const filters: { id: Filter; label: string }[] = useMemo(
    () => [
      { id: "all", label: t("tabs.servicesAll") },
      { id: "tint", label: t("quote.serviceTint") },
      { id: "audio", label: t("quote.serviceAudio") },
      { id: "wrap", label: t("quote.serviceWrap") },
      { id: "chrome", label: t("quote.serviceChrome") },
      { id: "lighting", label: t("quote.serviceLighting") },
      { id: "wheels", label: t("quote.serviceWheels") },
    ],
    [t]
  );

  const services = [
    { id: "tint", titleKey: "servicesData.tintTitle", descKey: "quote.serviceTintDesc", priceKey: "servicesData.tintPrice" },
    { id: "audio", titleKey: "servicesData.audioTitle", descKey: "quote.serviceAudioDesc", priceKey: "servicesData.audioPrice" },
    { id: "wrap", titleKey: "servicesData.wrapTitle", descKey: "quote.serviceWrapDesc", priceKey: "servicesData.wrapPrice" },
    { id: "chrome", titleKey: "servicesData.chromeTitle", descKey: "quote.serviceChromeDesc", priceKey: "servicesData.chromePrice" },
    { id: "lighting", titleKey: "servicesData.lightingTitle", descKey: "quote.serviceLightingDesc", priceKey: "servicesData.lightingPrice" },
    { id: "wheels", titleKey: "servicesData.wheelsTitle", descKey: "quote.serviceWheelsDesc", priceKey: "servicesData.wheelsPrice" },
  ].filter((s) => filter === "all" || s.id === filter);

  return (
    <Screen>
      <ScrollView>
        <Container style={{ paddingTop: tokens.space.lg, paddingBottom: tokens.space.xl }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20, letterSpacing: -0.2 }}>
              {t("tabs.servicesTitle")}
            </Text>
            <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
              {t("tabs.servicesSub")}
            </Text>
          </FadeSlideIn>

          <FadeSlideIn delay={60}>
            <View style={{ marginTop: tokens.space.lg }}>
              <Divider />
            </View>
          </FadeSlideIn>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: tokens.space.lg }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {filters.map((f) => {
                const active = filter === f.id;
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => setFilter(f.id)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.9 : 1,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: active ? "rgba(255,0,0,0.55)" : tokens.color.hairline,
                      backgroundColor: active ? tokens.color.accentSoft : tokens.color.surface,
                    })}
                  >
                    <Text style={{ color: active ? tokens.color.ink : tokens.color.muted, fontWeight: "900", fontSize: 12 }}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <SoftCard style={{ marginTop: tokens.space.lg, padding: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
              {t("tabs.servicesCtaTitle")}
            </Text>
            <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
              {t("tabs.servicesCtaSub")}
            </Text>
            <View style={{ marginTop: 12 }}>
              <PrimaryButton label={t("common.getQuote")} onPress={() => router.push("/quote")} />
            </View>
          </SoftCard>

          <View style={{ marginTop: tokens.space.lg }}>
            {services.map((s, idx) => (
              <FadeSlideIn key={s.id} delay={200 + idx * 60}>
              <Pressable
                key={s.id}
                onPress={() => router.push("/quote")}
                style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1, marginBottom: 10 })}
              >
                <Card>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                        {t(s.titleKey)}
                      </Text>
                      <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                        {t(s.descKey)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <View style={{ backgroundColor: "rgba(255,0,0,0.08)", borderColor: "rgba(255,0,0,0.3)", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: tokens.radius.lg }}>
                        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12 }}>{t(s.priceKey)}</Text>
                      </View>
                      <View style={{ height: 8 }} />
                      <Ionicons name="chevron-forward" size={16} color={tokens.color.muted} />
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
