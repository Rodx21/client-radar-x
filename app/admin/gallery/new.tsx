import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { notify } from "@/app/lib/notify";
import { pickImage, uploadImage } from "@/app/lib/uploadImage";
import { Screen, FormField, Pill, PrimaryButton, GhostButton, AdminHeader } from "@/app/theme/ui";

// Admin form to create a new before/after gallery item.
export default function NewGalleryItemScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CLIENT.serviceCategories[0]?.id ?? "");
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);

  const valid = afterUrl.trim().length > 0;

  // Picks a photo from the device, uploads it to the gallery bucket, and fills the matching URL field with the result.
  async function pickAndUpload(which: "before" | "after") {
    const uri = await pickImage();
    if (!uri) return;
    setUploading(which);
    const url = await uploadImage("gallery", `${TENANT_ID}/${Date.now()}-${which}`, uri);
    setUploading(null);
    if (!url) { notify(t("login.errorTitle"), t("admin.gallery.uploadFailed")); return; }
    if (which === "before") setBeforeUrl(url); else setAfterUrl(url);
  }

  async function submit() {
    setSaving(true);
    const { error } = await supabase.from("gallery_items").insert({
      tenant_id: TENANT_ID,
      title: title.trim() || null,
      description: description.trim() || null,
      category,
      before_url: beforeUrl.trim() || null,
      after_url: afterUrl.trim(),
    });
    setSaving(false);
    if (error) { notify(t("login.errorTitle"), error.message); return; }
    goBackOr(router, "/admin/gallery");
  }

  return (
    <Screen>
      <AdminHeader title={t("admin.gallery.new")} onBack={() => (goBackOr(router, "/admin/gallery"))} />

      <ScrollView contentContainerStyle={{ padding: tokens.space.xl }}>
        <FormField label={t("admin.gallery.itemTitle")} value={title} onChangeText={setTitle} placeholder={t("admin.gallery.itemTitlePh")} />
        <FormField label={t("admin.services.description")} value={description} onChangeText={setDescription} placeholder={t("admin.services.descriptionPh")} multiline />

        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, marginBottom: 8 }}>{t("admin.services.category")}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {CLIENT.serviceCategories.map((c) => (
            <Pill key={c.id} label={c.label} active={category === c.id} onPress={() => setCategory(c.id)} />
          ))}
        </View>

        <FormField label={t("admin.gallery.beforeUrl")} value={beforeUrl} onChangeText={setBeforeUrl} placeholder="https://..." />
        <GhostButton label={uploading === "before" ? t("admin.gallery.uploading") : t("admin.gallery.pickPhoto")} onPress={() => pickAndUpload("before")} disabled={uploading !== null} style={{ marginTop: -4, marginBottom: 12 }} />

        <FormField label={t("admin.gallery.afterUrl")} value={afterUrl} onChangeText={setAfterUrl} placeholder="https://..." />
        <GhostButton label={uploading === "after" ? t("admin.gallery.uploading") : t("admin.gallery.pickPhoto")} onPress={() => pickAndUpload("after")} disabled={uploading !== null} style={{ marginTop: -4, marginBottom: 12 }} />

        <View style={{ marginTop: tokens.space.lg }}>
          <PrimaryButton label={saving ? t("login.loading") : t("admin.save")} onPress={submit} disabled={saving || !valid} />
        </View>
      </ScrollView>
    </Screen>
  );
}
