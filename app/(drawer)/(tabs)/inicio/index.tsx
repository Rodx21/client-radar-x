import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { ScreenHeader } from "../../../_components/ScreenHeader";
import { useT } from "../../../i18n";
import { useTheme } from "../../../theme/theme";
import { Screen, Container, Card, SoftCard, Muted, PrimaryButton, GhostButton, Pill, Divider, FadeSlideIn } from "../../../theme/ui";

const BRAND_WORDMARK = require("../../../../assets/brands/auto-music-sound/wordmark-transparent.png");

const WHATSAPP_PHONE = "5511943814636";
const MAPS_URL = "https://maps.google.com/?q=R.+Serra+de+Botucatu,+2100,+Tatu%C3%A1p%C3%A9,+S%C3%A3o+Paulo+SP";
const INSTAGRAM_URL = "https://www.instagram.com/automusicsound/";

type Category = "tint" | "audio" | "wrap" | "chrome" | "lighting" | "wheels";

type ServiceItem = {
  id: string;
  category: Category;
  titleKey: string;
  blurbKey: string;
  priceKey: string;
};

export default function Inicio() {
  const { t } = useT();
  const { tokens } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const categories: { id: Category; label: string }[] = useMemo(
    () => [
      { id: "tint", label: t("home.pillTint") },
      { id: "audio", label: t("home.pillAudio") },
      { id: "wrap", label: t("home.pillWrap") },
      { id: "chrome", label: t("home.pillChrome") },
      { id: "lighting", label: t("home.pillLighting") },
      { id: "wheels", label: t("home.pillWheels") },
    ],
    [t]
  );

  const services: ServiceItem[] = useMemo(
    () => [
      { id: "tint", category: "tint", titleKey: "servicesData.tintTitle", blurbKey: "servicesData.tintBlurb", priceKey: "servicesData.tintPrice" },
      { id: "chrome", category: "chrome", titleKey: "servicesData.chromeTitle", blurbKey: "servicesData.chromeBlurb", priceKey: "servicesData.chromePrice" },
      { id: "wrap", category: "wrap", titleKey: "servicesData.wrapTitle", blurbKey: "servicesData.wrapBlurb", priceKey: "servicesData.wrapPrice" },
      { id: "audio", category: "audio", titleKey: "servicesData.audioTitle", blurbKey: "servicesData.audioBlurb", priceKey: "servicesData.audioPrice" },
      { id: "lighting", category: "lighting", titleKey: "servicesData.lightingTitle", blurbKey: "servicesData.lightingBlurb", priceKey: "servicesData.lightingPrice" },
      { id: "wheels", category: "wheels", titleKey: "servicesData.wheelsTitle", blurbKey: "servicesData.wheelsBlurb", priceKey: "servicesData.wheelsPrice" },
    ],
    []
  );

  const [active, setActive] = useState<Category>("tint");
  const filtered = useMemo(() => services.filter((s) => s.category === active).slice(0, 3), [services, active]);

  const faqItems = useMemo(
    () => [
      { q: t("home.faqQ1"), a: t("home.faqA1") },
      { q: t("home.faqQ2"), a: t("home.faqA2") },
      { q: t("home.faqQ3"), a: t("home.faqA3") },
      { q: t("home.faqQ4"), a: t("home.faqA4") },
      { q: t("home.faqQ5"), a: t("home.faqA5") },
      { q: t("home.faqQ6"), a: t("home.faqA6") },
    ],
    [t]
  );

  function openWhatsApp() {
    const msg =
      "Olá! Quero um orçamento rápido. Meu carro é: (modelo/ano). Serviço: (película/som/envelopamento). Posso enviar fotos?";
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => {});
  }

  function openMaps() {
    Linking.openURL(MAPS_URL).catch(() => {});
  }

  function openInstagram() {
    Linking.openURL(INSTAGRAM_URL).catch(() => {});
  }

  return (
    <Screen>
      <ScreenHeader
        brandLogo={BRAND_WORDMARK}
        onMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
        onRight={() => router.push("/settings")}
        rightLabel={t("settings.title")}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: tokens.space.xl }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          {/* QUOTE HERO */}
          <FadeSlideIn delay={0}>
          <SoftCard
            style={{
              overflow: "hidden",
              padding: tokens.space.xl + 4,
              minHeight: 172,
              borderRadius: 18,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18, letterSpacing: -0.15 }}>
                {t("home.primaryCardTitle")}
              </Text>
              <View style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: tokens.color.accent, opacity: 0.95 }} />
            </View>

            <Text style={{ color: tokens.color.muted, fontSize: 13, marginTop: 10, lineHeight: 18 }}>
              {t("home.primaryCardSub")}
            </Text>

            <View style={{ flexDirection: "row", marginTop: tokens.space.lg }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <PrimaryButton label={t("common.getQuote")} onPress={() => router.push("/quote")} style={{ paddingVertical: 14 }} />
              </View>
              <View style={{ flex: 1 }}>
                <GhostButton
                  label={t("common.seeServices")}
                  onPress={() => router.push("/(drawer)/(tabs)/services")}
                  style={{ paddingVertical: 14 }}
                />
              </View>
            </View>

            <View style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: "100%", backgroundColor: tokens.color.accent }} />
          </SoftCard>
          </FadeSlideIn>

          {/* Secondary headline */}
          <FadeSlideIn delay={100}>
          <View style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontSize: 18, fontWeight: "800", lineHeight: 24, letterSpacing: -0.15 }}>
              {t("home.headline")}
            </Text>
            <Muted style={{ marginTop: 8, fontSize: 12, lineHeight: 16 }}>{t("home.sub")}</Muted>
          </View>
          </FadeSlideIn>

          {/* FILTER PILLS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: tokens.space.lg }}>
            <View style={{ flexDirection: "row", paddingVertical: 6 }}>
              {categories.map((c, idx) => (
                <View key={c.id} style={{ marginRight: idx === categories.length - 1 ? 0 : 10 }}>
                  <Pill label={c.label} active={active === c.id} onPress={() => setActive(c.id)} />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* SERVICE CARDS */}
          <View style={{ marginTop: tokens.space.md }}>
            {filtered.map((s, idx) => (
              <View key={s.id} style={{ marginBottom: idx === filtered.length - 1 ? 0 : 10 }}>
                <ServiceCard title={t(s.titleKey)} blurb={t(s.blurbKey)} price={t(s.priceKey)} onPress={openWhatsApp} />
              </View>
            ))}
          </View>

          {/* QUICK ACCESS */}
          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          <View style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.1 }}>
              {t("home.quickTitle")}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <QuickCard title={t("home.quickAgendaTitle")} sub={t("home.quickAgendaSub")} onPress={() => router.push("/(drawer)/(tabs)/agenda")} />
              </View>
              <View style={{ flex: 1 }}>
                <QuickCard title={t("home.quickBudgetsTitle")} sub={t("home.quickBudgetsSub")} onPress={() => router.push("/quote")} />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <QuickCard title={t("home.quickGalleryTitle")} sub={t("home.quickGallerySub")} onPress={() => router.push("/(drawer)/(tabs)/gallery")} />
            </View>
          </View>

          {/* HOW IT WORKS (restored) */}
          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          <View style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.1 }}>
              {t("home.howItWorksTitle")}
            </Text>

            <View style={{ marginTop: 10 }}>
              <StepRow icon="layers-outline" title={t("home.howItWorks1Title")} sub={t("home.howItWorks1Sub")} />
              <View style={{ height: 10 }} />
              <StepRow icon="camera-outline" title={t("home.howItWorks2Title")} sub={t("home.howItWorks2Sub")} />
              <View style={{ height: 10 }} />
              <StepRow icon="checkmark-circle-outline" title={t("home.howItWorks3Title")} sub={t("home.howItWorks3Sub")} />
              <View style={{ height: 10 }} />
              <StepRow icon="calendar-outline" title={t("home.howItWorks4Title")} sub={t("home.howItWorks4Sub")} />
            </View>
          </View>

          {/* TRUST (restored) */}
          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          <View style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.1 }}>
              {t("home.trustTitle")}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <TrustPill icon="star-outline" label={t("home.trustRating")} />
                <View style={{ width: 10 }} />
                <TrustPill icon="shield-checkmark-outline" label={t("home.trustWarranty")} />
                <View style={{ width: 10 }} />
                <TrustPill icon="images-outline" label={t("home.trustBeforeAfter")} />
                <View style={{ width: 10 }} />
                <TrustPill icon="logo-whatsapp" label={t("home.trustWhatsApp")} />
              </View>
            </ScrollView>
          </View>

          {/* ONDE ESTAMOS */}
          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          <View style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.1 }}>
              {t("business.findUsTitle")}
            </Text>

            <Card style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Ionicons name="location-outline" size={18} color={tokens.color.accent} style={{ marginTop: 1, marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, letterSpacing: -0.1 }}>
                    {t("business.addressShort")}
                  </Text>
                  <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 12 }}>
                    {t("business.hoursMF")}
                  </Text>
                  <Text style={{ color: tokens.color.muted, fontSize: 12 }}>
                    {t("business.hoursSat")} · {t("business.hoursSunClosed")}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
                <Ionicons name="star" size={13} color="#f59e0b" />
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginLeft: 6 }}>
                  {t("business.googleRating")}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <PrimaryButton label={t("business.howToGet")} onPress={openMaps} />
                </View>
                <View style={{ flex: 1 }}>
                  <GhostButton label={t("business.seeInstagram")} onPress={openInstagram} />
                </View>
              </View>
            </Card>
          </View>

          {/* HELP CTA (restored) */}
          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          <View style={{ marginTop: tokens.space.lg }}>
            <SoftCard>
              <Text style={{ color: tokens.color.ink, fontSize: 18, fontWeight: "900", lineHeight: 24, textAlign: "center", letterSpacing: -0.15 }}>
                {t("home.helpTitle")}
              </Text>
              <Text style={{ color: tokens.color.muted, marginTop: 10, textAlign: "center", fontSize: 12, lineHeight: 16 }}>
                {t("home.helpSub")}
              </Text>

              <View style={{ marginTop: tokens.space.md }}>
                <PrimaryButton label={t("home.helpPrimary")} onPress={openWhatsApp} />
              </View>

              <View style={{ marginTop: 10 }}>
                <GhostButton label={t("home.helpSecondary")} onPress={() => router.push("/(drawer)/(tabs)/services")} />
              </View>

              <View style={{ marginTop: 14, alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: tokens.color.surface,
                    borderColor: tokens.color.hairline,
                    borderWidth: 1,
                    borderRadius: tokens.radius.pill,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="logo-whatsapp" size={16} color={tokens.color.accent} />
                  <Text style={{ marginLeft: 8, color: tokens.color.ink, fontWeight: "900", letterSpacing: -0.1 }}>WhatsApp</Text>
                </View>
              </View>
            </SoftCard>
          </View>

          {/* FAQ (restored) */}
          <View style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.1 }}>
              {t("home.faqTitle")}
            </Text>
            <View style={{ marginTop: 10 }}>
              <FAQAccordion items={faqItems} />
            </View>
          </View>

          <View style={{ height: 24 }} />
        </Container>
      </ScrollView>
    </Screen>
  );
}

