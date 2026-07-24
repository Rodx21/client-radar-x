import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { supabase } from "@/app/lib/supabase";
import { notify } from "@/app/lib/notify";
import { Screen, FormField, ToggleRow, Pill, PrimaryButton, GhostButton, AdminHeader } from "@/app/theme/ui";

// Admin form to edit or delete an existing service.
export default function EditServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from("services").select("*").eq("id", id).single();
    if (data) {
      setName(data.name ?? "");
      setDescription(data.description ?? "");
      setCategory(data.category ?? "");
      setPriceFrom(data.price_from != null ? String(data.price_from) : "");
      setImageUrl(data.image_url ?? "");
      setActive(!!data.active);
    }
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches this record on mount/id change
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const valid = name.trim().length >= 2 && category.length > 0;

  async function submit() {
    setSaving(true);
    const { error } = await supabase.from("services").update({
      name: name.trim(),
      description: description.trim() || null,
      category,
      price_from: priceFrom ? Number(priceFrom) : null,
      image_url: imageUrl.trim() || null,
      active,
    }).eq("id", id);
    setSaving(false);
    if (error) { notify(t("login.errorTitle"), error.message); return; }
    router.back();
  }

  function confirmDelete() {
    const onConfirm = async () => {
      setSaving(true);
      const { error } = await supabase.from("services").delete().eq("id", id);
      setSaving(false);
      if (error) { notify(t("login.errorTitle"), error.message); return; }
      router.back();
    };
    if (Platform.OS === "web") {
      if (window.confirm(t("admin.services.deleteConfirm"))) onConfirm();
    } else {
      Alert.alert(t("admin.services.deleteTitle"), t("admin.services.deleteConfirm"), [
        { text: t("login.cancel"), style: "cancel" },
        { text: t("admin.delete"), style: "destructive", onPress: onConfirm },
      ]);
    }
  }

  if (loading) {
    return (
      <Screen>
        <AdminHeader title={t("admin.services.edit")} onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={tokens.color.accent} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AdminHeader title={t("admin.services.edit")} onBack={() => router.back()} />

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
          <View style={{ height: 10 }} />
          <GhostButton label={t("admin.delete")} onPress={confirmDelete} disabled={saving} />
        </View>
      </ScrollView>
    </Screen>
  );
}
