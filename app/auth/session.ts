/**
 * File: mobile/app/auth/session.ts
 * Simple session storage (AsyncStorage).
 * Later we can replace this with real backend auth.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Session = {
  userId: string;
  name: string;
  email?: string;
};

const KEY = "crx_session_v1";

export async function getSession(): Promise<Session | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
