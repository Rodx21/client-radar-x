import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack, router } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Modal" }} />
      <Text style={styles.title}>Modal</Text>
      <Text style={styles.subtitle}>
        This screen is a safe placeholder (no @/ imports). Replace it later if you want.
      </Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center", gap: 12, backgroundColor: "#FFFFFF" },
  title: { fontSize: 22, fontWeight: "700", color: "#0B0B0D" },
  subtitle: { fontSize: 14, opacity: 0.7, textAlign: "center", color: "#6B6B70" },
  button: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: "#DB0708" },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
});
