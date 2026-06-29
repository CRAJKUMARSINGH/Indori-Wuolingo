import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BadgeCard } from "@/components/BadgeCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StreakBadge } from "@/components/StreakBadge";
import { XPDisplay } from "@/components/XPDisplay";
import { useUser } from "@/context/UserContext";
import { useProgress } from "@/context/ProgressContext";
import { BADGES, getAllLessons } from "@/data/curriculum";
import { useColors } from "@/hooks/useColors";

const LEVEL_THRESHOLDS = [0, 50, 120, 250, 450, 700, 1000];

function getLevel(xp: number): { level: number; nextXp: number; prevXp: number } {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  const prevXp = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextXp = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return { level, nextXp, prevXp };
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useUser();
  const { progress } = useProgress();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  const allLessons = getAllLessons();
  const completedCount = progress.completedLessons.length;
  const { level, nextXp, prevXp } = getLevel(progress.xp);
  const levelProgress = (progress.xp - prevXp) / Math.max(1, nextXp - prevXp);

  const stats = [
    { label: "Lessons", value: completedCount, icon: "book", color: colors.primary },
    { label: "Streak", value: progress.streak, icon: "zap", color: colors.streak },
    { label: "Minutes", value: progress.totalMinutesStudied, icon: "clock", color: colors.secondary },
    { label: "Badges", value: progress.earnedBadges.length, icon: "award", color: colors.accent },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad + 16, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={styles.heroName}>{profile.name || "Learner"}</Text>
          <Text style={styles.heroSub}>English → Hindi</Text>
          <View style={styles.heroBadges}>
            <StreakBadge count={progress.streak} size="md" />
            <XPDisplay xp={progress.xp} size="md" />
          </View>
        </View>

        <View style={[styles.levelCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.levelRow}>
            <View style={[styles.levelBadge, { backgroundColor: colors.accent + "25" }]}>
              <Text style={[styles.levelNumber, { color: colors.accent }]}>{level}</Text>
            </View>
            <View style={styles.levelMeta}>
              <View style={styles.levelLabelRow}>
                <Text style={[styles.levelLabel, { color: colors.text }]}>Level {level}</Text>
                <Text style={[styles.levelXpText, { color: colors.mutedForeground }]}>
                  {progress.xp} / {nextXp} XP
                </Text>
              </View>
              <ProgressBar
                progress={levelProgress}
                color={colors.accent}
                height={8}
              />
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View
              key={s.label}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.statIcon, { backgroundColor: s.color + "18" }]}>
                <Feather name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
        <View style={styles.badgesGrid}>
          {BADGES.map((badge) => (
            <BadgeCard
              key={badge.id}
              title={badge.title}
              description={badge.description}
              icon={badge.icon}
              earned={progress.earnedBadges.includes(badge.id as any)}
            />
          ))}
        </View>

        <View style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="target" size={20} color={colors.primary} />
          <View style={styles.goalMeta}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>Daily Goal</Text>
            <Text style={[styles.goalSub, { color: colors.mutedForeground }]}>
              {profile.dailyGoalMinutes} minutes per day
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 16 },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  heroName: { fontSize: 22, fontWeight: "800", color: "#fff" },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 4 },
  heroBadges: { flexDirection: "row", gap: 8 },
  levelCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  levelBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: { fontSize: 22, fontWeight: "800" },
  levelMeta: { flex: 1, gap: 8 },
  levelLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  levelLabel: { fontSize: 15, fontWeight: "700" },
  levelXpText: { fontSize: 13 },
  statsGrid: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 11 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  badgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  goalMeta: { gap: 2 },
  goalTitle: { fontSize: 15, fontWeight: "600" },
  goalSub: { fontSize: 13 },
});
