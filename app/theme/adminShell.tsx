import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useT } from "@/app/i18n";
import { ADMIN_MODULES } from "@/app/lib/adminModules";
import { CLIENT } from "@/config/client";
import { AMS, BRAND_FONT } from "./brand";

export const ADMIN_SIDEBAR_WIDTH = 238;

// Persistent left-nav for the admin section on desktop web, mirroring the
// mobile hub's module list (app/lib/adminModules.ts) so both stay in sync.
// Fixed dark AMS palette regardless of the (light) ADMIN_TOKENS the rest of
// the admin section runs on — per the redesign spec, the sidebar is always
// dark even though "operação" itself is light.
export function AdminSidebar() {
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ width: ADMIN_SIDEBAR_WIDTH, backgroundColor: AMS.black, borderRightWidth: 1, borderRightColor: AMS.hairlineOnDark }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 18, paddingTop: 22, paddingBottom: 18 }}>
        <View style={{ width: 34, height: 34, borderRadius: 4, backgroundColor: AMS.red, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontFamily: BRAND_FONT.black, fontSize: 13 }}>{CLIENT.businessName.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.extrabold, fontSize: 14, lineHeight: 17 }}>Business OS</Text>
          <Text style={{ color: AMS.onDarkSecondary, fontFamily: BRAND_FONT.regular, fontSize: 11 }}>{CLIENT.businessName}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 12, gap: 2 }}>
        {ADMIN_MODULES.map((m) => {
          const active = pathname === m.href || pathname.startsWith(`${m.href}/`);
          return (
            <Pressable
              key={m.key}
              onPress={() => router.push(m.href)}
              style={({ pressed }) => [
                { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 4 },
                active ? { backgroundColor: AMS.red } : pressed ? { backgroundColor: AMS.black2 } : null,
              ]}
            >
              <Ionicons name={m.icon} size={17} color={active ? "#FFFFFF" : AMS.onDarkSecondary} />
              <Text style={{ color: active ? "#FFFFFF" : "#FFFFFF", fontFamily: active ? BRAND_FONT.bold : BRAND_FONT.medium, fontSize: 13.5, opacity: active ? 1 : 0.8 }}>
                {t(`admin.hub.${m.key}Title`)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={() => router.replace("/(drawer)/(tabs)/inicio")}
        style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 22, borderTopWidth: 1, borderTopColor: AMS.hairlineOnDark, opacity: pressed ? 0.7 : 1 }]}
      >
        <Ionicons name="arrow-back-outline" size={16} color={AMS.onDarkSecondary} />
        <Text style={{ color: AMS.onDarkSecondary, fontFamily: BRAND_FONT.semibold, fontSize: 12.5 }}>{t("drawer.home")}</Text>
      </Pressable>
    </View>
  );
}
