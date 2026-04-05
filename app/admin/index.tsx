import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../theme/theme";
import { useT } from "../i18n";
import { Screen, Container, Card, PrimaryButton, Divider } from "../theme/ui";
import { getSession, Session } from "../auth/session";

export default function AdminHome() {
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
            {t("admin.homeTitle")}
          </Text>
          <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
            {t("admin.homeSub")}
          </Text>

          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          {!session ? (
            <Card style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                {t("tabs.loginRequiredTitle")}
              </Text>
              <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                {t("tabs.loginRequiredSub")}
              </Text>
              <View style={{ marginTop: 12 }}>
                <PrimaryButton label={t("tabs.loginCTA")} onPress={() => router.push("/login")} />
              </View>
            </Card>
          ) : (
            <>
              <Card style={{ marginTop: tokens.space.lg }}>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                  {t("admin.agendaCardTitle")}
                </Text>
                <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                  {t("admin.agendaCardSub")}
                </Text>
                <View style={{ marginTop: 12 }}>
                  <PrimaryButton label={t("admin.openAgenda")} onPress={() => router.push("/admin/agenda")} />
                </View>
              </Card>

              <Card style={{ marginTop: 12 }}>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                  {t("admin.galleryCardTitle")}
                </Text>
                <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                  {t("admin.galleryCardSub")}
                </Text>
                <Text style={{ color: tokens.color.muted, marginTop: 10, fontSize: 12, lineHeight: 16 }}>
                  {t("admin.galleryLater")}
                </Text>
              </Card>
            </>
          )}
        </Container>
      </ScrollView>
    </Screen>
  );
}
