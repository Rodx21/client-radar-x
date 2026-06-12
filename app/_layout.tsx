import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider } from "./theme/theme";
import { I18nProvider } from "./i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="settings/index" />
          <Stack.Screen name="quote/index" />
        </Stack>
      </I18nProvider>
    </ThemeProvider>
  );
}
