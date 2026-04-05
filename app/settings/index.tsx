import React from "react";
import { View, Text, Switch, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useT } from "../i18n";
import { useTheme } from "../theme/theme";
import { Screen, Container, Card, Divider, FadeSlideIn } from "../theme/ui";

const APP_VERSION = "1.0.0";
const GITHUB_URL = "https://github.com/Rodx21/client-radar-x";
const INSTAGRAM_URL = "https://www.instagram.com/automusicsound/";

export default function Settings() {
  const router = useRouter();
  const { t, lang, setLang } = useT();
  const { mode, setMode, tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: tokens.space.xl,
          paddingTop: Math.max(insets.top, tokens.space.md) + tokens.space.sm,
          paddingBottom: tokens.space.md,
          borderBottomWidth: 1,
          borderBottomColor: tokens.color.hairline,
          backgroundColor: tokens.color.surface,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: 44 }} />

        <Text style={{ color: tokens.color.ink, fontSize: tokens.font.title, fontWeight: "900", letterSpacing: -0.15 }}>
          {t("settings.title")}
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: tokens.radius.lg,
            borderWidth: 1,
            borderColor: tokens.color.hairline,
            backgroundColor: tokens.color.surfaceSoft,
            opacity: pressed ? 0.9 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        >
          <Ionicons name="close" size={20} color={tokens.color.ink} />
        </Pressable>
      </View>

      <Container style={{ paddingTop: tokens.space.lg }}>

        {/* Appearance */}
        <FadeSlideIn delay={0}>
          <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>
            Aparência
          </Text>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 12 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: mode === "dark" ? "rgba(255,255,255,0.08)" : tokens.color.surfaceSoft,
                    borderWidth: 1,
                    borderColor: tokens.color.hairline,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name={mode === "dark" ? "moon-outline" : "sunny-outline"}
                    size={18}
                    color={mode === "dark" ? "#a78bfa" : "#f59e0b"}
                  />
                </View>
                <View>
                  <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>
                    {t("settings.darkMode")}
                  </Text>
                  <Text style={{ color: tokens.color.muted, marginTop: 2, fontSize: 12 }}>
                    {mode === "dark" ? "Ativado" : "Desativado"}
                  </Text>
                </View>
              </View>

              <Switch
                value={mode === "dark"}
                onValueChange={(v) => setMode(v ? "dark" : "light")}
                trackColor={{ false: tokens.color.hairline, true: "rgba(255,0,0,0.3)" }}
                thumbColor={mode === "dark" ? tokens.color.accent : "#fff"}
              />
            </View>
          </Card>
        </FadeSlideIn>

        {/* Language */}
        <FadeSlideIn delay={80}>
          <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, marginTop: tokens.space.lg }}>
            Idioma
          </Text>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: tokens.color.surfaceSoft,
                  borderWidth: 1,
                  borderColor: tokens.color.hairline,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="language-outline" size={18} color={tokens.color.accent} />
              </View>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>
                {t("settings.language")}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <LangPill label="🇧🇷  Português" active={lang === "pt-BR"} onPress={() => setLang("pt-BR")} />
              <LangPill label="🇺🇸  English" active={lang === "en-US"} onPress={() => setLang("en-US")} />
            </View>
          </Card>
        </FadeSlideIn>

        {/* About */}
        <FadeSlideIn delay={160}>
          <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, marginTop: tokens.space.lg }}>
            Sobre
          </Text>
          <Card>
            {[
              { icon: "car-sport-outline" as const, label: "Aplicativo", value: "Auto Music Sound e Film" },
              { icon: "code-slash-outline" as const, label: "Versão", value: `v${APP_VERSION}` },
              { icon: "layers-outline" as const, label: "Stack", value: "Expo · React Native · TypeScript" },
            ].map((item, idx) => (
              <React.Fragment key={item.label}>
                {idx > 0 && <View style={{ marginVertical: 12 }}><Divider /></View>}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: tokens.color.surfaceSoft,
                      borderWidth: 1,
                      borderColor: tokens.color.hairline,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={item.icon} size={18} color={tokens.color.muted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "700" }}>{item.label}</Text>
                    <Text style={{ color: tokens.color.ink, fontSize: 13, fontWeight: "900", marginTop: 2 }}>{item.value}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}

            <View style={{ marginTop: 16 }}>
              <Divider />
            </View>

            <Pressable
              onPress={() => Linking.openURL(INSTAGRAM_URL).catch(() => {})}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                marginTop: 14,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: tokens.color.surfaceSoft,
                  borderWidth: 1,
                  borderColor: tokens.color.hairline,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="logo-instagram" size={18} color={tokens.color.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "700" }}>Instagram</Text>
                <Text style={{ color: tokens.color.accent, fontSize: 13, fontWeight: "900", marginTop: 2 }}>@automusicsound</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={tokens.color.muted} />
            </Pressable>

            <View style={{ marginTop: 12 }}><Divider /></View>

            <Pressable
              onPress={() => Linking.openURL(GITHUB_URL).catch(() => {})}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                marginTop: 14,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: tokens.color.surfaceSoft,
                  borderWidth: 1,
                  borderColor: tokens.color.hairline,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="logo-github" size={18} color={tokens.color.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "700" }}>Código-fonte</Text>
                <Text style={{ color: tokens.color.accent, fontSize: 13, fontWeight: "900", marginTop: 2 }}>Ver no GitHub</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={tokens.color.muted} />
            </Pressable>
          </Card>
        </FadeSlideIn>

      </Container>
    </Screen>
  );
}

function LangPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: tokens.radius.pill,
        borderWidth: 1,
        borderColor: active ? "rgba(255,0,0,0.55)" : tokens.color.hairline,
        backgroundColor: active ? tokens.color.accentSoft : tokens.color.surface,
        alignItems: "center",
        opacity: pressed ? 0.9 : 1,
      })}
      accessibilityRole="button"
    >
      <Text style={{ color: active ? tokens.color.ink : tokens.color.muted, fontWeight: "900", letterSpacing: -0.1, fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}
