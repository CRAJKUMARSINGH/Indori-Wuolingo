import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE_CODE, getLanguageByCode } from '@/data/languages';

const GOALS = [
  { minutes: 5, label: 'Casual', description: '5 min / day', icon: 'leaf' },
  { minutes: 10, label: 'Regular', description: '10 min / day', icon: 'walk' },
  { minutes: 15, label: 'Serious', description: '15 min / day', icon: 'bicycle' },
  { minutes: 20, label: 'Intense', description: '20 min / day', icon: 'barbell' },
];

const PROFICIENCY_LEVELS = [
  { level: 'beginner' as const, label: 'Complete Beginner', description: 'Never studied this language', icon: 'school' },
  { level: 'intermediate' as const, label: 'Some Knowledge', description: 'Know a few words or phrases', icon: 'book' },
  { level: 'advanced' as const, label: 'Conversational', description: 'Can hold basic conversations', icon: 'chatbubbles' },
];

export default function GoalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppContext();
  const [selectedGoal, setSelectedGoal] = useState(10);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  async function handleStart() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const [nameJson, languageJson] = await AsyncStorage.multiGet([
        'iw_onboarding_name',
        'iw_onboarding_target_language',
      ]);
      const selectedLanguage = getLanguageByCode(languageJson[1] ? JSON.parse(languageJson[1]) : DEFAULT_LANGUAGE_CODE);
      const name = nameJson[1] ? JSON.parse(nameJson[1]) : 'Learner';
      await completeOnboarding({
        displayName: name,
        nativeLanguage: 'english',
        targetLanguage: selectedLanguage.code,
        proficiency: selectedLevel,
        dailyGoalMinutes: selectedGoal,
      });
      router.replace('/(tabs)' as any);
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom, opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.progressDots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, { backgroundColor: i <= 1 ? colors.primary : colors.border }]} />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>Set your{'\n'}learning goal</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>How much do you want to study daily?</Text>

        <View style={styles.goalGrid}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.minutes}
              onPress={() => setSelectedGoal(g.minutes)}
              style={[
                styles.goalCard,
                {
                  borderColor: selectedGoal === g.minutes ? colors.primary : colors.border,
                  backgroundColor: selectedGoal === g.minutes ? colors.primary + '12' : colors.card,
                }
              ]}
            >
              <Ionicons name={g.icon as any} size={28} color={selectedGoal === g.minutes ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.goalLabel, { color: selectedGoal === g.minutes ? colors.primary : colors.foreground }]}>{g.label}</Text>
              <Text style={[styles.goalDesc, { color: colors.mutedForeground }]}>{g.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your level</Text>

        <View style={styles.levelList}>
          {PROFICIENCY_LEVELS.map(l => (
            <TouchableOpacity
              key={l.level}
              onPress={() => setSelectedLevel(l.level)}
              style={[
                styles.levelCard,
                {
                  borderColor: selectedLevel === l.level ? colors.primary : colors.border,
                  backgroundColor: selectedLevel === l.level ? colors.primary + '10' : colors.card,
                }
              ]}
            >
              <Ionicons name={l.icon as any} size={24} color={selectedLevel === l.level ? colors.primary : colors.mutedForeground} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.levelLabel, { color: colors.foreground }]}>{l.label}</Text>
                <Text style={[styles.levelDesc, { color: colors.mutedForeground }]}>{l.description}</Text>
              </View>
              {selectedLevel === l.level && (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [styles.startBtn, { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.8 : 1 }]}
          disabled={isSubmitting}
        >
          <Text style={styles.startBtnText}>{isSubmitting ? 'Starting...' : 'Start Learning!'}</Text>
          {!isSubmitting && <Ionicons name="rocket" size={20} color="#fff" />}
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4 },
  progressDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  goalCard: { width: '46%', padding: 16, borderRadius: 16, borderWidth: 2, alignItems: 'center', gap: 8 },
  goalLabel: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  goalDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  levelList: { gap: 10 },
  levelCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 2 },
  levelLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  levelDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderTopWidth: 1 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14 },
  startBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
});
