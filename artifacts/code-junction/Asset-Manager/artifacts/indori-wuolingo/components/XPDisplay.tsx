import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  xp: number;
  size?: "sm" | "md" | "lg";
}

export function XPDisplay({ xp, size = "md" }: Props) {
  const colors = useColors();
  const iconSize = size === "sm" ? 14 : size === "lg" ? 24 : 18;
  const fontSize = size === "sm" ? 12 : size === "lg" ? 20 : 15;

  return (
    <View style={[styles.container, { backgroundColor: colors.xp + "18" }]}>
      <Feather name="star" size={iconSize} color={colors.xp} />
      <Text style={[styles.text, { color: colors.xp, fontSize }]}>{xp} XP</Text>
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
