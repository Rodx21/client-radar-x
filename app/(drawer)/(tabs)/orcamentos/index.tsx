import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../../../theme/theme";
import { useT } from "../../../i18n";
import { Screen, Container, Card, SoftCard, PrimaryButton, SecondaryButton, Divider } from "../../../theme/ui";
import { getSession, Session } from "../../../auth/session";

export default function OrcamentosScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => setSession(await getSession()))();
  }, []);

  return (
    <Screen>
      <ScrollView>
        <Container style={{ paddingTop: tokens.space.lg, paddingBottom: tokens.space.xl }}>
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20, letterSpacing: -0.2 }}>
            {t("orcamentos.title")}
          </Text>
          <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
            {t("orcamentos.sub")}
          </Text>

          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          {/* Public entry (same spirit as the Inicio Quote Hero) */}
          <SoftCard style={{ marginTop: tokens.space.lg, padding: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16 }}>
              {t("orcamentos.heroTitle")}
            </Text>
            <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
              {t("orcamentos.heroSub")}
            </Text>

            <View style={{ marginTop: 14, flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <PrimaryButton label={t("common.getQuote")} onPress={() => router.push("/quote")} />
              </View>
              <View style={{ flex: 1 }}>
                <SecondaryButton label={t("common.seeServices")} onPress={() => router.push("/(drawer)/(tabs)/services")} />
              </View>
            </View>
          </SoftCard>

          {/* Logged-only section (history/approvals later) */}
          {!session ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                {t("tabs.loginRequiredTitle")}
              </Text>
              <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                {t("orcamentos.loginNote")}
              </Text>
              <View style={{ marginTop: 12 }}>
                <PrimaryButton label={t("tabs.loginCTA")} onPress={() => router.push("/login")} />
              </View>
            </Card>
          ) : (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                {t("orcamentos.historyTitle")}
              </Text>
              <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                {t("orcamentos.historySub")}
              </Text>
            </Card>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
