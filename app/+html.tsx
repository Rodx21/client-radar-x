import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";
import { CLIENT } from "@/config/client";
import { AMS } from "@/app/theme/brand";

// Root HTML document for static web rendering only; runs in Node.js, no DOM/browser APIs available.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* Derived from CLIENT.colors.accent so it can never drift out of sync with the brand color again. */}
        <meta name="theme-color" content={CLIENT.colors.accent} />
        <title>Auto Music Sound e Film</title>

        {/* Disable body scrolling on web so ScrollView behaves like native */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground(AMS.black) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Pre-hydration background: white in light mode, the brand's dark surface in dark mode.
function responsiveBackground(darkBg: string) {
  return `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: ${darkBg};
  }
}`;
}
