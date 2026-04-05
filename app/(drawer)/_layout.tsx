/**
 * File: mobile/app/(drawer)/_layout.tsx
 * Drawer populated with items + auth status footer.
 */
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useTheme } from "../theme/theme";
import { useT } from "../i18n";
import { clearSession, getSession, Session } from "../auth/session";

type DrawerLink = {
  key: string;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
  requiresAuth?: boolean;
};

export default function DrawerLayout() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingSession(true);
      const s = await getSession();
      if (!alive) return;
      setSession(s);
      setLoadingSession(false);
    })();
    return () => {
      alive = false;
    };
  }, [pathname]);

  const links: DrawerLink[] = useMemo(
    () => [
      { key: "home", labelKey: "drawer.home", icon: "home-outline", href: "/(drawer)/(tabs)/inicio" },
      { key: "services", labelKey: "drawer.services", icon: "construct-outline", href: "/(drawer)/(tabs)/services" },

      // Protected (requires login)
      { key: "agenda", labelKey: "drawer.agenda", icon: "calendar-outline", href: "/(drawer)/(tabs)/agenda", requiresAuth: true },
      { key: "gallery", labelKey: "drawer.gallery", icon: "images-outline", href: "/(drawer)/(tabs)/gallery", requiresAuth: true },
      { key: "budgets", labelKey: "drawer.budgets", icon: "receipt-outline", href: "/quote", requiresAuth: false },

      { key: "settings", labelKey: "drawer.settings", icon: "settings-outline", href: "/settings", requiresAuth: true },
    ],
    []
  );

  function isActive(href: string) {
    if (href === "/(drawer)/(tabs)/inicio") return pathname?.includes("/inicio");
    if (href.includes("/services")) return pathname?.includes("/services");
    if (href.includes("/agenda")) return pathname?.includes("/agenda");
    if (href.includes("/gallery")) return pathname?.includes("/gallery");
    if (href === "/quote") return pathname?.includes("/quote");
    if (href === "/settings") return pathname?.includes("/settings");
    return false;
  }

  function go(href: string, requiresAuth?: boolean) {
    if (requiresAuth && !session) {
      router.push("/login");
      return;
    }
    router.push(href as any);
  }

  async function logout() {
    await clearSession();
    setSession(null);
    router.push("/(drawer)/(tabs)/inicio");
  }

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          backgroundColor: tokens.color.surface,
          width: 320,
        },
      }}
      drawerContent={() => (
        <View style={{ flex: 1 }}>
          <DrawerContentScrollView contentContainerStyle={{ paddingTop: tokens.space.xl }}>
            {/* Header */}
            <View style={{ paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18, letterSpacing: -0.15 }}>
                {t("drawer.title")}
              </Text>
              <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>
                {t("drawer.subtitle")}
              </Text>
            </View>

            {/* Links */}
            <View style={{ paddingHorizontal: tokens.space.md }}>
              {links.map((item) => {
                const active = isActive(item.href);
                const disabled = item.requiresAuth && !session;

                return (
                  <Pressable
                    key={item.key}
                    onPress={() => go(item.href, item.requiresAuth)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.92 : 1,
                      marginBottom: 8,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: active ? "rgba(255,0,0,0.55)" : tokens.color.hairline,
                      backgroundColor: active ? tokens.color.accentSoft : tokens.color.surface,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    })}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: active ? "rgba(255,0,0,0.55)" : tokens.color.hairline,
                        backgroundColor: tokens.color.surface,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10,
                      }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={active ? tokens.color.accent : disabled ? tokens.color.muted : tokens.color.ink}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: disabled ? tokens.color.muted : tokens.color.ink,
                          fontWeight: "900",
                          fontSize: 13,
                          letterSpacing: -0.1,
                        }}
                      >
                        {t(item.labelKey)}
                      </Text>
                      {disabled ? (
                        <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 11 }}>
                          {t("drawer.loginRequired")}
                        </Text>
                      ) : null}
                    </View>

                    <Ionicons name="chevron-forward" size={16} color={tokens.color.muted} />
                  </Pressable>
                );
              })}
            </View>
          </DrawerContentScrollView>

          {/* Footer auth status */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: tokens.color.hairline,
              paddingHorizontal: tokens.space.xl,
              paddingVertical: tokens.space.lg,
              backgroundColor: tokens.color.surface,
            }}
          >
            {loadingSession ? (
              <Text style={{ color: tokens.color.muted, fontSize: 12 }}>{t("drawer.loadingSession")}</Text>
            ) : session ? (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, letterSpacing: -0.1 }}>
                  {t("drawer.loggedAs")} {session.name}
                </Text>
                <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 12 }}>
                  {session.email ?? ""}
                </Text>

                <Pressable
                  onPress={logout}
                  style={({ pressed }) => ({
                    marginTop: 12,
                    opacity: pressed ? 0.9 : 1,
                    borderRadius: 16,
                    backgroundColor: tokens.color.accent,
                    paddingVertical: 12,
                    alignItems: "center",
                  })}
                >
                  <Text style={{ color: "white", fontWeight: "900" }}>{t("drawer.logout")}</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 13, letterSpacing: -0.1 }}>
                  {t("drawer.notLogged")}
                </Text>
                <Text style={{ color: tokens.color.muted, marginTop: 4, fontSize: 12 }}>
                  {t("drawer.notLoggedSub")}
                </Text>

                <Pressable
                  onPress={() => router.push("/login")}
                  style={({ pressed }) => ({
                    marginTop: 12,
                    opacity: pressed ? 0.9 : 1,
                    borderRadius: 16,
                    backgroundColor: tokens.color.accent,
                    paddingVertical: 12,
                    alignItems: "center",
                  })}
                >
                  <Text style={{ color: "white", fontWeight: "900" }}>{t("drawer.login")}</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}
    >
      {/* Keep tabs as the main content */}
      <Drawer.Screen name="(tabs)" options={{ title: "" }} />
    </Drawer>
  );
}
