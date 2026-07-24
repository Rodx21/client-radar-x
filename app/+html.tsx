import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// This file is web-only. It configures the root HTML document for every
// web page during static rendering. It runs in Node.js and has no access
// to the DOM or browser APIs.
// Root HTML document used only for static web rendering.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* Matches CLIENT.colors.accent in config/client.ts */}
        <meta name="theme-color" content="#FF0000" />
        <title>Auto Music Sound e Film</title>

        {/* Disable body scrolling on web so ScrollView behaves like native */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0B0B0D;
  }
}`;
