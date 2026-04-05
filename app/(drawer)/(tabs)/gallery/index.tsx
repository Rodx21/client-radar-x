import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../../theme/theme";
import { useT } from "../../../i18n";
import { Screen, Container, Card, FadeSlideIn, PrimaryButton } from "../../../theme/ui";
import { getSession, Session } from "../../../auth/session";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const GALLERY_ITEMS = [
  {
    id: "1",
    src: require("../../../../assets/brands/auto-music-sound/gallery/car-01.png"),
    service: "Película Premium",
    car: "Ford Focus",
    year: "2022",
  },
  {
    id: "2",
    src: require("../../../../assets/brands/auto-music-sound/gallery/car-02.png"),
    service: "Chrome Delete",
    car: "VW Jetta",
    year: "2023",
  },
  {
    id: "3",
    src: require("../../../../assets/brands/auto-music-sound/gallery/car-03.png"),
    service: "Envelopamento",
    car: "BYD Dolphin",
    year: "2024",
  },
  {
    id: "4",
    src: require("../../../../assets/brands/auto-music-sound/gallery/car-04.png"),
    service: "Película + Som",
    car: "BMW 320i",
    year: "2021",
  },
];

export default function GalleryScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [lightbox, setLightbox] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  useEffect(() => {
    (async () => setSession(await getSession()))();
  }, []);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;

  function openLightbox(item: (typeof GALLERY_ITEMS)[0]) {
    setLightbox(item);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 180 }),
    ]).start();
  }

  function closeLightbox() {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 200, useNativeDriver: true }),
    ]).start(() => setLightbox(null));
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>

          {/* Header */}
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20, letterSpacing: -0.2 }}>
              {t("gallery.title")}
            </Text>
            <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 18 }}>
              {t("gallery.subPublic")}
            </Text>
          </FadeSlideIn>

          {/* Info card */}
          <FadeSlideIn delay={80}>
            <Card style={{ marginTop: tokens.space.lg }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: tokens.color.accentSoft,
                    borderWidth: 1,
                    borderColor: "rgba(255,0,0,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="images-outline" size={18} color={tokens.color.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>
                    {t("gallery.noteTitle")}
                  </Text>
                  <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 12, lineHeight: 16 }}>
                    {t("gallery.noteSub")}
                  </Text>
                </View>
              </View>
            </Card>
          </FadeSlideIn>

          {/* Stats row */}
          <FadeSlideIn delay={140}>
            <View style={{ flexDirection: "row", marginTop: tokens.space.lg, gap: 10 }}>
              {[
                { icon: "car-outline" as const, label: "4 jobs" },
                { icon: "star-outline" as const, label: "4.9 ★" },
                { icon: "shield-checkmark-outline" as const, label: "Garantia" },
              ].map((s) => (
                <View
                  key={s.label}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: tokens.color.hairline,
                    borderRadius: tokens.radius.lg,
                    backgroundColor: tokens.color.surface,
                    alignItems: "center",
                    paddingVertical: 10,
                    gap: 4,
                  }}
                >
                  <Ionicons name={s.icon} size={18} color={tokens.color.accent} />
                  <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 11 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </FadeSlideIn>

          {/* Grid — locked for unauthenticated users */}
          {!session ? (
            <FadeSlideIn delay={200}>
              <View style={{ marginTop: tokens.space.lg }}>
                {/* Blurred preview rows */}
                {[1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      marginBottom: 10,
                      borderRadius: tokens.radius.lg,
                      borderWidth: 1,
                      borderColor: tokens.color.hairline,
                      backgroundColor: tokens.color.surface,
                      padding: tokens.space.md,
                      opacity: 0.35,
                      height: 80,
                    }}
                  />
                ))}
                <Card style={{ marginTop: 4 }}>
                  <View style={{ alignItems: "center", paddingVertical: tokens.space.sm }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 18,
                        backgroundColor: tokens.color.accentSoft,
                        borderWidth: 1,
                        borderColor: "rgba(255,0,0,0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Ionicons name="lock-closed-outline" size={22} color={tokens.color.accent} />
                    </View>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, textAlign: "center" }}>
                      {t("tabs.loginRequiredTitle")}
                    </Text>
                    <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16, textAlign: "center" }}>
                      {t("tabs.loginRequiredSub")}
                    </Text>
                    <View style={{ marginTop: 14, width: "100%" }}>
                      <PrimaryButton label={t("tabs.loginCTA")} onPress={() => router.push("/login")} />
                    </View>
                  </View>
                </Card>
              </View>
            </FadeSlideIn>
          ) : null}

          {/* Grid */}
          {session ? (
          <View style={{ marginTop: tokens.space.lg, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {GALLERY_ITEMS.map((item, idx) => (
              <FadeSlideIn key={item.id} delay={180 + idx * 70} style={{ width: "48%" }}>
                <Pressable
                  onPress={() => openLightbox(item)}
                  style={({ pressed }) => ({
                    width: "100%",
                    aspectRatio: 1.15,
                    borderRadius: 18,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: tokens.color.hairline,
                    backgroundColor: tokens.color.surface,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                >
                  <Image source={item.src} style={{ width: "100%", height: "100%" }} resizeMode="cover" />

                  {/* Gradient overlay */}
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "55%",
                      backgroundColor: "rgba(0,0,0,0)",
                      justifyContent: "flex-end",
                      padding: 10,
                    }}
                  >
                    <View style={{ backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 10, padding: 8 }}>
                      <Text style={{ color: "#fff", fontSize: 11, fontWeight: "900", letterSpacing: -0.1 }}>
                        {item.service}
                      </Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 2 }}>
                        {item.car} · {item.year}
                      </Text>
                    </View>
                  </View>

                  {/* Badge */}
                  <View
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 999,
                      backgroundColor: tokens.color.accent,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 9, fontWeight: "900" }}>{t("gallery.badge")}</Text>
                  </View>
                </Pressable>
              </FadeSlideIn>
            ))}
          </View>
          ) : null}

        </Container>
      </ScrollView>

      {/* Lightbox Modal */}
      <Modal visible={!!lightbox} transparent statusBarTranslucent>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.96)",
            justifyContent: "center",
            alignItems: "center",
            opacity: fadeAnim,
          }}
        >
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeLightbox}
          />

          {lightbox ? (
            <Animated.View
              style={{
                width: SCREEN_W,
                transform: [{ scale: scaleAnim }],
                alignItems: "center",
              }}
            >
              <Image
                source={lightbox.src}
                style={{ width: SCREEN_W, height: SCREEN_H * 0.6 }}
                resizeMode="contain"
              />

              {/* Info below image */}
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
                  {lightbox.service}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 6, fontSize: 13 }}>
                  {lightbox.car} · {lightbox.year}
                </Text>
              </View>

              <View style={{ marginTop: 24, flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="close-circle-outline" size={18} color="rgba(255,255,255,0.4)" />
                <Text style={{ color: "rgba(255,255,255,0.4)", marginLeft: 6, fontSize: 12 }}>
                  Toque fora para fechar
                </Text>
              </View>
            </Animated.View>
          ) : null}

          {/* Close button */}
          <Pressable
            onPress={closeLightbox}
            style={({ pressed }) => ({
              position: "absolute",
              top: 56,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
        </Animated.View>
      </Modal>
    </Screen>
  );
}
