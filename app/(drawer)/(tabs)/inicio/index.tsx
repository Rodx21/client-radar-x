import { useState, type ComponentProps } from "react";
import { View, Text, Pressable, ScrollView, Linking, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { useResponsive } from "@/app/lib/responsive";
import { Screen, Container, Card, SoftCard, PrimaryButton, GhostButton, Pill, Divider, FadeSlideIn } from "@/app/theme/ui";
import { DesktopSite } from "./DesktopSite";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const TRUST_ITEMS: { icon: IoniconName; key: string }[] = [
  { icon: "star-outline", key: "home.trustRating" },
  { icon: "shield-checkmark-outline", key: "home.trustWarranty" },
  { icon: "images-outline", key: "home.trustBeforeAfter" },
  { icon: "logo-whatsapp", key: "home.trustWhatsApp" },
];

const ALL_SERVICES = [
  { id: "tint", titleKey: "servicesData.tintTitle", blurbKey: "servicesData.tintBlurb", priceKey: "servicesData.tintPrice" },
  { id: "audio", titleKey: "servicesData.audioTitle", blurbKey: "servicesData.audioBlurb", priceKey: "servicesData.audioPrice" },
  { id: "wrap", titleKey: "servicesData.wrapTitle", blurbKey: "servicesData.wrapBlurb", priceKey: "servicesData.wrapPrice" },
  { id: "chrome", titleKey: "servicesData.chromeTitle", blurbKey: "servicesData.chromeBlurb", priceKey: "servicesData.chromePrice" },
  { id: "lighting", titleKey: "servicesData.lightingTitle", blurbKey: "servicesData.lightingBlurb", priceKey: "servicesData.lightingPrice" },
  { id: "wheels", titleKey: "servicesData.wheelsTitle", blurbKey: "servicesData.wheelsBlurb", priceKey: "servicesData.wheelsPrice" },
];

// Home screen: hero CTA, service category highlights, trust badges, and location info.
// Below the desktop breakpoint (and on native) renders the phone-shaped layout;
// at/above it renders <DesktopSite/>, the full "site público" redesign (see
// DesktopSite.tsx) from the Business OS visual handoff (2026-08-20).
export default function Inicio() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const navigation = useNavigation();
  const { isDesktop } = useResponsive();
  const [active, setActive] = useState(CLIENT.serviceCategories[0].id);

  const services = ALL_SERVICES.filter((s) => s.id === active).slice(0, 3);

  // Opens WhatsApp with a pre-filled quote request message.
  const wa = () => Linking.openURL(`https://wa.me/${CLIENT.whatsappPhone}?text=${encodeURIComponent(t("home.waQuickMessage"))}`).catch(() => {});

  if (isDesktop) return <DesktopSite />;

  return (
    <Screen>
      {/* Header */}
      <View style={{ paddingTop: 52, paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline, backgroundColor: tokens.color.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={() => navigation.dispatch({ type: "OPEN_DRAWER" })} style={{ width: 44, height: 44, borderRadius: tokens.radius.lg, borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surfaceSoft, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="menu-outline" size={20} color={tokens.color.ink} />
        </Pressable>
        <Image source={CLIENT.logo} style={{ width: 120, height: 36, resizeMode: "contain" }} />
        <Pressable onPress={() => router.push("/settings")} style={{ width: 44, height: 44, borderRadius: tokens.radius.lg, borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surfaceSoft, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="settings-outline" size={20} color={tokens.color.accent} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          {/* Hero */}
          <FadeSlideIn delay={0}>
            <SoftCard style={{ overflow: "hidden", minHeight: 160, padding: tokens.space.xl }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18 }}>{t("home.primaryCardTitle")}</Text>
              <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 8, lineHeight: 18 }}>{t("home.primaryCardSub")}</Text>
              <View style={{ flexDirection: "row", marginTop: tokens.space.lg, gap: 12 }}>
                <View style={{ flex: 1 }}><PrimaryButton label={t("common.getQuote")} onPress={() => router.push("/quote")} /></View>
                <View style={{ flex: 1 }}><GhostButton label={t("common.seeServices")} onPress={() => router.push("/(drawer)/(tabs)/services")} /></View>
              </View>
            </SoftCard>
          </FadeSlideIn>

          {/* Categories */}
          <FadeSlideIn delay={80}>
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>{t("home.headline")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {CLIENT.serviceCategories.map((c) => (
                    <Pill key={c.id} label={c.label} active={active === c.id} onPress={() => setActive(c.id)} />
                  ))}
                </View>
              </ScrollView>
            </View>
          </FadeSlideIn>

          {/* Service cards */}
          <View style={{ marginTop: tokens.space.md, gap: 10 }}>
            {services.map((s, idx) => (
              <FadeSlideIn key={s.id} delay={120 + idx * 60}>
                <Pressable onPress={wa}>
                  {({ pressed }) => (
                    <Card style={{ opacity: pressed ? 0.9 : 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t(s.titleKey)}</Text>
                          <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 16 }}>{t(s.blurbKey)}</Text>
                        </View>
                        <View style={{ backgroundColor: tokens.color.accentSoft, borderWidth: 1, borderColor: `${tokens.color.accent}44`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 11 }}>{t(s.priceKey)}</Text>
                        </View>
                      </View>
                      <Text style={{ color: tokens.color.accent, fontWeight: "900", fontSize: 12, marginTop: 10 }}>{t("common.details")} →</Text>
                    </Card>
                  )}
                </Pressable>
              </FadeSlideIn>
            ))}
          </View>

          <Divider style={{ marginTop: tokens.space.lg }} />

          {/* Trust */}
          <FadeSlideIn delay={200}>
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>{t("home.trustTitle")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {TRUST_ITEMS.map(({ icon, key }) => (
                    <View key={key} style={{ borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surface, paddingVertical: 10, paddingHorizontal: 12, borderRadius: tokens.radius.pill, flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name={icon} size={16} color={tokens.color.accent} />
                      <Text style={{ marginLeft: 8, color: tokens.color.ink, fontWeight: "900", fontSize: 12 }}>{t(key)}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </FadeSlideIn>

          <Divider style={{ marginTop: tokens.space.lg }} />

          {/* Location */}
          <FadeSlideIn delay={260}>
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>{t("business.findUsTitle")}</Text>
              <Card>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <Ionicons name="location-outline" size={18} color={tokens.color.accent} style={{ marginTop: 1, marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>{t("business.addressShort")}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{t("business.hoursMF")}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 12 }}>{t("business.hoursSat")} · {t("business.hoursSunClosed")}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                  <View style={{ flex: 1 }}><PrimaryButton label={t("business.howToGet")} onPress={() => Linking.openURL(CLIENT.mapsUrl).catch(() => {})} /></View>
                  <View style={{ flex: 1 }}><GhostButton label={t("business.seeInstagram")} onPress={() => Linking.openURL(CLIENT.instagramUrl).catch(() => {})} /></View>
                </View>
              </Card>
            </View>
          </FadeSlideIn>

          {/* CTA */}
          <FadeSlideIn delay={300}>
            <SoftCard style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18, textAlign: "center" }}>{t("home.helpTitle")}</Text>
              <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 8, textAlign: "center", lineHeight: 18 }}>{t("home.helpSub")}</Text>
              <View style={{ marginTop: tokens.space.md }}><PrimaryButton label={t("home.helpPrimary")} onPress={wa} /></View>
            </SoftCard>
          </FadeSlideIn>
        </Container>
      </ScrollView>
    </Screen>
  );
}
