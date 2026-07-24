import AsyncStorage from "@react-native-async-storage/async-storage";

// Reads a local preference from AsyncStorage, returning null if missing or on error.
export async function getPref(key: string): Promise<string | null> {
  try { return await AsyncStorage.getItem(key); } catch { return null; }
}

// Persists a local preference to AsyncStorage, silently ignoring write errors.
export async function setPref(key: string, value: string): Promise<void> {
  try { await AsyncStorage.setItem(key, value); } catch {}
}
