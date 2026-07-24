import { useCallback, useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { Screen, Container, Card, PrimaryButton, FadeSlideIn, AdminHeader } from "@/app/theme/ui";

type Item = { id: string; title: string | null; after_url: string };

// Admin grid of all gallery items for this tenant, each tile opening the edit form.
export default function AdminGalleryScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("gallery_items").select("id,title,after_url").eq("tenant_id", TENANT_ID).order("created_at", { ascending: false });
    if (data) setRows(data as Item[]);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches the list on mount
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  return (
    <Screen>
      <AdminHeader title={t("admin.gallery.title")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={tokens.color.accent} />}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.muted, fontSize: 12 }}>{t("admin.gallery.subtitle")}</Text>
          </FadeSlideIn>

          <View style={{ marginTop: tokens.space.lg }}>
            <PrimaryButton label={t("admin.gallery.new")} onPress={() => router.push("/admin/gallery/new")} />
          </View>

          {loading ? (
            <View style={{ marginTop: tokens.space.lg, alignItems: "center", paddingVertical: tokens.space.lg }}>
              <ActivityIndicator color={tokens.color.accent} />
            </View>
          ) : rows.length === 0 ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("admin.gallery.empty")}</Text>
            </Card>
          ) : (
            <View style={{ marginTop: tokens.space.lg, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {rows.map((item, idx) => (
                <FadeSlideIn key={item.id} delay={idx * 50} style={{ width: "48%" }}>
                  <Pressable onPress={() => router.push({ pathname: "/admin/gallery/[id]", params: { id: item.id } })} style={({ pressed }) => ({ width: "100%", aspectRatio: 1.15, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: tokens.color.hairline, transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                    <Image source={{ uri: item.after_url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="pencil" size={14} color="#fff" />
                    </View>
                    {item.title && (
                      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 8 }}>
                        <View style={{ backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 8, padding: 6 }}>
                          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "900" }}>{item.title}</Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                </FadeSlideIn>
              ))}
            </View>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
