import { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { Screen, Container, Card, PrimaryButton, FadeSlideIn, AdminHeader } from "@/app/theme/ui";

type Service = { id: string; name: string; category: string; price_from: number | null; active: boolean };

// Admin list of all services (active and inactive) for this tenant.
export default function AdminServicesScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [rows, setRows] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("services").select("id,name,category,price_from,active").eq("tenant_id", TENANT_ID).order("category").order("name");
    if (data) setRows(data as Service[]);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches the list on mount
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  return (
    <Screen>
      <AdminHeader title={t("admin.services.title")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={tokens.color.accent} />}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.muted, fontSize: 12 }}>{t("admin.services.subtitle")}</Text>
          </FadeSlideIn>

          <View style={{ marginTop: tokens.space.lg }}>
            <PrimaryButton label={t("admin.services.new")} onPress={() => router.push("/admin/services/new")} />
          </View>

          {loading ? (
            <View style={{ marginTop: tokens.space.lg, alignItems: "center", paddingVertical: tokens.space.lg }}>
              <ActivityIndicator color={tokens.color.accent} />
            </View>
          ) : rows.length === 0 ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.muted, fontSize: 13, textAlign: "center" }}>{t("admin.services.empty")}</Text>
            </Card>
          ) : (
            <View style={{ marginTop: tokens.space.lg, gap: 10 }}>
              {rows.map((s, idx) => (
                <FadeSlideIn key={s.id} delay={idx * 50}>
                  <Pressable onPress={() => router.push({ pathname: "/admin/services/[id]", params: { id: s.id } })} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                    <Card>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{s.name}</Text>
                          <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{s.category}{s.price_from != null ? ` · ${t("common.priceFrom")}${s.price_from}` : ""}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: s.active ? "rgba(34,197,94,0.12)" : "rgba(107,107,112,0.10)", borderWidth: 1, borderColor: s.active ? "rgba(34,197,94,0.35)" : "rgba(107,107,112,0.25)" }}>
                          <Text style={{ color: s.active ? "#16a34a" : "#6b7280", fontWeight: "800", fontSize: 11 }}>{s.active ? t("admin.services.active") : t("admin.services.inactive")}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={tokens.color.muted} style={{ marginLeft: 8 }} />
                      </View>
                    </Card>
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
