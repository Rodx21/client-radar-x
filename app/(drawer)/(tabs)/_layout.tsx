import React from "react";
import { Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/theme";
import { useT } from "../../i18n";

export default function TabsLayout() {
  const { tokens } = useTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.color.accent,
        tabBarInactiveTintColor: tokens.color.muted,
        tabBarStyle: {
          backgroundColor: tokens.color.surface,
          borderTopColor: tokens.color.hairline,
          height: 56 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      {/* Hide Agenda from bottom tabs (admin-only for now) */}
      <Tabs.Screen name="agenda/index" options={{ href: null }} />

      <Tabs.Screen
        name="inicio/index"
        options={{
          title: t("nav.home"),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="gallery/index"
        options={{
          title: t("nav.gallery"),
          tabBarIcon: ({ color, size }) => <Ionicons name="images-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="services/index"
        options={{
          title: t("nav.services"),
          tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="orcamentos/index"
        options={{
          title: t("nav.budgets"),
          tabBarIcon: ({ color, size }) => <Ionicons name="cash-outline" size={size} color={color} />,
          tabBarButton: (props) => (
            <Pressable
              style={props.style as any}
              onPress={() => router.push("/quote")}
              accessibilityRole="button"
              accessibilityLabel={t("nav.budgets")}
            >
              {props.children}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
