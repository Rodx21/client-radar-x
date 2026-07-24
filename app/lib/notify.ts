import { Alert, Platform } from "react-native";

// Cross-platform alert dialog (native Alert on mobile, window.alert on web).
export function notify(title: string, message: string, onDismiss?: () => void) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    onDismiss?.();
  } else {
    Alert.alert(title, message, onDismiss ? [{ text: "OK", onPress: onDismiss }] : undefined);
  }
}
