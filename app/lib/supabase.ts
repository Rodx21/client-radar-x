import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CLIENT } from "@/config/client";

// Expo Router renders this module on the server (no `window`/localStorage),
// so AsyncStorage's web shim must be skipped there or GoTrueClient crashes on init.
const ssrSafeStorage = {
  getItem: (key: string) => (typeof window === "undefined" ? Promise.resolve(null) : AsyncStorage.getItem(key)),
  setItem: (key: string, value: string) => (typeof window === "undefined" ? Promise.resolve() : AsyncStorage.setItem(key, value)),
  removeItem: (key: string) => (typeof window === "undefined" ? Promise.resolve() : AsyncStorage.removeItem(key)),
};

export const supabase = createClient(CLIENT.supabaseUrl, CLIENT.supabaseAnonKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const TENANT_ID = CLIENT.tenantId;
