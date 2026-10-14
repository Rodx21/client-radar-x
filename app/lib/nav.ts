import type { useRouter } from "expo-router";

type Router = ReturnType<typeof useRouter>;

// Goes back if there's history to go back to, otherwise replaces with a
// fallback route — a screen opened directly (deep link, refresh, or a fresh
// tab) has no back stack, so router.back() alone would be a no-op/crash.
// Centralizes a pattern that was duplicated across every admin screen, some
// of it as a bare ternary statement that ESLint flagged (no-unused-expressions).
export function goBackOr(router: Router, fallback: Parameters<Router["replace"]>[0]) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
