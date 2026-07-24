import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { notify } from "@/app/lib/notify";
import { Screen, Container, Card, FormField, PrimaryButton, FadeSlideIn, AdminHeader } from "@/app/theme/ui";

// Admin form to edit this tenant's business info (name, brand color, contact details).
export default function AdminTenantSettingsScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [brandColor, setBrandColor] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("tenants").select("*").eq("id", TENANT_ID).single();
    if (data) {
      setName(data.name ?? "");
      setBrandColor(data.brand_color ?? "");
      setWhatsapp(data.whatsapp ?? "");
      setAddress(data.address ?? "");
      setInstagram(data.instagram ?? "");
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches tenant settings on mount
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  async function submit() {
    setSaving(true);
    const { error } = await supabase.from("tenants").update({
      name: name.trim(),
      brand_color: brandColor.trim() || null,
      whatsapp: whatsapp.trim() || null,
      address: address.trim() || null,
      instagram: instagram.trim() || null,
    }).eq("id", TENANT_ID);
    setSaving(false);
    if (error) { notify(t("login.errorTitle"), error.message); return; }
    notify(t("admin.settings.savedTitle"), t("admin.settings.savedSub"));
  }

  if (loading) {
    return (
      <Screen>
        <AdminHeader title={t("admin.settings.title")} onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={tokens.color.accent} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AdminHeader title={t("admin.settings.title")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 18 }}>{t("admin.settings.subtitle")}</Text>
          </FadeSlideIn>

          <View style={{ marginTop: tokens.space.lg }}>
            <FormField label={t("admin.settings.name")} value={name} onChangeText={setName} placeholder={t("admin.settings.namePh")} />
            <FormField label={t("admin.settings.brandColor")} value={brandColor} onChangeText={setBrandColor} placeholder="#FF0000" />
            <FormField label={t("admin.settings.whatsapp")} value={whatsapp} onChangeText={setWhatsapp} placeholder="5511999999999" keyboardType="numeric" />
            <FormField label={t("admin.settings.address")} value={address} onChangeText={setAddress} placeholder={t("admin.settings.addressPh")} />
            <FormField label={t("admin.settings.instagram")} value={instagram} onChangeText={setInstagram} placeholder="seuusuario" />
          </View>

          <Card style={{ marginTop: 4, marginBottom: tokens.space.lg }}>
            <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 18 }}>{t("admin.settings.brandColorHint")}</Text>
          </Card>

          <PrimaryButton label={saving ? t("login.loading") : t("admin.save")} onPress={submit} disabled={saving || name.trim().length < 2} />
        </Container>
      </ScrollView>
    </Screen>
  );
}
