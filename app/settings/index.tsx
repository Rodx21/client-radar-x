import React from "react";
import { View, Text, Switch, Pressable, Linking, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { Screen, Card, Divider } from "@/app/theme/ui";

const GITHUB = "https://github.com/Rodx21/client-radar-x";

// Settings screen: theme toggle, language switch, and app/about info.
export default function SettingsScreen() {
  const { tokens, mode, setMode } = useTheme();
  const { t, lang, setLang } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={{ paddingTop: Math.max(insets.top, 20) + 8, paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline, backgroundColor: tokens.color.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ width: 44 }} />
        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16 }}>{t("settings.title")}</Text>
        <Pressable onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: tokens.color.hairline }}>
          <Ionicons name="close" size={20} color={tokens.color.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: tokens.space.xl, gap: 20 }}>
        {/* Dark mode */}
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Ionicons name={mode === "dark" ? "moon-outline" : "sunny-outline"} size={20} color={mode === "dark" ? "#a78bfa" : "#f59e0b"} style={{ marginRight: 12 }} />
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t("settings.darkMode")}</Text>
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{mode === "dark" ? t("settings.on") : t("settings.off")}</Text>
              </View>
            </View>
            <Switch value={mode === "dark"} onValueChange={(v) => setMode(v ? "dark" : "light")} trackColor={{ false: tokens.color.hairline, true: `${tokens.color.accent}66` }} thumbColor={mode === "dark" ? tokens.color.accent : "#fff"} />
          </View>
        </Card>

        {/* Language */}
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Ionicons name="language-outline" size={20} color={tokens.color.accent} style={{ marginRight: 12 }} />
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t("settings.language")}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {(["pt-BR","en-US"] as const).map((l) => (
              <Pressable key={l} onPress={() => setLang(l)} style={{ flex: 1, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: lang === l ? `${tokens.color.accent}88` : tokens.color.hairline, backgroundColor: lang === l ? tokens.color.accentSoft : tokens.color.surface, alignItems: "center" }}>
                <Text style={{ color: lang === l ? tokens.color.ink : tokens.color.muted, fontWeight: "900", fontSize: 13 }}>{l === "pt-BR" ? "🇧🇷  Português" : "🇺🇸  English"}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* About */}
        <Card>
          {[
            { icon: "car-sport-outline" as const, label: t("settings.appLabel"), value: CLIENT.businessName },
            { icon: "code-slash-outline" as const, label: t("settings.versionLabel"), value: `v${CLIENT.appVersion}` },
            { icon: "layers-outline" as const, label: t("settings.stackLabel"), value: "Expo · React Native · TypeScript" },
          ].map((item, idx) => (
            <React.Fragment key={item.icon}>
              {idx > 0 && <View style={{ marginVertical: 12 }}><Divider /></View>}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name={item.icon} size={18} color={tokens.color.muted} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "700" }}>{item.label}</Text>
                  <Text style={{ color: tokens.color.ink, fontSize: 13, fontWeight: "900", marginTop: 2 }}>{item.value}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
          <View style={{ marginTop: 14 }}><Divider /></View>
          <Pressable onPress={() => Linking.openURL(CLIENT.instagramUrl).catch(() => {})} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", marginTop: 14, opacity: pressed ? 0.7 : 1 })}>
            <Ionicons name="logo-instagram" size={18} color={tokens.color.ink} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: tokens.color.muted, fontSize: 11 }}>{t("settings.instagramLabel")}</Text>
              <Text style={{ color: tokens.color.accent, fontSize: 13, fontWeight: "900", marginTop: 2 }}>@{CLIENT.instagramHandle}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={tokens.color.muted} />
          </Pressable>
          <View style={{ marginTop: 12 }}><Divider /></View>
          <Pressable onPress={() => Linking.openURL(GITHUB).catch(() => {})} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", marginTop: 14, opacity: pressed ? 0.7 : 1 })}>
            <Ionicons name="logo-github" size={18} color={tokens.color.ink} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: tokens.color.muted, fontSize: 11 }}>{t("settings.sourceCodeLabel")}</Text>
              <Text style={{ color: tokens.color.accent, fontSize: 13, fontWeight: "900", marginTop: 2 }}>{t("settings.viewOnGithub")}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={tokens.color.muted} />
          </Pressable>
        </Card>
      </ScrollView>
    </Screen>
  );
}
