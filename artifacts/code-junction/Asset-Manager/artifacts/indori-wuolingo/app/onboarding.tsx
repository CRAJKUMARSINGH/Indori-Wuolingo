import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@/context/UserContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const GOALS = [
  { minutes: 5, label: "Casual", sublabel: "5 min / day", icon: "coffee" },
  { minutes: 10, label: "Regular", sublabel: "10 min / day", icon: "book" },
  { minutes: 15, label: "Serious", sublabel: "15 min / day", icon: "target" },
  { minutes: 20, label: "Intense", sublabel: "20 min / day", icon: "zap" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useUser();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(10);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else {
      await completeOnboarding(name.trim(), selectedGoal);
      router.replace("/(tabs)/learn");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconBig, { backgroundColor: colors.primary + "18" }]}>
              <Text style={styles.hindiLogo}>नमस्ते</Text>
            </View>
            <Text style={[styles.heading, { color: colors.text }]}>Learn Hindi{"\n"}the fun way</Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              Short lessons. Daily streaks.{"\n"}Real Indian language learning.
            </Text>
            <View style={styles.featuresRow}>
              {[
                { icon: "zap", label: "Gamified XP" },
                { icon: "repeat", label: "Spaced review" },
                { icon: "type", label: "Script learning" },
              ].map((f) => (
                <View key={f.label} style={[styles.featurePill, { backgroundColor: colors.muted }]}>
                  <Feather name={f.icon as any} size={14} color={colors.primary} />
                  <Text style={[styles.featureLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconBig, { backgroundColor: colors.secondary + "18" }]}>
              <Feather name="user" size={48} color={colors.secondary} />
            </View>
            <Text style={[styles.heading, { color: colors.text }]}>What's your name?</Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              We'll personalize your{"\n"}learning experience.
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: name.trim() ? colors.primary : colors.border,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconBig, { backgroundColor: colors.accent + "28" }]}>
              <Feather name="target" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.heading, { color: colors.text }]}>Daily goal</Text>
            <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
              Consistent practice is the{"\n"}key to fluency.
            </Text>
            <View style={styles.goalsGrid}>
              {GOALS.map((g) => (
                <Pressable
                  key={g.minutes}
                  onPress={() => {
                    setSelectedGoal(g.minutes);
                    Haptics.selectionAsync();
                  }}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: selectedGoal === g.minutes ? colors.primary + "15" : colors.card,
                      borderColor: selectedGoal === g.minutes ? colors.primary : colors.border,
                      borderWidth: selectedGoal === g.minutes ? 2 : 1,
                    },
                  ]}
                >
                  <Feather
                    name={g.icon as any}
                    size={22}
                    color={selectedGoal === g.minutes ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.goalLabel,
                      { color: selectedGoal === g.minutes ? colors.primary : colors.text },
                    ]}
                  >
                    {g.label}
                  </Text>
                  <Text style={[styles.goalSublabel, { color: colors.mutedForeground }]}>{g.sublabel}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === step ? colors.primary : colors.border },
                i === step && { width: 20 },
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            step === 1 && !name.trim() && { opacity: 0.5 },
          ]}
        >
          <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>
            {step === 2 ? "Let's go!" : "Continue"}
          </Text>
          <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  stepContainer: { flex: 1, alignItems: "center", paddingTop: 40, paddingBottom: 24 },
  iconBig: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  hindiLogo: { fontSize: 32, fontWeight: "700", color: "#FF6B35" },
  heading: { fontSize: 32, fontWeight: "800", textAlign: "center", lineHeight: 40, marginBottom: 12 },
  subheading: { fontSize: 16, textAlign: "center", lineHeight: 24, marginBottom: 32 },
  featuresRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  featurePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  featureLabel: { fontSize: 13, fontWeight: "500" },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "500",
  },
  goalsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, width: "100%" },
  goalCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  goalLabel: { fontSize: 15, fontWeight: "700" },
  goalSublabel: { fontSize: 12 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 16 },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { height: 6, width: 6, borderRadius: 3 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 28,
  },
  ctaText: { fontSize: 17, fontWeight: "700" },
});
