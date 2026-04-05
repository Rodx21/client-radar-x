/**
 * File: mobile/app/login.tsx
 * Minimal login screen (local session only for now).
 */
import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Container, Card, PrimaryButton, GhostButton } from "./theme/ui";
import { useTheme } from "./theme/theme";
import { useT } from "./i18n";
import { setSession } from "./auth/session";

export default function Login() {
  const router = useRouter();
  const { tokens } = useTheme();
  const { t } = useT();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    if (email.trim().length < 3 || password.trim().length < 3) return;

    setLoading(true);
    try {
      // Local-only login (placeholder)
      const name = email.includes("@") ? email.split("@")[0] : email;
      await setSession({
        userId: "local-user",
        name: name,
        email: email.trim(),
      });

      router.replace("/(drawer)/(tabs)/inicio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: tokens.space.xl,
          paddingTop: tokens.space.xl,
          paddingBottom: tokens.space.md,
          borderBottomWidth: 1,
          borderBottomColor: tokens.color.hairline,
          backgroundColor: tokens.color.surface,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Ionicons name="chevron-back" size={22} color={tokens.color.ink} />
        </Pressable>

        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
          {t("login.title")}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <Container style={{ paddingTop: tokens.space.lg }}>
        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18, letterSpacing: -0.15 }}>
          {t("login.headline")}
        </Text>
        <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
          {t("login.sub")}
        </Text>

        <View style={{ marginTop: tokens.space.lg }}>
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, letterSpacing: -0.1 }}>
            {t("login.email")}
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t("login.emailPh")}
            placeholderTextColor={tokens.color.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: tokens.color.hairline,
              backgroundColor: tokens.color.surface,
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: tokens.color.ink,
              fontWeight: "700",
            }}
          />

          <View style={{ height: 12 }} />

          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, letterSpacing: -0.1 }}>
            {t("login.password")}
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t("login.passwordPh")}
            placeholderTextColor={tokens.color.muted}
            secureTextEntry
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: tokens.color.hairline,
              backgroundColor: tokens.color.surface,
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: tokens.color.ink,
              fontWeight: "700",
            }}
          />
        </View>

        <View style={{ marginTop: tokens.space.lg }}>
          <PrimaryButton
            label={loading ? t("login.loading") : t("login.submit")}
            onPress={doLogin}
            disabled={loading || email.trim().length < 3 || password.trim().length < 3}
          />
          <View style={{ height: 10 }} />
          <GhostButton label={t("login.cancel")} onPress={() => router.back()} />
        </View>

        <View style={{ marginTop: tokens.space.lg }}>
          <Card>
            <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 16 }}>
              {t("login.note")}
            </Text>
          </Card>
        </View>
      </Container>
    </Screen>
  );
}
