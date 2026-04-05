import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTokens, ThemeMode, Tokens } from "./tokens";
import { getPref, setPref } from "../storage/prefs";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
  tokens: Tokens;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const PREF_THEME = "clientradarx.theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    (async () => {
      const saved = await getPref(PREF_THEME);
      if (saved === "dark" || saved === "light") setModeState(saved);
    })();
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    setPref(PREF_THEME, m);
  };

  const toggle = () => setMode(mode === "dark" ? "light" : "dark");

  const tokens = useMemo(() => createTokens(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
