import type { ImageSourcePropType } from "react-native";

export type ServiceCategory = { id: string; label: string };

export type ClientConfig = {
  businessName: string;
  tagline: string;
  slug: string;
  tenantId: string;
  appVersion: string;
  logo: ImageSourcePropType;
  colors: { accent: string; accentSoftLight: string; accentSoftDark: string };
  whatsappPhone: string;
  instagramHandle: string;
  instagramUrl: string;
  mapsUrl: string;
  address: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  serviceCategories: ServiceCategory[];
};

export const CLIENT: ClientConfig = {
  businessName: "Auto Music Sound e Film",
  tagline: "Premium · Instalação profissional",
  slug: "auto-music-sound",
  tenantId: "00000000-0000-0000-0000-000000000001",
  appVersion: "1.0.0",
  logo: require("../assets/brands/auto-music-sound/wordmark-transparent.png"),
  colors: {
    accent: "#FF0000",
    accentSoftLight: "rgba(255, 0, 0, 0.12)",
    accentSoftDark: "rgba(255, 0, 0, 0.16)",
  },
  whatsappPhone: "5511943814636",
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
};
