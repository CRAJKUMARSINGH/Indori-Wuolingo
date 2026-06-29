import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  progress: number;
  color?: string;
  height?: number;
  backgroundColor?: string;
}

export function ProgressBar({ progress, color, height = 8, backgroundColor }: Props) {
  const colors = useColors();
  const fill = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: backgroundColor ?? colors.muted,
          borderRadius: height / 2,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${fill * 100}%` as `${number}%`,
            backgroundColor: color ?? colors.primary,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
