import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/context/ProgressContext";
import { getLessonById } from "@/data/curriculum";
import { useColors } from "@/hooks/useColors";
import { useSpeech } from "@/hooks/useSpeech";
import type { Exercise } from "@/data/curriculum";

function getHindiToSpeak(exercise: Exercise): string {
  if (exercise.type === "translate_mc") {
    const match = exercise.question.match(/does (.+?) mean\??/);
    return match ? match[1] : "";
  }
  return exercise.correct;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeLesson } = useProgress();
  const { speak, isSpeaking } = useSpeech();

  const result = getLessonById(id ?? "");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, number>>({});
  const [hearts, setHearts] = useState(3);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <Text style={{ color: colors.text, padding: 24 }}>Lesson not found.</Text>
      </View>
    );
  }

  const { lesson, unit } = result;
  const unitColor = {
    unit1: "#FF6B35", unit2: "#138808", unit3: "#8A4FFF", unit4: "#FFB830",
  }[unit.colorKey] ?? colors.primary;

  const exercises: Exercise[] = lesson.exercises;
  const currentExercise = exercises[exerciseIdx];
  const progress = exerciseIdx / exercises.length;
  const hindiText = getHindiToSpeak(currentExercise);
  const isHindi = currentExercise.type === "en_to_hi_mc" || currentExercise.type === "script_mc";

  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === currentExercise.correct;
    if (isHindi) speak(option);
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeCard();
      setHearts((h) => Math.max(0, h - 1));
      setErrors((prev) => ({
        ...prev,
        [currentExercise.id]: (prev[currentExercise.id] ?? 0) + 1,
      }));
    }
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (exerciseIdx < exercises.length - 1) {
      setExerciseIdx((i) => i + 1);
      setSelected(null);
    } else {
      const newBadges = await completeLesson(lesson.id, lesson.xpReward, errors);
      router.replace({
        pathname: "/lesson/complete",
        params: {
          lessonId: lesson.id,
          xpEarned: lesson.xpReward,
          hearts,
          newBadges: JSON.stringify(newBadges),
        },
      });
    }
  };

  const handleSpeak = () => {
    if (hindiText) speak(hindiText);
  };

  const isCorrect = selected === currentExercise.correct;

  const optionBg = (opt: string) => {
    if (!selected) return colors.card;
    if (opt === selected && isCorrect) return colors.success + "20";
    if (opt === selected && !isCorrect) return colors.destructive + "15";
    if (opt === currentExercise.correct && selected) return colors.success + "15";
    return colors.card;
  };

  const optionBorder = (opt: string) => {
    if (!selected) return colors.border;
    if (opt === selected && isCorrect) return colors.success;
    if (opt === selected && !isCorrect) return colors.destructive;
    if (opt === currentExercise.correct && selected) return colors.success;
    return colors.border;
  };

  const optionTextColor = (opt: string) => {
    if (!selected) return colors.text;
    if (opt === selected && isCorrect) return colors.success;
    if (opt === selected && !isCorrect) return colors.destructive;
    if (opt === currentExercise.correct && selected) return colors.success;
    return colors.mutedForeground;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: colors.muted }]}
        >
          <Feather name="x" size={18} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} color={unitColor} height={10} />
        </View>
        <View style={styles.heartsRow}>
          {[1, 2, 3].map((i) => (
            <Feather
              key={i}
              name="heart"
              size={18}
              color={i <= hearts ? colors.destructive : colors.border}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionSection}>
          <Text style={[styles.stepIndicator, { color: colors.mutedForeground }]}>
            {exerciseIdx + 1} of {exercises.length}
          </Text>
          <Text style={[styles.instruction, { color: colors.mutedForeground }]}>
            {currentExercise.type === "translate_mc"
              ? "What does this mean?"
              : currentExercise.type === "en_to_hi_mc"
              ? "Choose the correct Hindi"
              : "Select the correct script"}
          </Text>

          <Animated.View
            style={[
              styles.questionCard,
              {
                backgroundColor: unitColor + "12",
                borderColor: unitColor + "40",
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            <Text style={[styles.questionText, { color: unitColor }]}>
              {currentExercise.question}
            </Text>

            {hindiText ? (
              <Pressable
                onPress={handleSpeak}
                style={[
                  styles.speakBtn,
                  {
                    backgroundColor: isSpeaking ? unitColor : unitColor + "20",
                    borderColor: unitColor + "50",
                  },
                ]}
              >
                <Feather
                  name={isSpeaking ? "volume-2" : "volume-1"}
                  size={16}
                  color={isSpeaking ? "#fff" : unitColor}
                />
                <Text style={[styles.speakBtnText, { color: isSpeaking ? "#fff" : unitColor }]}>
                  {isSpeaking ? "Playing…" : "Hear it"}
                </Text>
              </Pressable>
            ) : null}

            {currentExercise.hint && selected && (
              <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
                💡 {currentExercise.hint}
              </Text>
            )}
          </Animated.View>
        </View>

        <View style={styles.optionsContainer}>
          {currentExercise.options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => handleSelect(opt)}
              style={({ pressed }) => [
                styles.optionBtn,
                {
                  backgroundColor: optionBg(opt),
                  borderColor: optionBorder(opt),
                  opacity: pressed && !selected ? 0.85 : 1,
                },
              ]}
            >
              {selected && opt === currentExercise.correct && (
                <View style={[styles.statusIcon, { backgroundColor: colors.success }]}>
                  <Feather name="check" size={13} color="#fff" />
                </View>
              )}
              {selected && opt === selected && !isCorrect && (
                <View style={[styles.statusIcon, { backgroundColor: colors.destructive }]}>
                  <Feather name="x" size={13} color="#fff" />
                </View>
              )}
              <Text
                style={[
                  styles.optionText,
                  { color: optionTextColor(opt) },
                  isHindi && styles.hindiOption,
                ]}
              >
                {opt}
              </Text>
              {isHindi && !selected && (
                <Pressable
                  onPress={() => speak(opt)}
                  style={styles.optionSpeakBtn}
                  hitSlop={8}
                >
                  <Feather name="volume-1" size={14} color={colors.mutedForeground} />
                </Pressable>
              )}
            </Pressable>
          ))}
        </View>

        {isHindi && (
          <Text style={[styles.tapHint, { color: colors.mutedForeground }]}>
            Tap 🔊 on any option to hear it
          </Text>
        )}
      </ScrollView>

      {selected && (
        <View
          style={[
            styles.feedbackBar,
            {
              backgroundColor: isCorrect ? colors.success + "15" : colors.destructive + "12",
              borderTopColor: isCorrect ? colors.success + "40" : colors.destructive + "30",
              paddingBottom: bottomPad + 16,
            },
          ]}
        >
          <View style={styles.feedbackLeft}>
            <Feather
              name={isCorrect ? "check-circle" : "x-circle"}
              size={22}
              color={isCorrect ? colors.success : colors.destructive}
            />
            <View style={styles.feedbackTextCol}>
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: isCorrect ? colors.success : colors.destructive },
                ]}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </Text>
              {!isCorrect && (
                <Pressable
                  onPress={() => speak(currentExercise.correct)}
                  style={styles.feedbackAnswerRow}
                >
                  <Text style={[styles.feedbackAnswer, { color: colors.mutedForeground }]}>
                    Answer: {currentExercise.correct}
                  </Text>
                  <Feather name="volume-1" size={13} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
          </View>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueBtn,
              {
                backgroundColor: isCorrect ? colors.success : colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.continueBtnText}>
              {exerciseIdx < exercises.length - 1 ? "Continue" : "Finish"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  progressWrapper: { flex: 1 },
  heartsRow: { flexDirection: "row", gap: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  questionSection: { marginBottom: 24, gap: 10 },
  stepIndicator: { fontSize: 12, fontWeight: "500" },
  instruction: { fontSize: 14 },
  questionCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    alignItems: "center",
    gap: 14,
  },
  questionText: { fontSize: 26, fontWeight: "800", textAlign: "center", lineHeight: 36 },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  speakBtnText: { fontSize: 13, fontWeight: "600" },
  hintText: { fontSize: 13, textAlign: "center", fontStyle: "italic", lineHeight: 18 },
  optionsContainer: { gap: 12 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 16,
    minHeight: 60,
  },
  statusIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: { fontSize: 16, fontWeight: "600", flex: 1 },
  hindiOption: { fontSize: 22, fontWeight: "700" },
  optionSpeakBtn: {
    padding: 4,
  },
  tapHint: { fontSize: 12, textAlign: "center", marginTop: 8 },
  feedbackBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  feedbackLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  feedbackTextCol: { gap: 2 },
  feedbackTitle: { fontSize: 15, fontWeight: "700" },
  feedbackAnswerRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  feedbackAnswer: { fontSize: 12 },
  continueBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
  },
  continueBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
