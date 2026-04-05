import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import ptBR from "./ptBR";
import enUS from "./enUS";
import { getPref, setPref } from "../storage/prefs";

export type Language = "pt-BR" | "en-US";

type Dict = Record<string, any>;

type I18nCtx = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

const PREF_LANG = "clientradarx.lang";

function getByPath(obj: Dict, path: string): any {
  return path.split(".").reduce((acc: any, part) => (acc && acc[part] != null ? acc[part] : null), obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("pt-BR");

  useEffect(() => {
    (async () => {
      const saved = await getPref(PREF_LANG);
      if (saved === "pt-BR" || saved === "en-US") setLangState(saved);
    })();
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    setPref(PREF_LANG, l);
  };

  const dict = useMemo(() => (lang === "en-US" ? enUS : ptBR), [lang]);

  const t = (key: string) => {
    const v = getByPath(dict, key);
    if (typeof v === "string") return v;
    return key;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside I18nProvider");
  return ctx;
}
