import { Platform, useWindowDimensions } from "react-native";

// Viewport width, in px, above which the web app switches from the phone-shaped
// mobile layout to a desktop layout. Native (iOS/Android) always stays mobile.
export const DESKTOP_BREAKPOINT = 900;

// Reports whether the current viewport should use the desktop layout.
export function useResponsive() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
  return { isDesktop, width };
}
