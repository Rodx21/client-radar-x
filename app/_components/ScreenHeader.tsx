import React from "react";
import { View, Text, Pressable, Image, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/theme";

export function ScreenHeader({
  title,
  onMenu,
  onRight,
  rightLabel,
  brandLogo,
}: {
  title?: string;
  onMenu?: () => void;
  onRight?: () => void;
  rightLabel?: string;
  brandLogo?: ImageSourcePropType;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: tokens.space.xl,
        paddingTop: Math.max(insets.top, tokens.space.md) + tokens.space.sm,
        paddingBottom: tokens.space.md,
        borderBottomWidth: 1,
        borderBottomColor: tokens.color.hairline,
        backgroundColor: tokens.color.surface,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ width: 44 }}>
          {onMenu ? (
            <Pressable
              onPress={onMenu}
              style={({ pressed }) => [
                {
                  width: 44,
                  height: 44,
                  borderRadius: tokens.radius.lg,
                  borderWidth: 1,
                  borderColor: tokens.color.hairline,
                  backgroundColor: tokens.color.surfaceSoft,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ translateY: pressed ? 1 : 0 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
            >
              <Ionicons name="menu-outline" size={20} color={tokens.color.ink} />
            </Pressable>
          ) : null}
        </View>

        {/* Center: brand logo OR title */}
        <View style={{ flex: 1, alignItems: "center" }}>
          {brandLogo ? (
            <Image source={brandLogo} style={{ width: 120, height: 38, resizeMode: "contain" }} />
          ) : (
            <Text style={{ color: tokens.color.ink, fontSize: tokens.font.title, fontWeight: "900", letterSpacing: -0.15 }}>
              {title ?? ""}
            </Text>
          )}
        </View>

        <View style={{ width: 44, alignItems: "flex-end" }}>
          {onRight ? (
            <Pressable
              onPress={onRight}
              style={({ pressed }) => [
                {
                  width: 44,
                  height: 44,
                  borderRadius: tokens.radius.lg,
                  borderWidth: 1,
                  borderColor: tokens.color.hairline,
                  backgroundColor: tokens.color.surfaceSoft,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [{ translateY: pressed ? 1 : 0 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={rightLabel ?? "Configurações"}
            >
              <Ionicons name="settings-outline" size={20} color={tokens.color.accent} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
