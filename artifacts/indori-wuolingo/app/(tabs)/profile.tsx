import { Ionicons } from '@expo/vector-icons';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import { getLanguageByCode } from '@/data/languages';
import { BADGES, getCurriculumForLanguage } from '@/data/multi-language';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, progress, resetOnboarding } = useAppContext();
  const selectedLanguage = getLanguageByCode(userProfile?.targetLanguage);
  const curriculum = getCurriculumForLanguage(selectedLanguage.code);

  const completedCount = curriculum
    .flatMap(unit => unit.lessons)
    .filter(lesson => progress.completedLessons.includes(lesson.id)).length;
  const totalLessons = curriculum.flatMap(u => u.lessons).length;

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your progress and start over. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetOnboarding() },
      ]
    );
  };

  const proficiencyLabel = {
    beginner: 'Complete Beginner',
    intermediate: 'Some Knowledge',
    advanced: 'Conversational',
  }[userProfile?.proficiency ?? 'beginner'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 100 : insets.bottom + 80 }]}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{(userProfile?.displayName ?? 'L')[0].toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{userProfile?.displayName ?? 'Learner'}</Text>
            <Text style={[styles.profileSub, { color: colors.mutedForeground }]}>
              Learning {selectedLanguage.name} · {proficiencyLabel}
            </Text>
            <Text style={[styles.profileGoal, { color: colors.primary }]}>
              {userProfile?.dailyGoalMinutes ?? 10} min/day goal
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {[
            { label: 'XP Earned', value: progress.xp, icon: 'star', color: '#F59E0B' },
            { label: 'Day Streak', value: progress.streak, icon: 'flame', color: '#FF6B35' },
            { label: 'Lessons Done', value: completedCount, icon: 'book', color: '#4F46E5' },
            { label: 'Min Studied', value: progress.totalMinutesStudied, icon: 'time', color: '#10B981' },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: s.color + '10', borderColor: s.color + '25' }]}>
              <Ionicons name={s.icon as any} size={24} color={s.color} />
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.progressSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Course Progress</Text>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>{completedCount} / {totalLessons} lessons</Text>
            <Text style={[styles.progressPct, { color: colors.primary }]}>{Math.round((completedCount / totalLessons) * 100)}%</Text>
          </View>
          <View style={[styles.track, { backgroundColor: colors.muted }]}>
            <View style={[styles.fill, { width: `${(completedCount / totalLessons) * 100}%` as any, backgroundColor: colors.primary }]} />
          </View>
          {curriculum.map(unit => {
            const done = unit.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
            return (
              <View key={unit.id} style={styles.unitRow}>
                <View style={[styles.unitDot, { backgroundColor: unit.color }]} />
                <Text style={[styles.unitName, { color: colors.foreground }]}>{unit.title}</Text>
                <Text style={[styles.unitCount, { color: unit.color }]}>{done}/{unit.lessons.length}</Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.badgesSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Badges</Text>
          <View style={styles.badgeGrid}>
            {BADGES.map(badge => {
              const earned = progress.earnedBadgeIds.includes(badge.id);
              return (
                <View key={badge.id} style={[styles.badge, { backgroundColor: earned ? colors.accent + '15' : colors.muted, borderColor: earned ? colors.accent : colors.border }]}>
                  <Ionicons name={badge.icon as any} size={26} color={earned ? colors.accent : colors.mutedForeground} />
                  <Text style={[styles.badgeTitle, { color: earned ? colors.foreground : colors.mutedForeground }]} numberOfLines={2}>{badge.title}</Text>
                  {!earned && <Ionicons name="lock-closed" size={12} color={colors.mutedForeground} style={{ position: 'absolute', top: 8, right: 8 }} />}
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleReset}
          style={[styles.resetBtn, { borderColor: colors.destructive }]}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={colors.destructive} />
          <Text style={[styles.resetText, { color: colors.destructive }]}>Reset All Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  content: { padding: 16, gap: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 20, borderWidth: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileName: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  profileSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  profileGoal: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', padding: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 6 },
  statNum: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  progressSection: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 10 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  progressPct: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  unitDot: { width: 10, height: 10, borderRadius: 5 },
  unitName: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  unitCount: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  badgesSection: { padding: 16, borderRadius: 18, borderWidth: 1 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  badge: { width: '30%', padding: 12, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', gap: 6, minHeight: 90 },
  badgeTitle: { fontSize: 11, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1.5 },
  resetText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
