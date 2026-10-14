import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTokens, ThemeMode, Tokens } from "./tokens";
import { getPref, setPref } from "@/app/lib/storage";

export type ThemeCtx = { mode: ThemeMode; setMode: (m: ThemeMode) => void; toggle: () => void; tokens: Tokens };
// Exported so admin routes can override it with a fixed palette (see adminTokens.ts) —
// the design system's own rule is "público escuro, operação clara": admin isn't meant
// to follow the customer app's user-toggleable light/dark preference at all.
export const ThemeContext = createContext<ThemeCtx | null>(null);
const PREF = "crx.theme";

// Provides the current theme mode and tokens to the app, persisting the choice locally.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  useEffect(() => {
    getPref(PREF).then((v) => { if (v === "dark" || v === "light") setModeState(v); });
  }, []);
  // Updates the active mode in state and saves it as a local preference.
  const setMode = (m: ThemeMode) => { setModeState(m); setPref(PREF, m); };
  const tokens = useMemo(() => createTokens(mode), [mode]);
  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle: () => setMode(mode === "dark" ? "light" : "dark"), tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook for consuming the current theme mode, tokens, and mode setters.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}
