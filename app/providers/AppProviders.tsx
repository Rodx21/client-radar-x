import React from "react";
import { ThemeProvider } from "../theme/theme";
import { I18nProvider } from "../i18n";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
