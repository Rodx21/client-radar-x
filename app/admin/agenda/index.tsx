import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../theme/theme";
import { useT } from "../../i18n";
import { Screen, Container, Card, SoftCard, PrimaryButton, Divider } from "../../theme/ui";
import { getSession, Session } from "../../auth/session";

export default function AdminAgendaScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => setSession(await getSession()))();
  }, []);

  // Demo data for now (we'll connect backend later)
  const items = [
    { id: "1", time: "10:00", title: "Honda Civic", sub: "Película premium" },
    { id: "2", time: "14:30", title: "Toyota Corolla", sub: "Som + instalação" },
  ];

  return (
    <Screen>
      <ScrollView>
        <Container style={{ paddingTop: tokens.space.lg, paddingBottom: tokens.space.xl }}>
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 20, letterSpacing: -0.2 }}>
            {t("admin.agendaTitle")}
          </Text>
          <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
            {t("admin.agendaSub")}
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
              <SoftCard style={{ marginTop: tokens.space.lg, padding: tokens.space.lg }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ paddingRight: 12, flex: 1 }}>
                    <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>
                      {t("admin.agendaSection")}
                    </Text>
                    <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12 }}>
                      {t("admin.agendaSectionSub")}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => {}}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.9 : 1,
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: tokens.color.hairline,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: tokens.color.surface,
                    })}
                  >
                    <Ionicons name="add" size={20} color={tokens.color.ink} />
                  </Pressable>
                </View>
              </SoftCard>

              <View style={{ marginTop: tokens.space.lg }}>
                {items.map((it) => (
                  <Card key={it.id} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{it.title}</Text>
                        <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12 }}>{it.sub}</Text>
                      </View>
                      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12 }}>{it.time}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            </>
          )}

          <View style={{ marginTop: tokens.space.lg }}>
            <PrimaryButton label={t("admin.backToAdmin")} onPress={() => router.push("/admin")} />
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
