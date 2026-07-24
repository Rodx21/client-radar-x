import React, { type ComponentProps } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { signOut } from "@/app/lib/session";
import { useSession } from "@/app/lib/auth";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type DrawerHref = "/(drawer)/(tabs)/inicio" | "/(drawer)/(tabs)/services" | "/(drawer)/(tabs)/gallery" | "/(drawer)/(tabs)/agenda" | "/quote" | "/settings" | "/admin";

const LINKS: { key: string; labelKey: string; icon: IoniconName; href: DrawerHref; auth: boolean; adminOnly?: boolean }[] = [
  { key: "home",     labelKey: "drawer.home",     icon: "home-outline",     href: "/(drawer)/(tabs)/inicio",   auth: false },
  { key: "services", labelKey: "drawer.services", icon: "construct-outline", href: "/(drawer)/(tabs)/services", auth: false },
  { key: "gallery",  labelKey: "drawer.gallery",  icon: "images-outline",   href: "/(drawer)/(tabs)/gallery",  auth: true  },
  { key: "agenda",   labelKey: "drawer.agenda",   icon: "calendar-outline", href: "/(drawer)/(tabs)/agenda",   auth: true  },
  { key: "budgets",  labelKey: "drawer.budgets",  icon: "receipt-outline",  href: "/quote",                    auth: false },
  { key: "settings", labelKey: "drawer.settings", icon: "settings-outline", href: "/settings",                 auth: false },
  { key: "admin",    labelKey: "drawer.admin",    icon: "shield-checkmark-outline", href: "/admin",            auth: true, adminOnly: true },
];

// Side drawer navigation with links, active-state highlighting, and session-gated items.
export default function DrawerLayout() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const { session, refresh } = useSession();

  // Checks whether a drawer link matches the current route segment.
  function isActive(href: DrawerHref) { return !!pathname?.includes(href.replace("/(drawer)", "").split("/")[1]); }

  // Navigates to a drawer link, redirecting to login first if the link requires auth.
  function go(href: DrawerHref, auth: boolean) {
    if (auth && !session) { router.push("/login"); return; }
    router.push(href);
  }

  return (
    <Drawer
      screenOptions={{ headerShown: false, drawerType: "front", drawerStyle: { backgroundColor: tokens.color.surface, width: 300 } }}
      drawerContent={() => (
        <View style={{ flex: 1, backgroundColor: tokens.color.surface }}>
          <ScrollView contentContainerStyle={{ paddingTop: 56, paddingHorizontal: tokens.space.md }}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 17, paddingHorizontal: tokens.space.sm, marginBottom: 4 }}>
              {t("drawer.title")}
            </Text>
            <Text style={{ color: tokens.color.muted, fontSize: 12, paddingHorizontal: tokens.space.sm, marginBottom: 20 }}>
              {t("drawer.subtitle")}
            </Text>

            {LINKS.filter((link) => !link.adminOnly || session?.role === "admin").map((link) => {
              const active = isActive(link.href);
              const locked = link.auth && !session;
              return (
                <Pressable key={link.key} onPress={() => go(link.href, link.auth)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, marginBottom: 8, borderRadius: 14, borderWidth: 1, borderColor: active ? `${tokens.color.accent}88` : tokens.color.hairline, backgroundColor: active ? tokens.color.accentSoft : tokens.color.surface, padding: 12, flexDirection: "row", alignItems: "center" })}>
                  <Ionicons name={link.icon} size={18} color={active ? tokens.color.accent : locked ? tokens.color.muted : tokens.color.ink} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: locked ? tokens.color.muted : tokens.color.ink, fontWeight: "800", fontSize: 13 }}>{t(link.labelKey)}</Text>
                    {locked && <Text style={{ color: tokens.color.muted, fontSize: 11, marginTop: 2 }}>{t("drawer.loginRequired")}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={tokens.color.muted} />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ borderTopWidth: 1, borderTopColor: tokens.color.hairline, padding: tokens.space.lg }}>
            {session ? (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>{t("drawer.loggedAs")} {session.name}</Text>
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{session.email}</Text>
                <Pressable onPress={async () => { await signOut(); await refresh(); router.push("/(drawer)/(tabs)/inicio"); }}
                  style={{ marginTop: 12, backgroundColor: tokens.color.accent, borderRadius: tokens.radius.pill, paddingVertical: 12, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "900" }}>{t("drawer.logout")}</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13 }}>{t("drawer.notLogged")}</Text>
                <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 2 }}>{t("drawer.notLoggedSub")}</Text>
                <Pressable onPress={() => router.push("/login")}
                  style={{ marginTop: 12, backgroundColor: tokens.color.accent, borderRadius: tokens.radius.pill, paddingVertical: 12, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "900" }}>{t("drawer.login")}</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "" }} />
    </Drawer>
  );
}
