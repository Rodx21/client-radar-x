// Auto Music Sound — "Business OS redesenho visual v2" brand tokens (design
// handoff, 2026-08-20). Public surfaces are always dark, operational surfaces
// (admin) are always light — brand red is used only for action/alert, never
// as decorative background. See app/theme/tokens.ts for the app's existing
// light/dark mode tokens, which this complements rather than replaces.

export const BRAND_FONT = {
  black: "Inter_900Black",
  extrabold: "Inter_800ExtraBold",
  bold: "Inter_700Bold",
  semibold: "Inter_600SemiBold",
  medium: "Inter_500Medium",
  regular: "Inter_400Regular",
  quoteItalic: "CormorantGaramond_400Regular_Italic",
  quoteItalicLight: "CormorantGaramond_300Light_Italic",
} as const;

export const AMS = {
  black: "#0A0A0A",
  black2: "#111111",
  red: "#D9121F",
  redHover: "#B00E19",
  blackHover: "#222222",
  chrome: "#C9CDD2",
  surface: "#F5F6F7",
  card: "#FFFFFF",
  ink: "#111111",
  onDarkBody: "rgba(255,255,255,0.74)",
  onDarkSecondary: "rgba(255,255,255,0.5)",
  onLightBody: "rgba(0,0,0,0.68)",
  onLightLabel: "rgba(0,0,0,0.5)",
  hairlineOnDark: "rgba(255,255,255,0.12)",
  hairlineOnLight: "rgba(0,0,0,0.09)",
  barEmpty: "#EDEFF1",
} as const;
