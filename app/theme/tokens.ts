import { CLIENT } from "@/config/client";

export type ThemeMode = "light" | "dark";

const radius: { md: number; lg: number; xl: number; pill: number } = { md: 14, lg: 18, xl: 24, pill: 999 };

const base = {
  radius,
  space: { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
  font: { title: 22, h1: 28, h2: 18, body: 14, small: 12 },
} as const;

// Builds the color/spacing/radius token set for the given light/dark mode.
export function createTokens(mode: ThemeMode) {
  const accent = CLIENT.colors.accent;
  const accentSoft = mode === "dark" ? CLIENT.colors.accentSoftDark : CLIENT.colors.accentSoftLight;
  return {
    ...base,
    color: mode === "dark"
      ? { ink: "#FFFFFF", surface: "#0A0A0A", surfaceSoft: "#111111", muted: "#C9CDD2", hairline: "rgba(255,255,255,0.10)", accent, accentSoft }
      : { ink: "#111111", surface: "#FFFFFF", surfaceSoft: "#F5F6F7", muted: "#6B6B70", hairline: "#E6E6EA", accent, accentSoft },
  } as const;
}

export type Tokens = ReturnType<typeof createTokens>;
