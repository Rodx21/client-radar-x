import React from "react";
import { View, Text } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { ScreenHeader } from "../_components/ScreenHeader";
import { useT } from "../i18n";
import { tokens } from "../theme/tokens";
import { Screen, Container, Card, Title, Muted } from "../theme/ui";

export default function TokensDebug() {
  const { t } = useT();
  const navigation = useNavigation();

  const rows = [
    { name: "ink", value: tokens.color.ink },
    { name: "surface", value: tokens.color.surface },
    { name: "surfaceSoft", value: tokens.color.surfaceSoft },
    { name: "muted", value: tokens.color.muted },
    { name: "hairline", value: tokens.color.hairline },
    { name: "accent", value: tokens.color.accent },
  ];

  return (
    <Screen>
      <ScreenHeader title={t("debug.title")} onMenu={() => navigation.dispatch(DrawerActions.openDrawer())} />
      <Container style={{ paddingTop: tokens.space.lg }}>
        <Card>
          <Title>{t("debug.title")}</Title>
          <Muted style={{ marginTop: 8 }}>{t("debug.sub")}</Muted>

          <View style={{ marginTop: 14, gap: 10 }}>
            {rows.map((r) => (
              <View
                key={r.name}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: tokens.color.hairline,
                  borderRadius: tokens.radius.lg,
                  padding: 12,
                  backgroundColor: tokens.color.surface,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 6,
                      backgroundColor: r.value,
                      borderWidth: 1,
                      borderColor: tokens.color.hairline,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ color: tokens.color.ink, fontWeight: "900" }}>{r.name}</Text>
                </View>
                <Text style={{ color: tokens.color.muted, fontWeight: "700" }}>{r.value}</Text>
              </View>
            ))}
          </View>
        </Card>
      </Container>
    </Screen>
  );
}