function ServiceCard({ title, blurb, price, onPress }: { title: string; blurb: string; price: string; onPress: () => void }) {
  const { tokens } = useTheme();
  const { t } = useT();

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <Card style={{ padding: tokens.space.md, transform: [{ translateY: pressed ? 1 : 0 }] }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>{title}</Text>
              <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>{blurb}</Text>
            </View>

            <View style={{ backgroundColor: tokens.color.accentSoft, borderColor: "rgba(255,0,0,0.45)", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: tokens.radius.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12 }}>{price}</Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ color: tokens.color.accent, fontWeight: "900", fontSize: 13 }}>{t("common.details")} →</Text>
          </View>
        </Card>
      )}
    </Pressable>
  );
}

function QuickCard({ title, sub, onPress }: { title: string; sub: string; onPress: () => void }) {
  const { tokens } = useTheme();

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }} accessibilityRole="button">
      {({ pressed }) => (
        <Card style={{ transform: [{ translateY: pressed ? 1 : 0 }] }}>
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, letterSpacing: -0.1 }}>{title}</Text>
          <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>{sub}</Text>
        </Card>
      )}
    </Pressable>
  );
}

function StepRow({ icon, title, sub }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string }) {
  const { tokens } = useTheme();

  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 14,
            backgroundColor: tokens.color.surfaceSoft,
            borderWidth: 1,
            borderColor: tokens.color.hairline,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={icon} size={18} color={tokens.color.accent} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, letterSpacing: -0.1 }}>{title}</Text>
          <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>{sub}</Text>
        </View>
      </View>
    </Card>
  );
}

function TrustPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { tokens } = useTheme();

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: tokens.color.hairline,
        backgroundColor: tokens.color.surface,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: tokens.radius.pill,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={16} color={tokens.color.accent} />
      <Text style={{ marginLeft: 8, color: tokens.color.ink, fontWeight: "900", fontSize: 12, letterSpacing: -0.1 }}>{label}</Text>
    </View>
  );
}

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const { tokens } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <View>
      {items.map((it, idx) => {
        const open = openIndex === idx;
        return (
          <View key={idx} style={{ marginBottom: idx === items.length - 1 ? 0 : 10 }}>
            <Pressable onPress={() => setOpenIndex(open ? null : idx)} accessibilityRole="button">
              {({ pressed }) => (
                <View
                  style={{
                    backgroundColor: tokens.color.surface,
                    borderWidth: 1,
                    borderColor: tokens.color.hairline,
                    borderRadius: tokens.radius.lg,
                    padding: 14,
                    opacity: pressed ? 0.95 : 1,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, paddingRight: 12, flex: 1, letterSpacing: -0.1 }}>
                      {it.q}
                    </Text>
                    <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={tokens.color.muted} />
                  </View>

                  {open ? (
                    <Text style={{ color: tokens.color.muted, marginTop: 10, fontSize: 12, lineHeight: 16 }}>
                      {it.a}
                    </Text>
                  ) : null}
                </View>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}


