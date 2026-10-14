import type { ImageSourcePropType } from "react-native";

export type ServiceCategory = { id: string; label: string };
export type DayHours = { open: string; close: string } | null;

export type ClientConfig = {
  businessName: string;
  tagline: string;
  slug: string;
  tenantId: string;
  appVersion: string;
  logo: ImageSourcePropType;
  colors: { accent: string; accentSoftLight: string; accentSoftDark: string };
  whatsappPhone: string;
  landlinePhone: string;
  instagramHandle: string;
  instagramUrl: string;
  mapsUrl: string;
  address: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  serviceCategories: ServiceCategory[];
  // Opening hours per weekday (0=Sunday..6=Saturday, matches Date#getDay()). null = closed.
  businessHours: Record<number, DayHours>;
};

export const CLIENT: ClientConfig = {
  businessName: "Auto Music Sound e Film",
  tagline: "Premium · Instalação profissional",
  slug: "auto-music-sound",
  tenantId: "00000000-0000-0000-0000-000000000001",
  appVersion: "1.0.0",
  logo: require("../assets/brands/auto-music-sound/wordmark-transparent.png"),
  colors: {
    accent: "#D9121F",
    accentSoftLight: "rgba(217, 18, 31, 0.12)",
    accentSoftDark: "rgba(217, 18, 31, 0.16)",
  },
  whatsappPhone: "5511943814636",
  landlinePhone: "1122965416",
  instagramHandle: "automusicsound",
  instagramUrl: "https://www.instagram.com/automusicsound/",
  mapsUrl: "https://maps.google.com/?q=R.+Serra+de+Botucatu,+2100,+Tatu%C3%A1p%C3%A9,+S%C3%A3o+Paulo+SP",
  address: "R. Serra de Botucatu, 2100, Tatuapé, SP",
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceCategories: [
    { id: "tint",     label: "Película"      },
    { id: "audio",    label: "Áudio"         },
    { id: "wrap",     label: "Envelopamento" },
    { id: "chrome",   label: "Chrome Delete" },
    { id: "lighting", label: "Iluminação"    },
    { id: "wheels",   label: "Rodas"         },
  ],
  businessHours: {
    0: null,                              // Sunday — closed
    1: { open: "09:00", close: "17:00" }, // Monday
    2: { open: "09:00", close: "17:00" }, // Tuesday
    3: { open: "09:00", close: "17:00" }, // Wednesday
    4: { open: "09:00", close: "17:00" }, // Thursday
    5: { open: "09:00", close: "17:00" }, // Friday
    6: { open: "08:00", close: "16:00" }, // Saturday
  },
};
