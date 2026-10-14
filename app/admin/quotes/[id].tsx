import { useCallback, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { supabase } from "@/app/lib/supabase";
import { Screen, Container, Card, Divider, PrimaryButton, GhostButton, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { QuoteStatus, QUOTE_STATUSES, quoteStatusMeta } from "@/app/lib/quoteStatus";

type Detail = {
  id: string;
  service: string;
  car_model: string;
  car_year: string;
  photos: string[];
  contact_name: string;
  contact_phone: string;
  status: QuoteStatus;
  created_at: string;
};

// Admin detail view for a single quote request; lets the admin reply on WhatsApp and change status.
export default function AdminQuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const [quote, setQuote] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("quotes")
      .select("id,service,car_model,car_year,photos,contact_name,contact_phone,status,created_at")
      .eq("id", id)
      .single();
    if (data) setQuote(data as Detail);
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() fetches this record on mount/id change
  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  async function setStatus(status: QuoteStatus) {
    if (!quote) return;
    setSaving(true);
    const { error } = await supabase.from("quotes").update({ status }).eq("id", quote.id);
    if (!error) setQuote({ ...quote, status });
    setSaving(false);
  }

  function openWhatsApp() {
    if (!quote) return;
    const msg = t("admin.quotes.waTemplate")
      .replace("{service}", quote.service)
      .replace("{car}", `${quote.car_model} ${quote.car_year}`);
    Linking.openURL(`https://wa.me/${quote.contact_phone}?text=${encodeURIComponent(msg)}`).catch(() => {});
    if (quote.status === "pending") setStatus("viewed");
  }

  if (loading || !quote) {
    return (
      <Screen>
        <AdminHeader title={t("admin.quotes.detailTitle")} onBack={() => (goBackOr(router, "/admin/quotes"))} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={tokens.color.accent} />
        </View>
      </Screen>
    );
  }

  const meta = quoteStatusMeta(quote.status, t);

  return (
    <Screen>
      <AdminHeader title={t("admin.quotes.detailTitle")} onBack={() => (goBackOr(router, "/admin/quotes"))} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20 }}>{quote.contact_name}</Text>
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 4 }}>{quote.contact_phone}</Text>
              </View>
              <StatusBadge label={meta.label} color={meta.color} />
            </View>
          </FadeSlideIn>

          <Card style={{ marginTop: tokens.space.lg }}>
            <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800" }}>{t("admin.quotes.service")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }}>{quote.service}</Text>
            <Divider style={{ marginVertical: 12 }} />
            <Text style={{ color: tokens.color.muted, fontSize: 11, fontWeight: "800" }}>{t("admin.quotes.vehicle")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 14, fontWeight: "700", marginTop: 4 }}>{quote.car_model} · {quote.car_year}</Text>
          </Card>

          {quote.photos?.length > 0 && (
            <>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, marginTop: tokens.space.lg, marginBottom: 10 }}>{t("quote.photos")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {quote.photos.map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={{ width: 100, height: 100, borderRadius: 12 }} resizeMode="cover" />
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          <View style={{ marginTop: tokens.space.lg }}>
            <PrimaryButton label={t("admin.quotes.replyWhatsApp")} onPress={openWhatsApp} />
          </View>

          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, marginTop: tokens.space.lg, marginBottom: 10 }}>{t("admin.appointments.changeStatus")}</Text>
          <View style={{ gap: 8 }}>
            {QUOTE_STATUSES.map((s) => {
              const m = quoteStatusMeta(s, t);
              return s === quote.status ? (
                <PrimaryButton key={s} label={m.label} onPress={() => {}} disabled />
              ) : (
                <GhostButton key={s} label={m.label} onPress={() => setStatus(s)} disabled={saving} />
              );
            })}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
