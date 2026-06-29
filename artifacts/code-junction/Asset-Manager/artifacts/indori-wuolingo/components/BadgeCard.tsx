import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

export function BadgeCard({ title, description, icon, earned }: Props) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: earned ? colors.accent + "20" : colors.muted,
          borderColor: earned ? colors.accent : colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: earned ? colors.accent : colors.lockedBg,
          },
        ]}
      >
        <Feather
          name={icon as any}
          size={20}
          color={earned ? colors.accentForeground : colors.locked}
        />
      </View>
      <Text style={[styles.title, { color: earned ? colors.text : colors.mutedForeground }]}>
        {title}
      </Text>
      <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "47%",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },
  desc: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
  },
});
