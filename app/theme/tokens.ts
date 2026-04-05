export type ThemeMode = "light" | "dark";

const base = {
  radius: {
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  space: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  font: {
    title: 22,
    h1: 28,
    h2: 18,
    body: 14,
    small: 12,
  },
} as const;

const lightColors = {
  ink: "#0B0B0D",
  surface: "#FFFFFF",
  surfaceSoft: "#F7F7F8",
  muted: "#6B6B70",
  hairline: "#E6E6EA",
  accent: "#FF0000", // brighter, more powerful red
  accentSoft: "rgba(255, 0, 0, 0.12)",
} as const;

const darkColors = {
  ink: "#FFFFFF",
  surface: "#0B0B0D",
  surfaceSoft: "#121216",
  muted: "#A9A9B2",
  hairline: "rgba(255,255,255,0.10)",
  accent: "#FF0000", // keep same powerful red
  accentSoft: "rgba(255, 0, 0, 0.16)",
} as const;

export function createTokens(mode: ThemeMode) {
  return {
    ...base,
    color: mode === "dark" ? darkColors : lightColors,
  } as const;
}

export type Tokens = ReturnType<typeof createTokens>;
