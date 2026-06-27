import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import { CURRICULUM } from '@/data/curriculum';

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { progress } = useAppContext();

  const completedLessons = CURRICULUM.flatMap(u => u.lessons).filter(l =>
    progress.completedLessons.includes(l.id)
  );

  const reviewWords = Object.entries(progress.wordBank)
    .filter(([, stat]) => stat.incorrect > 0)
    .sort((a, b) => b[1].incorrect - a[1].incorrect)
    .slice(0, 10);

  const nextLessonId = CURRICULUM.flatMap(u => u.lessons).find(
    l => !progress.completedLessons.includes(l.id)
  )?.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Practice</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Review & strengthen your Hindi</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 100 : insets.bottom + 80 }]}
      >
        {completedLessons.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="book-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nothing to review yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Complete your first lesson to unlock practice sessions</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/' as any)}
              style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={styles.actionBtnText}>Start a Lesson</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {reviewWords.length > 0 && (
              <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: '#FEF2F2' }]}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                  </View>
                  <View>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Weak Words</Text>
                    <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>{reviewWords.length} words need practice</Text>
                  </View>
                </View>
                <View style={styles.wordList}>
                  {reviewWords.slice(0, 5).map(([id, stat]) => (
                    <View key={id} style={[styles.wordRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.wordId, { color: colors.foreground }]}>{id.split('e').slice(-1)[0]}</Text>
                      <View style={[styles.errorBadge, { backgroundColor: '#FEF2F2' }]}>
                        <Text style={{ fontSize: 12, color: '#EF4444', fontFamily: 'Inter_600SemiBold' }}>{stat.incorrect}✗</Text>
                      </View>
                    </View>
                  ))}
                </View>
                {nextLessonId && (
                  <Pressable
                    onPress={() => router.push(`/lesson/${nextLessonId}` as any)}
                    style={({ pressed }) => [styles.reviewBtn, { backgroundColor: '#EF4444', opacity: pressed ? 0.85 : 1 }]}
                  >
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text style={styles.reviewBtnText}>Practice Now</Text>
                  </Pressable>
                )}
              </View>
            )}

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="repeat" size={20} color="#4F46E5" />
                </View>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Spaced Review</Text>
                  <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>Revisit completed lessons</Text>
                </View>
              </View>
              <View style={styles.lessonGrid}>
                {completedLessons.map(lesson => {
                  const unit = CURRICULUM.find(u => u.lessons.some(l => l.id === lesson.id));
                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      onPress={() => router.push(`/lesson/${lesson.id}` as any)}
                      style={[styles.reviewLessonCard, { borderColor: unit?.color ?? colors.border, backgroundColor: (unit?.color ?? colors.primary) + '10' }]}
                      activeOpacity={0.75}
                    >
                      <Ionicons name={lesson.iconName as any} size={20} color={unit?.color ?? colors.primary} />
                      <Text style={[styles.reviewLessonTitle, { color: colors.foreground }]}>{lesson.title}</Text>
                      <Text style={[styles.reviewLessonHindi, { color: unit?.color ?? colors.primary }]}>{lesson.titleHindi}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.statsCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
              <Text style={[styles.statsTitle, { color: colors.primary }]}>Your Progress</Text>
              <View style={styles.statsRow}>
                {[
                  { label: 'Lessons Done', value: completedLessons.length, icon: 'book' },
                  { label: 'Total XP', value: progress.xp, icon: 'star' },
                  { label: 'Day Streak', value: progress.streak, icon: 'flame' },
                ].map(s => (
                  <View key={s.label} style={styles.statItem}>
                    <Ionicons name={s.icon as any} size={22} color={colors.primary} />
                    <Text style={[styles.statNum, { color: colors.foreground }]}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 2 },
  content: { padding: 16, gap: 16 },
  emptyCard: { padding: 32, borderRadius: 20, borderWidth: 1, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  actionBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  actionBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
  sectionCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sectionSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  wordList: { gap: 0 },
  wordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  wordId: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  errorBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  reviewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12 },
  reviewBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },
  lessonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reviewLessonCard: { width: '46%', padding: 12, borderRadius: 12, borderWidth: 1.5, gap: 4, alignItems: 'center' },
  reviewLessonTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  reviewLessonHindi: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  statsCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  statsTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
