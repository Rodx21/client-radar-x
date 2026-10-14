import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from "@expo-google-fonts/inter";
import { CormorantGaramond_300Light_Italic, CormorantGaramond_400Regular_Italic } from "@expo-google-fonts/cormorant-garamond";
import { ThemeProvider } from "./theme/theme";
import { I18nProvider } from "./i18n";
import { AuthProvider } from "./lib/auth";

SplashScreen.preventAutoHideAsync();

const FONT_LOAD_TIMEOUT_MS = 4000;

// Root navigation stack; wraps the whole app in theme, i18n, and auth/session providers.
// Also loads the brand typefaces (Inter for UI, Cormorant Garamond italic for
// testimonial-style quotes) used by the "site público" visual identity.
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
    CormorantGaramond_300Light_Italic, CormorantGaramond_400Regular_Italic,
  });
  // Belt-and-suspenders: if the Google Fonts asset never resolves (offline,
  // blocked, slow network) useFonts can hang indefinitely with fontsLoaded
  // stuck false — render the app anyway after a timeout, falling back to the
  // system font, rather than leaving the whole app on a blank screen forever.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), FONT_LOAD_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, []);

  const ready = fontsLoaded || !!fontError || timedOut;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

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
