import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  count: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ count, size = "md" }: Props) {
  const colors = useColors();
  const iconSize = size === "sm" ? 14 : size === "lg" ? 24 : 18;
  const fontSize = size === "sm" ? 12 : size === "lg" ? 20 : 15;

  return (
    <View style={[styles.container, { backgroundColor: colors.streak + "18" }]}>
      <Feather name="zap" size={iconSize} color={colors.streak} />
      <Text style={[styles.text, { color: colors.streak, fontSize }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  text: {
    fontWeight: "700",
  },
});
