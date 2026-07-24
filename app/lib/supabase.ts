import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CLIENT } from "@/config/client";

// Expo Router renders this module on the server (no `window`/localStorage),
// so AsyncStorage's web shim must be skipped there or GoTrueClient crashes on init.
const ssrSafeStorage = {
  // Reads a stored auth key, returning null when running outside the browser.
  getItem: (key: string) => (typeof window === "undefined" ? Promise.resolve(null) : AsyncStorage.getItem(key)),
  // Persists an auth key, no-op when running outside the browser.
  setItem: (key: string, value: string) => (typeof window === "undefined" ? Promise.resolve() : AsyncStorage.setItem(key, value)),
  // Deletes a stored auth key, no-op when running outside the browser.
  removeItem: (key: string) => (typeof window === "undefined" ? Promise.resolve() : AsyncStorage.removeItem(key)),
};

// Shared Supabase client used by every screen for auth and database access.
export const supabase = createClient(CLIENT.supabaseUrl, CLIENT.supabaseAnonKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Active tenant id for this white-label deployment, used to scope every query.
export const TENANT_ID = CLIENT.tenantId;
