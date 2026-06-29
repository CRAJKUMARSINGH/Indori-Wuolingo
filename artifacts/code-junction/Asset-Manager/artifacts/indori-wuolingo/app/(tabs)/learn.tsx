import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StreakBadge } from "@/components/StreakBadge";
import { XPDisplay } from "@/components/XPDisplay";
import { ProgressBar } from "@/components/ProgressBar";
import { useUser } from "@/context/UserContext";
import { useProgress } from "@/context/ProgressContext";
import { curriculum } from "@/data/curriculum";
import { useColors } from "@/hooks/useColors";
import colors from "@/constants/colors";

const UNIT_COLORS: Record<string, string> = {
  unit1: colors.light.unit1,
  unit2: colors.light.unit2,
  unit3: colors.light.unit3,
  unit4: colors.light.unit4,
};

export default function LearnScreen() {
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useUser();
  const { progress, isLessonComplete, isLessonAvailable, getUnitProgress } = useProgress();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  const handleLessonPress = (lessonId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: appColors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: appColors.background }]}>
        <View>
          <Text style={[styles.greeting, { color: appColors.mutedForeground }]}>
            Namaste{profile.name ? `, ${profile.name}` : ""}!
          </Text>
          <Text style={[styles.headerTitle, { color: appColors.text }]}>Keep learning</Text>
        </View>
        <View style={styles.headerBadges}>
          <StreakBadge count={progress.streak} />
          <XPDisplay xp={progress.xp} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {curriculum.map((unit, unitIdx) => {
          const unitColor = UNIT_COLORS[unit.colorKey] ?? appColors.primary;
          const unitProgress = getUnitProgress(unit.id);

          return (
            <View key={unit.id} style={styles.unitSection}>
              <View style={[styles.unitHeader, { backgroundColor: unitColor }]}>
                <View>
                  <Text style={styles.unitTitleHindi}>{unit.titleHindi}</Text>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitDesc}>{unit.description}</Text>
                </View>
                <View style={styles.unitProgressSide}>
                  <Text style={styles.unitProgressLabel}>
                    {Math.round(unitProgress * 100)}%
                  </Text>
                  <ProgressBar
                    progress={unitProgress}
                    color="rgba(255,255,255,0.9)"
                    backgroundColor="rgba(255,255,255,0.3)"
                    height={6}
                  />
                </View>
              </View>

              <View style={styles.lessonsContainer}>
                {unit.lessons.map((lesson, lessonIdx) => {
                  const complete = isLessonComplete(lesson.id);
                  const available = isLessonAvailable(lesson.id);
                  const isCurrent = available && !complete;

                  return (
                    <View key={lesson.id} style={styles.lessonRow}>
                      {lessonIdx > 0 && (
                        <View
                          style={[
                            styles.connector,
                            { backgroundColor: complete ? unitColor + "60" : appColors.border },
                          ]}
                        />
                      )}
                      <Pressable
                        onPress={() => available && handleLessonPress(lesson.id)}
                        style={({ pressed }) => [
                          styles.lessonNodeWrapper,
                          { opacity: pressed && available ? 0.8 : 1 },
                        ]}
                      >
                        <View
                          style={[
                            styles.lessonNode,
                            {
                              backgroundColor: complete
                                ? unitColor
                                : isCurrent
                                ? appColors.card
                                : appColors.lockedBg,
                              borderColor: complete
                                ? unitColor
                                : isCurrent
                                ? unitColor
                                : appColors.border,
                              borderWidth: isCurrent ? 3 : 1,
                              shadowColor: isCurrent ? unitColor : "transparent",
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: isCurrent ? 0.35 : 0,
                              shadowRadius: 8,
                              elevation: isCurrent ? 4 : 0,
                            },
                          ]}
                        >
                          {complete ? (
                            <Feather name="check" size={28} color="#fff" />
                          ) : available ? (
                            <Text style={[styles.nodeNumber, { color: unitColor }]}>
                              {lessonIdx + 1 + unitIdx * 10}
                            </Text>
                          ) : (
                            <Feather name="lock" size={22} color={appColors.locked} />
                          )}
                        </View>

                        <View style={styles.lessonMeta}>
                          <Text
                            style={[
                              styles.lessonTitle,
                              {
                                color: available ? appColors.text : appColors.mutedForeground,
                                fontWeight: isCurrent ? "700" : "600",
                              },
                            ]}
                          >
                            {lesson.title}
                          </Text>
                          <Text style={[styles.lessonSubtitle, { color: appColors.mutedForeground }]}>
                            {lesson.subtitle}
                          </Text>
                          <View style={styles.xpChip}>
                            <Feather name="star" size={11} color={appColors.xp} />
                            <Text style={[styles.xpChipText, { color: appColors.xp }]}>
                              +{lesson.xpReward} XP
                            </Text>
                          </View>
                        </View>

                        {isCurrent && (
                          <View style={[styles.startBtn, { backgroundColor: unitColor }]}>
                            <Text style={styles.startBtnText}>Start</Text>
                          </View>
                        )}
                        {complete && (
                          <Feather name="check-circle" size={20} color={unitColor} />
                        )}
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={[styles.completedBanner, { backgroundColor: appColors.muted }]}>
          <Feather name="award" size={24} color={appColors.accent} />
          <Text style={[styles.completedText, { color: appColors.mutedForeground }]}>
            More units coming soon!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: "800" },
  headerBadges: { flexDirection: "row", gap: 8, alignItems: "center" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 24 },
  unitSection: { gap: 0 },
  unitHeader: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  unitTitleHindi: { color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: "600", marginBottom: 2 },
  unitTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 2 },
  unitDesc: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  unitProgressSide: { width: 80, gap: 4, alignItems: "flex-end" },
  unitProgressLabel: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "600" },
  lessonsContainer: { paddingHorizontal: 4, gap: 0 },
  lessonRow: { alignItems: "center" },
  connector: { width: 3, height: 20, marginLeft: 28 },
  lessonNodeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 6,
    width: "100%",
  },
  lessonNode: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeNumber: { fontSize: 22, fontWeight: "800" },
  lessonMeta: { flex: 1, gap: 2 },
  lessonTitle: { fontSize: 15 },
  lessonSubtitle: { fontSize: 12 },
  xpChip: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  xpChipText: { fontSize: 11, fontWeight: "600" },
  startBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  completedBanner: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  completedText: { fontSize: 15, fontWeight: "500" },
});
