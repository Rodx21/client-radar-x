import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider } from "./theme/theme";
import { I18nProvider } from "./i18n";
import { AuthProvider } from "./lib/auth";

SplashScreen.preventAutoHideAsync();

// Root navigation stack; wraps the whole app in theme, i18n, and auth/session providers.
export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="quote/index" />
            <Stack.Screen name="booking/index" />
            <Stack.Screen name="admin" />
          </Stack>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
