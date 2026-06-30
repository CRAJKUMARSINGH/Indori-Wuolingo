import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import { getLanguageByCode } from '@/data/languages';
import { getCurriculumForLanguage, getLessonById, getUnitForLesson } from '@/data/multi-language';

export default function LessonCompleteScreen() {
  const params = useLocalSearchParams<{
    lessonId: string;
    xp: string;
    correct: string;
    total: string;
    wrongs: string;
  }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeLesson, progress, userProfile } = useAppContext();
  const selectedLanguage = getLanguageByCode(userProfile?.targetLanguage);
  const curriculum = getCurriculumForLanguage(selectedLanguage.code);

  const lesson = params.lessonId ? getLessonById(params.lessonId, curriculum) : null;
  const unit = params.lessonId ? getUnitForLesson(params.lessonId, curriculum) : null;

  const xpGained = parseInt(params.xp ?? '10', 10);
  const correct = parseInt(params.correct ?? '0', 10);
  const total = parseInt(params.total ?? '1', 10);
  const wrongIds = params.wrongs ? params.wrongs.split(',').filter(Boolean) : [];
  const accuracy = Math.round((correct / Math.max(total, 1)) * 100);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (hasCalledComplete.current || !params.lessonId) return;
    hasCalledComplete.current = true;
    completeLesson(params.lessonId, xpGained, wrongIds);

    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      Animated.timing(xpAnim, { toValue: xpGained, duration: 1000, useNativeDriver: false }),
    ]).start();
  }, []);

  const unitColor = unit?.color ?? colors.primary;
  const isAlreadyCompleted = params.lessonId ? progress.completedLessons.includes(params.lessonId) : false;
  const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

  return (
    <LinearGradient
      colors={[unitColor, unitColor + 'CC']}
      style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <Animated.View style={[styles.trophy, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.trophyCircle}>
          <Ionicons name="trophy" size={56} color={unitColor} />
        </View>
        <View style={styles.stars}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < stars ? 'star' : 'star-outline'}
              size={28}
              color={i < stars ? '#FFD700' : 'rgba(255,255,255,0.4)'}
            />
          ))}
        </View>
      </Animated.View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>
          {isAlreadyCompleted ? 'Great Review!' : 'Lesson Complete!'}
        </Text>
        <Text style={styles.lessonName}>{selectedLanguage.name} · {lesson?.title ?? 'Lesson'} · {lesson?.titleHindi}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Animated.Text style={styles.statNum}>
            {xpAnim.interpolate({ inputRange: [0, xpGained], outputRange: ['0', String(xpGained)] })}
          </Animated.Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
          <Text style={styles.statNum}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color="#FF6B35" />
          <Text style={styles.statNum}>{progress.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {wrongIds.length > 0 && (
        <View style={styles.reviewHint}>
          <Ionicons name="information-circle" size={18} color="rgba(255,255,255,0.8)" />
          <Text style={styles.reviewHintText}>
            {wrongIds.length} word{wrongIds.length > 1 ? 's' : ''} added to review queue
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        <Pressable
          onPress={() => router.replace('/(tabs)/' as any)}
          style={({ pressed }) => [styles.continueBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={[styles.continueBtnText, { color: unitColor }]}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color={unitColor} />
        </Pressable>
        <Pressable
          onPress={() => router.replace(`/lesson/${params.lessonId}` as any)}
          style={({ pressed }) => [styles.repeatBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="refresh" size={18} color="rgba(255,255,255,0.8)" />
          <Text style={styles.repeatBtnText}>Practice Again</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28 },
  trophy: { alignItems: 'center' },
  trophyCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 },
  stars: { flexDirection: 'row', gap: 6 },
  titleSection: { alignItems: 'center', gap: 6 },
  title: { fontSize: 32, fontFamily: 'Inter_700Bold', color: '#FFFFFF', textAlign: 'center' },
  lessonName: { fontSize: 16, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 16 },
  statBox: { flex: 1, alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', padding: 16, borderRadius: 18 },
  statNum: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  reviewHint: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  reviewHintText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.85)' },
  buttons: { width: '100%', gap: 12 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FFFFFF', paddingVertical: 18, borderRadius: 16 },
  continueBtnText: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  repeatBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  repeatBtnText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.8)' },
});
