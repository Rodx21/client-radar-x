import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, type KeyboardTypeOptions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "./theme/theme";
import { useT } from "./i18n";
import { supabase } from "./lib/supabase";
import { notify } from "./lib/notify";
import { Screen, Card, PrimaryButton, GhostButton } from "./theme/ui";

type Mode = "signin" | "signup";

// Sign-in / sign-up screen backed by Supabase Auth.
export default function LoginScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Calls Supabase sign-in or sign-up depending on the active mode, then navigates or notifies.
  async function submit() {
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
      setLoading(false);
      if (error) { notify(t("login.errorTitle"), error.message); return; }
      router.replace("/(drawer)/(tabs)/inicio");
    } else {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password: password.trim(), options: { data: { full_name: fullName.trim() } } });
      setLoading(false);
      if (error) { notify(t("login.errorTitle"), error.message); return; }
      notify(t("login.signupSuccessTitle"), t("login.signupSuccessSub"), () => setMode("signin"));
    }
  }

  const valid = mode === "signin" ? email.length >= 3 && password.length >= 6 : email.length >= 3 && password.length >= 6 && fullName.length >= 2;

  // Renders a labeled text input field for the sign-in/sign-up form.
  const inp = (value: string, setter: (v: string) => void, label: string, ph: string, opts?: { secure?: boolean; kb?: KeyboardTypeOptions }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={ph} placeholderTextColor={tokens.color.muted} secureTextEntry={opts?.secure} keyboardType={opts?.kb} autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: tokens.color.ink, fontWeight: "700" }} />
    </View>
  );

  return (
    <Screen>
      <View style={{ paddingTop: Math.max(insets.top, 20) + 8, paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline, backgroundColor: tokens.color.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-back" size={22} color={tokens.color.ink} />
        </Pressable>
        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16 }}>{t("login.title")}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: tokens.space.xl }}>
        {/* Mode toggle */}
        <View style={{ flexDirection: "row", borderRadius: 999, borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surfaceSoft, padding: 4, marginBottom: tokens.space.lg }}>
          {(["signin","signup"] as Mode[]).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} style={{ flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: mode === m ? tokens.color.surface : "transparent", alignItems: "center", borderWidth: mode === m ? 1 : 0, borderColor: tokens.color.hairline }}>
              <Text style={{ color: mode === m ? tokens.color.ink : tokens.color.muted, fontWeight: "900", fontSize: 13 }}>{m === "signin" ? t("login.tabSignIn") : t("login.tabSignUp")}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18, marginBottom: 6 }}>{mode === "signin" ? t("login.headline") : t("login.signupHeadline")}</Text>
        <Text style={{ color: tokens.color.muted, fontSize: 12, marginBottom: tokens.space.lg, lineHeight: 18 }}>{mode === "signin" ? t("login.sub") : t("login.signupSub")}</Text>

        {mode === "signup" && inp(fullName, setFullName, t("login.fullName"), t("login.fullNamePh"))}
        {inp(email, setEmail, t("login.email"), t("login.emailPh"), { kb: "email-address" })}
        {inp(password, setPassword, t("login.password"), t("login.passwordPh"), { secure: true })}

        <PrimaryButton label={loading ? t("login.loading") : mode === "signin" ? t("login.submit") : t("login.signupSubmit")} onPress={submit} disabled={loading || !valid} />
        <View style={{ height: 10 }} />
        <GhostButton label={t("login.cancel")} onPress={() => router.back()} />

        <Card style={{ marginTop: tokens.space.lg }}>
          <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 18 }}>{t("login.note")}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
