import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import { getLessonById, getUnitForLesson } from '@/data/curriculum';
import ExerciseView from '@/components/ExerciseView';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress } = useAppContext();

  const lesson = lessonId ? getLessonById(lessonId) : null;
  const unit = lessonId ? getUnitForLesson(lessonId) : null;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [hearts, setHearts] = useState(progress.hearts);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const unitColor = unit?.color ?? colors.primary;

  useEffect(() => {
    if (!lesson) return;
    const pct = exerciseIndex / lesson.exercises.length;
    Animated.timing(progressAnim, { toValue: pct, duration: 300, useNativeDriver: false }).start();
  }, [exerciseIndex, lesson]);

  const handleAnswer = useCallback((correct: boolean, exerciseId: string) => {
    if (!lesson) return;
    if (!correct) {
      setHearts(h => {
        const next = Math.max(0, h - 1);
        if (next === 0) {
          setTimeout(() => {
            Alert.alert(
              'Out of Hearts!',
              'You\'ve run out of hearts. Come back later or review easier lessons.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }, 400);
        }
        return next;
      });
      setWrongIds(prev => [...prev, exerciseId]);
    } else {
      setCorrectCount(c => c + 1);
    }

    const nextIndex = exerciseIndex + 1;
    if (nextIndex >= lesson.exercises.length) {
      const finalCorrect = correctCount + (correct ? 1 : 0);
      router.replace({
        pathname: '/lesson/complete',
        params: {
          lessonId: lesson.id,
          xp: String(lesson.xpReward),
          correct: String(finalCorrect),
          total: String(lesson.exercises.length),
          wrongs: wrongIds.join(','),
        },
      } as any);
    } else {
      setExerciseIndex(nextIndex);
    }
  }, [lesson, exerciseIndex, correctCount, wrongIds]);

  if (!lesson || !unit) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.foreground, fontSize: 16 }}>Lesson not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const currentExercise = lesson.exercises[exerciseIndex];
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            Alert.alert('Leave Lesson?', 'Your progress in this lesson will be lost.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Leave', style: 'destructive', onPress: () => router.back() },
            ]);
          }}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={24} color={colors.mutedForeground} />
        </Pressable>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: unitColor }]} />
          </View>
        </View>

        <View style={styles.heartsRow}>
          {Array.from({ length: progress.hearts }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < hearts ? 'heart' : 'heart-outline'}
              size={20}
              color={i < hearts ? '#EF4444' : colors.border}
            />
          ))}
        </View>
      </View>

      <View style={styles.lessonInfo}>
        <Text style={[styles.lessonTitle, { color: colors.mutedForeground }]}>
          {lesson.title} · {exerciseIndex + 1} / {lesson.exercises.length}
        </Text>
      </View>

      <View style={styles.exerciseContainer}>
        <ExerciseView
          key={currentExercise.id}
          exercise={currentExercise}
          onAnswer={handleAnswer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  closeBtn: { padding: 4 },
  progressBarContainer: { flex: 1 },
  progressTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  heartsRow: { flexDirection: 'row', gap: 2 },
  lessonInfo: { paddingHorizontal: 20, paddingBottom: 4 },
  lessonTitle: { fontSize: 13, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  exerciseContainer: { flex: 1 },
});
