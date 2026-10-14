import { useEffect } from "react";
import { View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSession } from "@/app/lib/auth";
import { useResponsive } from "@/app/lib/responsive";
import { AdminSidebar } from "@/app/theme/adminShell";
import { AdminThemeProvider } from "@/app/theme/adminTheme";
import { ADMIN_TOKENS } from "@/app/theme/adminTokens";

// Guards the entire /admin route group behind role==="admin"; real enforcement is RLS, this is UX-only.
// Also wraps every admin screen in the fixed "operação clara" palette
// (AdminThemeProvider) instead of the customer app's light/dark toggle — this
// is what makes the old TCC-era screens (appointments/quotes/services/
// gallery/settings) and the newer Business OS screens read as one product.
export default function AdminLayout() {
  const { session, loading } = useSession();
  const router = useRouter();
  const { isDesktop } = useResponsive();

  useEffect(() => {
    if (!loading && session?.role !== "admin") router.replace("/(drawer)/(tabs)/inicio");
  }, [loading, session, router]);

  if (loading || session?.role !== "admin") return null;

  const stack = <Stack screenOptions={{ headerShown: false }} />;

  return (
    <AdminThemeProvider>
      {!isDesktop ? (
        // Below the desktop breakpoint, admin keeps its original mobile
        // navigation (hub screen + pushed sub-screens) — no sidebar shell.
        stack
      ) : (
        <View style={{ flex: 1, flexDirection: "row", backgroundColor: ADMIN_TOKENS.color.surfaceSoft }}>
          <AdminSidebar />
          <View style={{ flex: 1, minWidth: 0 }}>{stack}</View>
        </View>
      )}
    </AdminThemeProvider>
  );
}
