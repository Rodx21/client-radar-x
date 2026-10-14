import { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { goBackOr } from "@/app/lib/nav";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { Screen, Container, Card, Divider, GhostButton, StatusBadge, FadeSlideIn, AdminHeader } from "@/app/theme/ui";
import { MOCK_CONVERSATIONS, MOCK_THREADS, useLeads, updateLeadStatus, Message } from "@/app/lib/mockCrm";
import { LEAD_STATUSES, leadStatusMeta } from "@/app/lib/leadStatus";

// Admin conversation detail: message thread + lead panel with AI analysis. Fictional data — mirrors what the real business-os project already does in production.
export default function AdminInboxDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const leads = useLeads();
  const conversation = useMemo(() => MOCK_CONVERSATIONS.find((c) => c.id === id), [id]);
  const lead = useMemo(() => leads.find((l) => l.id === conversation?.leadId), [leads, conversation]);
  const thread: Message[] = MOCK_THREADS[id ?? ""] ?? (conversation ? [{ id: "m0", direction: "in", text: conversation.snippet, time: conversation.lastMessageAt }] : []);

  if (!conversation || !lead) {
    return (
      <Screen>
        <AdminHeader title={t("admin.inbox.title")} onBack={() => (goBackOr(router, "/admin/inbox"))} />
      </Screen>
    );
  }

  const meta = leadStatusMeta(lead.status, t);

  return (
    <Screen>
      <AdminHeader
        title={conversation.contactName}
        onBack={() => (goBackOr(router, "/admin/inbox"))}
        right={<StatusBadge label={meta.label} color={meta.color} />}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <FadeSlideIn delay={0}>
            <Text style={{ color: tokens.color.muted, fontSize: 12 }}>{conversation.phone}</Text>
          </FadeSlideIn>

          {/* Thread */}
          <Card style={{ marginTop: tokens.space.lg }}>
            <View style={{ gap: 8 }}>
              {thread.map((m) => (
                <View key={m.id} style={{ alignSelf: m.direction === "out" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                  <View style={{ backgroundColor: m.direction === "out" ? tokens.color.accentSoft : tokens.color.surfaceSoft, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Text style={{ color: tokens.color.ink, fontSize: 13 }}>{m.text}</Text>
                    <Text style={{ color: tokens.color.muted, fontSize: 9.5, marginTop: 4, textAlign: "right" }}>{m.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Lead info */}
          <Card style={{ marginTop: tokens.space.md }}>
            <Text style={{ color: tokens.color.muted, fontSize: 10.5, fontWeight: "800" }}>{t("admin.inbox.leadPanelOrigin")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 13, fontWeight: "700", marginTop: 3 }}>{lead.origin}</Text>
            <Text style={{ color: tokens.color.muted, fontSize: 10.5, marginTop: 3 }}>{lead.createdAt ? `${t("admin.inbox.createdAt")}: ${lead.createdAt}` : ""}</Text>
            <Divider style={{ marginVertical: 12 }} />
            <Text style={{ color: tokens.color.muted, fontSize: 10.5, fontWeight: "800" }}>{t("admin.inbox.leadPanelInterest")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 13, fontWeight: "700", marginTop: 3 }}>{lead.service} · {lead.vehicle}</Text>
            <Text style={{ color: tokens.color.accent, fontSize: 12.5, fontWeight: "800", marginTop: 3 }}>{t("admin.inbox.estimatedValue")}: R$ {lead.estimatedValue.toLocaleString("pt-BR")}</Text>
            <Divider style={{ marginVertical: 12 }} />
            <Text style={{ color: tokens.color.muted, fontSize: 10.5, fontWeight: "800" }}>{t("admin.inbox.leadPanelOwner")}</Text>
            <Text style={{ color: tokens.color.ink, fontSize: 13, fontWeight: "700", marginTop: 3 }}>{lead.owner}</Text>
          </Card>

          {/* AI analysis */}
          <Card style={{ marginTop: tokens.space.md, backgroundColor: tokens.color.accentSoft, borderColor: "transparent" }}>
            <Text style={{ color: tokens.color.accent, fontSize: 11, fontWeight: "900" }}>🤖 {t("admin.inbox.aiSectionTitle")}</Text>
            {lead.aiSummary ? (
              <>
                <Text style={{ color: tokens.color.ink, fontSize: 12.5, marginTop: 6, lineHeight: 18 }}>{lead.aiSummary}</Text>
                {lead.aiNextAction && <Text style={{ color: tokens.color.accent, fontSize: 12.5, fontWeight: "800", marginTop: 8 }}>{t("admin.inbox.nextAction")}: {lead.aiNextAction}</Text>}
              </>
            ) : (
              <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6 }}>{t("admin.inbox.noAiYet")}</Text>
            )}
          </Card>

          {/* Stage change */}
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, marginTop: tokens.space.lg, marginBottom: 10 }}>{t("admin.inbox.changeStage")}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {LEAD_STATUSES.map((s) => {
              const m = leadStatusMeta(s, t);
              return s === lead.status ? (
                <StatusBadge key={s} label={m.label} color={m.color} />
              ) : (
                <GhostButton key={s} label={m.label} onPress={() => updateLeadStatus(lead.id, s)} style={{ paddingVertical: 8, paddingHorizontal: 12, width: undefined }} />
              );
            })}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
