import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "crx_quote_draft_v1";

export type QuoteDraft = {
  step?: number;
  service?: string | null;
  carModel?: string;
  carYear?: string;
  name?: string;
  phone?: string;
  photos?: string[]; // local URIs
};

export async function loadQuoteDraft(): Promise<QuoteDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    // NOTE: tolerant to older drafts that might include extra fields like "plate"
    const parsed = JSON.parse(raw);
    return parsed as QuoteDraft;
  } catch {
    return null;
  }
}

export async function saveQuoteDraft(draft: QuoteDraft): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export async function clearQuoteDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
