import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProgress } from "@/context/ProgressContext";
import { getAllLessons } from "@/data/curriculum";
import { useColors } from "@/hooks/useColors";
import { useSpeech } from "@/hooks/useSpeech";
import { StreakBadge } from "@/components/StreakBadge";

const QUICK_REVIEW_WORDS = [
  { english: "Hello", hindi: "नमस्ते", roman: "Namaste" },
  { english: "Thank you", hindi: "धन्यवाद", roman: "Dhanyavaad" },
  { english: "Goodbye", hindi: "अलविदा", roman: "Alvida" },
  { english: "Yes", hindi: "हाँ", roman: "Haan" },
  { english: "No", hindi: "नहीं", roman: "Nahin" },
  { english: "Please", hindi: "कृपया", roman: "Kripaya" },
  { english: "Sorry", hindi: "माफ़ करना", roman: "Maaf karna" },
  { english: "One", hindi: "एक", roman: "Ek" },
  { english: "Two", hindi: "दो", roman: "Do" },
  { english: "Three", hindi: "तीन", roman: "Teen" },
  { english: "Mother", hindi: "माँ", roman: "Maa" },
  { english: "Father", hindi: "पिताजी", roman: "Pitaji" },
  { english: "Brother", hindi: "भाई", roman: "Bhai" },
  { english: "Sister", hindi: "बहन", roman: "Behen" },
  { english: "Family", hindi: "परिवार", roman: "Parivar" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getOptions(correct: string, allWords: typeof QUICK_REVIEW_WORDS): string[] {
  const others = allWords.filter((w) => w.hindi !== correct);
  const picked = shuffle(others).slice(0, 3).map((w) => w.hindi);
  return shuffle([correct, ...picked]);
}

export default function PracticeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress } = useProgress();
  const { speak, isSpeaking } = useSpeech();

  const [mode, setMode] = useState<"idle" | "quiz" | "done">("idle");
  const [quizWords, setQuizWords] = useState<typeof QUICK_REVIEW_WORDS>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  const completedCount = progress.completedLessons.length;

  const handleSpeak = (hindi: string) => {
    setSpeakingWord(hindi);
    speak(hindi);
    setTimeout(() => setSpeakingWord(null), 2000);
  };

  const startQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const words = shuffle(QUICK_REVIEW_WORDS).slice(0, 6);
    setQuizWords(words);
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setMode("quiz");
  };

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    speak(option);
    const word = quizWords[currentIdx];
    const isCorrect = option === word.hindi;
    if (isCorrect) {
      setScore((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (currentIdx < quizWords.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  if (mode === "quiz" && !showResult) {
    const word = quizWords[currentIdx];
    const options = getOptions(word.hindi, QUICK_REVIEW_WORDS);

    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.quizHeader}>
          <Pressable onPress={() => setMode("idle")} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>
          <View style={styles.quizProgressRow}>
            {quizWords.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.quizDot,
                  {
                    backgroundColor:
                      i < currentIdx
                        ? colors.success
                        : i === currentIdx
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              />
            ))}
          </View>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.quizContent}>
          <Text style={[styles.quizInstruction, { color: colors.mutedForeground }]}>
            Translate to Hindi
          </Text>
          <Text style={[styles.quizWord, { color: colors.text }]}>{word.english}</Text>

          <Pressable
            onPress={() => handleSpeak(word.hindi)}
            style={[
              styles.quizSpeakHint,
              { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" },
            ]}
          >
            <Feather name="volume-1" size={13} color={colors.primary} />
            <Text style={[styles.quizSpeakHintText, { color: colors.primary }]}>
              Tap an option to hear it
            </Text>
          </Pressable>

          <Text style={[styles.quizRomanHint, { color: colors.mutedForeground }]}>
            ({word.roman})
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          {options.map((opt) => {
            const isCorrectOpt = opt === word.hindi;
            const isSelected = opt === selected;
            let bg = colors.card;
            let border = colors.border;
            let textColor = colors.text;
            if (isSelected) {
              bg = isCorrectOpt ? colors.success + "20" : colors.destructive + "15";
              border = isCorrectOpt ? colors.success : colors.destructive;
              textColor = isCorrectOpt ? colors.success : colors.destructive;
            } else if (selected && isCorrectOpt) {
              bg = colors.success + "15";
              border = colors.success;
              textColor = colors.success;
            }

            return (
              <Pressable
                key={opt}
                onPress={() => handleAnswer(opt)}
                style={({ pressed }) => [
                  styles.optionBtn,
                  {
                    backgroundColor: bg,
                    borderColor: border,
                    opacity: pressed && !selected ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={[styles.optionHindi, { color: textColor }]}>{opt}</Text>
                {!selected && (
                  <Feather name="volume-1" size={13} color={colors.mutedForeground} />
                )}
                {isSelected && isCorrectOpt && (
                  <Feather name="check-circle" size={16} color={colors.success} />
                )}
                {isSelected && !isCorrectOpt && (
                  <Feather name="x-circle" size={16} color={colors.destructive} />
                )}
              </Pressable>
            );
          })}
        </View>

        {selected && (
          <Pressable
            onPress={handleNext}
            style={[styles.continueBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.continueBtnText, { color: colors.primaryForeground }]}>
              {currentIdx < quizWords.length - 1 ? "Next" : "Finish"}
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (mode === "quiz" && showResult) {
    const pct = Math.round((score / quizWords.length) * 100);
    return (
      <View style={[styles.container, styles.resultContainer, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.resultIcon, { backgroundColor: pct >= 70 ? colors.success + "20" : colors.destructive + "15" }]}>
          <Feather
            name={pct >= 70 ? "award" : "refresh-cw"}
            size={48}
            color={pct >= 70 ? colors.success : colors.destructive}
          />
        </View>
        <Text style={[styles.resultTitle, { color: colors.text }]}>
          {pct >= 70 ? "Great work!" : "Keep practicing!"}
        </Text>
        <Text style={[styles.resultScore, { color: colors.primary }]}>
          {score}/{quizWords.length} correct
        </Text>
        <Text style={[styles.resultSub, { color: colors.mutedForeground }]}>
          {pct}% accuracy
        </Text>
        <Pressable
          onPress={() => setMode("idle")}
          style={[styles.continueBtn, { backgroundColor: colors.primary, marginTop: 24 }]}
        >
          <Text style={[styles.continueBtnText, { color: "#fff" }]}>Done</Text>
        </Pressable>
        <Pressable onPress={startQuiz} style={styles.retryBtn}>
          <Text style={[styles.retryText, { color: colors.mutedForeground }]}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad + 12, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.screenTitle, { color: colors.text }]}>Practice</Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          Keep your vocabulary sharp
        </Text>

        <Pressable
          onPress={startQuiz}
          style={({ pressed }) => [
            styles.quickReviewCard,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <View style={styles.quickReviewLeft}>
            <Text style={styles.quickReviewTitle}>Quick Review</Text>
            <Text style={styles.quickReviewSub}>6 words · ~3 minutes · with audio</Text>
          </View>
          <View style={styles.playCircle}>
            <Feather name="play" size={22} color={colors.primary} />
          </View>
        </Pressable>

        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{completedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Lessons done</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{progress.streak}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Day streak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{QUICK_REVIEW_WORDS.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Words</Text>
          </View>
        </View>

        <View style={styles.vocabHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Vocabulary</Text>
          <View style={[styles.audioHint, { backgroundColor: colors.primary + "12" }]}>
            <Feather name="volume-2" size={12} color={colors.primary} />
            <Text style={[styles.audioHintText, { color: colors.primary }]}>Tap 🔊 to hear</Text>
          </View>
        </View>

        {QUICK_REVIEW_WORDS.map((word) => (
          <View
            key={word.english}
            style={[styles.wordCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.wordLeft}>
              <Text style={[styles.wordEnglish, { color: colors.text }]}>{word.english}</Text>
              <Text style={[styles.wordRoman, { color: colors.mutedForeground }]}>{word.roman}</Text>
            </View>
            <Text style={[styles.wordHindi, { color: colors.primary }]}>{word.hindi}</Text>
            <Pressable
              onPress={() => handleSpeak(word.hindi)}
              style={({ pressed }) => [
                styles.speakWordBtn,
                {
                  backgroundColor:
                    speakingWord === word.hindi
                      ? colors.primary
                      : colors.primary + "15",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather
                name={speakingWord === word.hindi ? "volume-2" : "volume-1"}
                size={16}
                color={speakingWord === word.hindi ? "#fff" : colors.primary}
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 12 },
  screenTitle: { fontSize: 28, fontWeight: "800", marginBottom: 2 },
  screenSub: { fontSize: 14, marginBottom: 8 },
  quickReviewCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickReviewLeft: { gap: 4 },
  quickReviewTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  quickReviewSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", borderRadius: 16, borderWidth: 1, padding: 16 },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1, marginHorizontal: 8 },
  vocabHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  audioHint: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  audioHintText: { fontSize: 12, fontWeight: "600" },
  wordCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  wordLeft: { flex: 1, gap: 2 },
  wordEnglish: { fontSize: 15, fontWeight: "600" },
  wordRoman: { fontSize: 12 },
  wordHindi: { fontSize: 20, fontWeight: "700" },
  speakWordBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: { padding: 6, width: 36 },
  quizProgressRow: { flex: 1, flexDirection: "row", gap: 6, justifyContent: "center" },
  quizDot: { flex: 1, height: 6, borderRadius: 3 },
  quizContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 14 },
  quizInstruction: { fontSize: 14 },
  quizWord: { fontSize: 40, fontWeight: "800", textAlign: "center" },
  quizSpeakHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  quizSpeakHintText: { fontSize: 12, fontWeight: "500" },
  quizRomanHint: { fontSize: 15 },
  optionsGrid: { paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  optionBtn: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionHindi: { fontSize: 22, fontWeight: "700", flex: 1 },
  continueBtn: {
    marginHorizontal: 20,
    borderRadius: 28,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  continueBtnText: { fontSize: 17, fontWeight: "700" },
  resultContainer: { alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  resultIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  resultTitle: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  resultScore: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  resultSub: { fontSize: 15 },
  retryBtn: { marginTop: 12, padding: 12 },
  retryText: { fontSize: 14 },
});
