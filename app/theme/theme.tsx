import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTokens, ThemeMode, Tokens } from "./tokens";
import { getPref, setPref } from "@/app/lib/storage";

type Ctx = { mode: ThemeMode; setMode: (m: ThemeMode) => void; toggle: () => void; tokens: Tokens };
const ThemeContext = createContext<Ctx | null>(null);
const PREF = "crx.theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  useEffect(() => {
    getPref(PREF).then((v) => { if (v === "dark" || v === "light") setModeState(v); });
  }, []);
  const setMode = (m: ThemeMode) => { setModeState(m); setPref(PREF, m); };
  const tokens = useMemo(() => createTokens(mode), [mode]);
  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle: () => setMode(mode === "dark" ? "light" : "dark"), tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}
