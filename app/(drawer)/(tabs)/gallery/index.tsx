import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, Modal, Animated, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { getSession, Session } from "@/app/lib/session";
import { Screen, Container, Card, FadeSlideIn, PrimaryButton } from "@/app/theme/ui";

const ITEMS = [
  { id: "1", src: require("@/assets/brands/auto-music-sound/gallery/car-01.png"), service: "Película Premium", car: "Ford Focus", year: "2022" },
  { id: "2", src: require("@/assets/brands/auto-music-sound/gallery/car-02.png"), service: "Chrome Delete",   car: "VW Jetta",   year: "2023" },
  { id: "3", src: require("@/assets/brands/auto-music-sound/gallery/car-03.png"), service: "Envelopamento",   car: "BYD Dolphin", year: "2024" },
  { id: "4", src: require("@/assets/brands/auto-music-sound/gallery/car-04.png"), service: "Película + Som",  car: "BMW 320i",    year: "2021" },
];

type Item = (typeof ITEMS)[0];

export default function GalleryScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const { width, height: H } = useWindowDimensions();
  const W = Math.min(width, 430);
  const [session, setSession] = useState<Session | null>(null);
  const [lightbox, setLightbox] = useState<Item | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => { getSession().then(setSession); }, []);

  function open(item: Item) {
    setLightbox(item);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 180 }),
    ]).start();
  }

  function close() {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 200, useNativeDriver: true }),
    ]).start(() => setLightbox(null));
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20 }}>{t("gallery.title")}</Text>
            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 18 }}>{t("gallery.subPublic")}</Text>
          </FadeSlideIn>

          {!session ? (
            <FadeSlideIn delay={80}>
              <View style={{ marginTop: tokens.space.lg }}>
                {[1, 2].map((i) => <View key={i} style={{ height: 80, borderRadius: 18, borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surface, opacity: 0.35, marginBottom: 10 }} />)}
                <Card style={{ marginTop: 4 }}>
                  <View style={{ alignItems: "center", paddingVertical: tokens.space.sm }}>
                    <View style={{ width: 48, height: 48, borderRadius: 18, backgroundColor: tokens.color.accentSoft, borderWidth: 1, borderColor: `${tokens.color.accent}33`, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Ionicons name="lock-closed-outline" size={22} color={tokens.color.accent} />
                    </View>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, textAlign: "center" }}>{t("tabs.loginRequiredTitle")}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 16, textAlign: "center" }}>{t("tabs.loginRequiredSub")}</Text>
                    <View style={{ marginTop: 14, width: "100%" }}><PrimaryButton label={t("tabs.loginCTA")} onPress={() => router.push("/login")} /></View>
                  </View>
                </Card>
              </View>
            </FadeSlideIn>
          ) : (
            <View style={{ marginTop: tokens.space.lg, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {ITEMS.map((item, idx) => (
                <FadeSlideIn key={item.id} delay={80 + idx * 70} style={{ width: "48%" }}>
                  <Pressable onPress={() => open(item)} style={({ pressed }) => ({ width: "100%", aspectRatio: 1.15, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: tokens.color.hairline, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                    <Image source={item.src} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 8 }}>
                      <View style={{ backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 8, padding: 6 }}>
                        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "900" }}>{item.service}</Text>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, marginTop: 1 }}>{item.car} · {item.year}</Text>
                      </View>
                    </View>
                  </Pressable>
                </FadeSlideIn>
              ))}
            </View>
          )}
        </Container>
      </ScrollView>

      <Modal visible={!!lightbox} transparent statusBarTranslucent>
        <Animated.View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.96)", justifyContent: "center", alignItems: "center", opacity: fadeAnim }}>
          <Pressable style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} onPress={close} />
          {lightbox && (
            <Animated.View style={{ width: W, alignItems: "center", transform: [{ scale: scaleAnim }] }}>
              <Image source={lightbox.src} style={{ width: W, height: H * 0.6 }} resizeMode="contain" />
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16, marginTop: 20 }}>{lightbox.service}</Text>
              <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 4 }}>{lightbox.car} · {lightbox.year}</Text>
            </Animated.View>
          )}
          <Pressable onPress={close} style={({ pressed }) => ({ position: "absolute", top: 56, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", opacity: pressed ? 0.7 : 1 })}>
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
        </Animated.View>
      </Modal>
    </Screen>
  );
}
