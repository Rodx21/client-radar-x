import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { notify } from "@/app/lib/notify";
import { Screen, FormField, ToggleRow, Pill, PrimaryButton, AdminHeader } from "@/app/theme/ui";

// Admin form to create a new service in the catalogue.
export default function NewServiceScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CLIENT.serviceCategories[0]?.id ?? "");
  const [priceFrom, setPriceFrom] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const valid = name.trim().length >= 2 && category.length > 0;

  async function submit() {
    setSaving(true);
    const { error } = await supabase.from("services").insert({
      tenant_id: TENANT_ID,
      name: name.trim(),
      description: description.trim() || null,
      category,
      price_from: priceFrom ? Number(priceFrom) : null,
      image_url: imageUrl.trim() || null,
      active,
    });
    setSaving(false);
    if (error) { notify(t("login.errorTitle"), error.message); return; }
    router.back();
  }

  return (
    <Screen>
      <AdminHeader title={t("admin.services.new")} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: tokens.space.xl }}>
        <FormField label={t("admin.services.name")} value={name} onChangeText={setName} placeholder={t("admin.services.namePh")} />
        <FormField label={t("admin.services.description")} value={description} onChangeText={setDescription} placeholder={t("admin.services.descriptionPh")} multiline />

        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, marginBottom: 8 }}>{t("admin.services.category")}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {CLIENT.serviceCategories.map((c) => (
            <Pill key={c.id} label={c.label} active={category === c.id} onPress={() => setCategory(c.id)} />
          ))}
        </View>

        <FormField label={t("admin.services.priceFrom")} value={priceFrom} onChangeText={setPriceFrom} placeholder="0" keyboardType="numeric" />
        <FormField label={t("admin.services.imageUrl")} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
        <ToggleRow label={t("admin.services.active")} value={active} onValueChange={setActive} />

        <View style={{ marginTop: tokens.space.lg }}>
          <PrimaryButton label={saving ? t("login.loading") : t("admin.save")} onPress={submit} disabled={saving || !valid} />
        </View>
      </ScrollView>
    </Screen>
  );
}
