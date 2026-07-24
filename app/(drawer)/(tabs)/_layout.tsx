import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";

// Bottom tab navigation for the four main screens (Home, Services, Gallery, Agenda).
export default function TabsLayout() {
  const { tokens } = useTheme();
  const { t } = useT();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: tokens.color.accent,
      tabBarInactiveTintColor: tokens.color.muted,
      tabBarStyle: { backgroundColor: tokens.color.surface, borderTopColor: tokens.color.hairline, height: 60, paddingBottom: 8 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
    }}>
      <Tabs.Screen name="inicio/index" options={{ title: t("nav.home"), tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="services/index" options={{ title: t("nav.services"), tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="gallery/index" options={{ title: t("nav.gallery"), tabBarIcon: ({ color, size }) => <Ionicons name="images-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="agenda/index" options={{ title: t("nav.agenda"), tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
