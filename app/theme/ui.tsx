import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ViewStyle, TextStyle, Animated } from "react-native";
import { useTheme } from "./theme";

// ─── Layout primitives ───────────────────────────────────────────────────────

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return <View style={[{ flex: 1, backgroundColor: tokens.color.surfaceSoft }, style]}>{children}</View>;
}

export function Container({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return <View style={[{ paddingHorizontal: tokens.space.xl }, style]}>{children}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tokens.color.surface,
          borderColor: tokens.color.hairline,
          borderWidth: 1,
          borderRadius: tokens.radius.lg,
          padding: tokens.space.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SoftCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tokens.color.surfaceSoft,
          borderColor: tokens.color.hairline,
          borderWidth: 1,
          borderRadius: tokens.radius.xl,
          padding: tokens.space.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  const { tokens } = useTheme();
  return <View style={[{ height: 1, backgroundColor: tokens.color.hairline }, style]} />;
}

// ─── Typography ───────────────────────────────────────────────────────────────

export function Title({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { tokens } = useTheme();
  return (
    <Text style={[{ color: tokens.color.ink, fontSize: tokens.font.h2, fontWeight: "900", letterSpacing: -0.15 }, style]}>
      {children}
    </Text>
  );
}

export function Muted({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { tokens } = useTheme();
  return (
    <Text style={[{ color: tokens.color.muted, fontSize: tokens.font.body, lineHeight: 20 }, style]}>
      {children}
    </Text>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

type ButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, style, disabled }: ButtonProps) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          backgroundColor: disabled ? tokens.color.muted : tokens.color.accent,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: tokens.radius.pill,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          transform: [{ translateY: pressed && !disabled ? 1 : 0 }],
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, style, disabled }: ButtonProps) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          backgroundColor: tokens.color.surface,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: tokens.radius.pill,
          borderColor: tokens.color.hairline,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          transform: [{ translateY: pressed && !disabled ? 1 : 0 }],
        },
        style,
      ]}
      accessibilityRole="button"
    >
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, style, disabled }: ButtonProps) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          backgroundColor: tokens.color.surface,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: tokens.radius.pill,
          borderColor: tokens.color.hairline,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          transform: [{ translateY: pressed && !disabled ? 1 : 0 }],
        },
        style,
      ]}
      accessibilityRole="button"
    >
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>{label}</Text>
    </Pressable>
  );
}

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: tokens.radius.pill,
          backgroundColor: active ? tokens.color.accentSoft : tokens.color.surface,
          borderWidth: 1,
          borderColor: active ? "rgba(255, 0, 0, 0.55)" : tokens.color.hairline,
          transform: [{ translateY: pressed ? 1 : 0 }],
        },
      ]}
      accessibilityRole="button"
    >
      <Text style={{ color: active ? tokens.color.ink : tokens.color.muted, fontWeight: "900", fontSize: 13, letterSpacing: -0.1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Animation ───────────────────────────────────────────────────────────────

/**
 * Wraps children in a fade + slide-up entrance animation.
 * Use `delay` to stagger multiple items.
 */
export function FadeSlideIn({
  children,
  delay = 0,
  style,
  distance = 18,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
  distance?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 380,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export function StatusBadge({ label, color }: { label: string; color: "green" | "amber" | "red" | "muted" }) {
  const colorMap = {
    green: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)", text: "#16a34a" },
    amber: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", text: "#d97706" },
    red: { bg: "rgba(255,0,0,0.10)", border: "rgba(255,0,0,0.30)", text: "#dc2626" },
    muted: { bg: "rgba(107,107,112,0.10)", border: "rgba(107,107,112,0.25)", text: "#6b7280" },
  };
  const c = colorMap[color];
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: c.bg, borderWidth: 1, borderColor: c.border }}>
      <Text style={{ color: c.text, fontWeight: "800", fontSize: 11 }}>{label}</Text>
    </View>
  );
}
