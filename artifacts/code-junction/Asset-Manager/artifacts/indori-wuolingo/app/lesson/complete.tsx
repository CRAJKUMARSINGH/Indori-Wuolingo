import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BADGES } from "@/data/curriculum";
import { useColors } from "@/hooks/useColors";

export default function LessonCompleteScreen() {
  const { xpEarned, hearts, newBadges } = useLocalSearchParams<{
    lessonId: string;
    xpEarned: string;
    hearts: string;
    newBadges: string;
  }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const xp = parseInt(xpEarned ?? "0", 10);
  const heartCount = parseInt(hearts ?? "3", 10);
  const earnedBadges: string[] = JSON.parse(newBadges ?? "[]");
  const badgeDetails = earnedBadges
    .map((id) => BADGES.find((b) => b.id === id))
    .filter(Boolean) as typeof BADGES;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)/learn");
  };

  const stars = heartCount === 3 ? 3 : heartCount === 2 ? 2 : 1;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: topPad + 20,
          paddingBottom: bottomPad + 20,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.trophyCircle, { backgroundColor: colors.accent + "20" }]}>
          <Text style={styles.trophyEmoji}>
            {stars === 3 ? "🏆" : stars === 2 ? "🥈" : "🥉"}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {stars === 3 ? "Perfect!" : stars === 2 ? "Well done!" : "Lesson complete!"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Keep going to build your streak
        </Text>

        <View style={styles.starsRow}>
          {[1, 2, 3].map((i) => (
            <Feather
              key={i}
              name="star"
              size={32}
              color={i <= stars ? colors.accent : colors.border}
            />
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.xp + "15" }]}>
            <Feather name="star" size={22} color={colors.xp} />
            <Text style={[styles.statValue, { color: colors.xp }]}>+{xp}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>XP earned</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.destructive + "12" }]}>
            <Feather name="heart" size={22} color={colors.destructive} />
            <Text style={[styles.statValue, { color: colors.destructive }]}>{heartCount}/3</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Hearts left</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.success + "15" }]}>
            <Feather name="check-circle" size={22} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.success }]}>Done</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Lesson</Text>
          </View>
        </View>

        {badgeDetails.length > 0 && (
          <View style={[styles.badgeSection, { backgroundColor: colors.accent + "15", borderColor: colors.accent + "40" }]}>
            <Text style={[styles.badgeSectionTitle, { color: colors.text }]}>
              New badge{badgeDetails.length > 1 ? "s" : ""} unlocked!
            </Text>
            {badgeDetails.map((badge) => (
              <View key={badge.id} style={styles.badgeRow}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.accent }]}>
                  <Feather name={badge.icon as any} size={16} color="#fff" />
                </View>
                <View>
                  <Text style={[styles.badgeName, { color: colors.text }]}>{badge.title}</Text>
                  <Text style={[styles.badgeDesc, { color: colors.mutedForeground }]}>{badge.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.continueBtnText, { color: colors.primaryForeground }]}>
            Continue
          </Text>
          <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 24, paddingTop: 20, gap: 20 },
  trophyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  trophyEmoji: { fontSize: 56 },
  title: { fontSize: 32, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center", marginTop: -8 },
  starsRow: { flexDirection: "row", gap: 12 },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 11, textAlign: "center" },
  badgeSection: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  badgeSectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  badgeIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  badgeName: { fontSize: 14, fontWeight: "600" },
  badgeDesc: { fontSize: 12 },
  footer: { paddingHorizontal: 24, paddingTop: 8 },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 28,
  },
  continueBtnText: { fontSize: 17, fontWeight: "700" },
});
