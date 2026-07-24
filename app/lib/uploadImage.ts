import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";

// Opens the native photo picker (or a browser file input on web) and resolves a single local image URI, or null if cancelled/denied.
export async function pickImage(): Promise<string | null> {
  if (Platform.OS === "web") {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] as ImagePicker.MediaType[], quality: 0.85 });
  return result.canceled ? null : result.assets[0].uri;
}

// Resolves a file extension from a local file:// URI or a web data: URI.
function extFromUri(uri: string): string {
  const dataMatch = /^data:image\/(\w+);/.exec(uri);
  if (dataMatch) return dataMatch[1] === "jpeg" ? "jpg" : dataMatch[1];
  const ext = uri.split(/[#?]/)[0].split(".").pop()?.toLowerCase();
  return ext && ext.length <= 4 ? ext : "jpg";
}

// Uploads a local image (native file:// URI or web data: URI) to a Supabase Storage bucket and returns its public URL, or null on failure.
export async function uploadImage(bucket: string, path: string, uri: string): Promise<string | null> {
  try {
    const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
    const ext = extFromUri(uri);
    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const { error } = await supabase.storage.from(bucket).upload(`${path}.${ext}`, arraybuffer, { contentType, upsert: true });
    if (error) { console.warn(`upload to ${bucket} failed:`, error.message); return null; }
    return supabase.storage.from(bucket).getPublicUrl(`${path}.${ext}`).data.publicUrl;
  } catch (e) {
    console.warn(`upload to ${bucket} threw:`, e);
    return null;
  }
}
