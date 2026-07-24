import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, Switch, ViewStyle, TextStyle, Animated, Platform, type KeyboardTypeOptions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./theme";

// Full-height screen wrapper that applies the background color and a max-width on web.
export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        { flex: 1, backgroundColor: tokens.color.surfaceSoft },
        Platform.OS === "web" && { width: "100%", maxWidth: 430, marginHorizontal: "auto" },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Horizontal padding wrapper used to align content within a Screen.
export function Container({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return <View style={[{ paddingHorizontal: tokens.space.xl }, style]}>{children}</View>;
}

// Standard header for every admin sub-screen: back chevron, centered title, and an optional right-side slot (defaults to a spacer so the title stays centered).
export function AdminHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: React.ReactNode }) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: Math.max(insets.top, 20) + 8, paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline, backgroundColor: tokens.color.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Pressable onPress={onBack} accessibilityRole="button" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="chevron-back" size={22} color={tokens.color.ink} />
      </Pressable>
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16 }}>{title}</Text>
      {right ?? <View style={{ width: 44 }} />}
    </View>
  );
}

// Bordered surface card, the default container for list items and content blocks.
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return (
    <View style={[{ backgroundColor: tokens.color.surface, borderColor: tokens.color.hairline, borderWidth: 1, borderRadius: tokens.radius.lg, padding: tokens.space.md }, style]}>
      {children}
    </View>
  );
}

// Muted-background card variant used for hero/callout sections.
export function SoftCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return (
    <View style={[{ backgroundColor: tokens.color.surfaceSoft, borderColor: tokens.color.hairline, borderWidth: 1, borderRadius: tokens.radius.xl, padding: tokens.space.lg }, style]}>
      {children}
    </View>
  );
}

// Thin horizontal rule using the theme's hairline color.
export function Divider({ style }: { style?: ViewStyle }) {
  const { tokens } = useTheme();
  return <View style={[{ height: 1, backgroundColor: tokens.color.hairline }, style]} />;
}

// Secondary/low-emphasis text styled with the theme's muted color.
export function Muted({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { tokens } = useTheme();
  return <Text style={[{ color: tokens.color.muted, fontSize: tokens.font.body, lineHeight: 20 }, style]}>{children}</Text>;
}

type BtnProps = { label: string; onPress: () => void; style?: ViewStyle; disabled?: boolean };

// Filled accent-colored button used for the primary action on a screen.
export function PrimaryButton({ label, onPress, style, disabled }: BtnProps) {
  const { tokens } = useTheme();
  return (
    <Pressable onPress={disabled ? undefined : onPress} accessibilityRole="button"
      style={({ pressed }) => [{ backgroundColor: disabled ? tokens.color.muted : tokens.color.accent, paddingVertical: 12, borderRadius: tokens.radius.pill, alignItems: "center", opacity: disabled ? 0.45 : pressed ? 0.88 : 1 }, style]}>
      <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

// Outlined low-emphasis button used for secondary actions.
export function GhostButton({ label, onPress, style, disabled }: BtnProps) {
  const { tokens } = useTheme();
  return (
    <Pressable onPress={disabled ? undefined : onPress} accessibilityRole="button"
      style={({ pressed }) => [{ backgroundColor: tokens.color.surface, paddingVertical: 12, borderRadius: tokens.radius.pill, borderWidth: 1, borderColor: tokens.color.hairline, alignItems: "center", opacity: disabled ? 0.45 : pressed ? 0.88 : 1 }, style]}>
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

// Selectable pill/chip used for filters such as service categories.
export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const { tokens } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button"
      style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: tokens.radius.pill, backgroundColor: active ? tokens.color.accentSoft : tokens.color.surface, borderWidth: 1, borderColor: active ? `${tokens.color.accent}88` : tokens.color.hairline }}>
      <Text style={{ color: active ? tokens.color.ink : tokens.color.muted, fontWeight: "900", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

// Small colored badge used to show an appointment/quote status.
export function StatusBadge({ label, color }: { label: string; color: "green" | "amber" | "red" | "muted" }) {
  const map = {
    green: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)", text: "#16a34a" },
    amber: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", text: "#d97706" },
    red:   { bg: "rgba(255,0,0,0.10)",   border: "rgba(255,0,0,0.30)",   text: "#dc2626" },
    muted: { bg: "rgba(107,107,112,0.10)", border: "rgba(107,107,112,0.25)", text: "#6b7280" },
  };
  const c = map[color];
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: c.bg, borderWidth: 1, borderColor: c.border }}>
      <Text style={{ color: c.text, fontWeight: "800", fontSize: 11 }}>{label}</Text>
    </View>
  );
}

type FormFieldProps = {
  value: string; onChangeText: (v: string) => void; label: string; placeholder?: string;
  secure?: boolean; keyboardType?: KeyboardTypeOptions; multiline?: boolean; style?: ViewStyle;
};

// Labeled text input used across admin create/edit forms (services, gallery, tenant settings).
export function FormField({ value, onChangeText, label, placeholder, secure, keyboardType, multiline, style }: FormFieldProps) {
  const { tokens } = useTheme();
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={tokens.color.muted}
        secureTextEntry={secure} keyboardType={keyboardType} autoCapitalize="none" multiline={multiline}
        style={{ borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: tokens.color.ink, fontWeight: "700", minHeight: multiline ? 80 : undefined, textAlignVertical: multiline ? "top" : "center" }} />
    </View>
  );
}

// Labeled switch row used for boolean fields in admin forms (e.g. service "active").
export function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  const { tokens } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text style={{ color: tokens.color.ink, fontWeight: "800", fontSize: 13 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: tokens.color.accent }} />
    </View>
  );
}

// Wraps children in a fade + upward-slide entrance animation.
export function FadeSlideIn({ children, delay = 0, style, distance = 18 }: { children: React.ReactNode; delay?: number; style?: ViewStyle; distance?: number }) {
  const [anim] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 380, delay, useNativeDriver: true }).start();
  }, [anim, delay]);
  return (
    <Animated.View style={[{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}
