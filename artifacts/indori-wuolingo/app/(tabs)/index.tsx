import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext, useUnlockedLessons } from '@/contexts/AppContext';
import { CURRICULUM } from '@/data/curriculum';

function StatPill({ icon, value, color }: { icon: string; value: string | number; color: string }) {
  return (
    <View style={[styles.statPill, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

function LessonNode({
  lessonId,
  title,
  titleHindi,
  iconName,
  status,
  unitColor,
  xpReward,
}: {
  lessonId: string;
  title: string;
  titleHindi: string;
  iconName: string;
  status: 'completed' | 'available' | 'locked';
  unitColor: string;
  xpReward: number;
}) {
  const colors = useColors();

  const bg = status === 'completed'
    ? unitColor
    : status === 'available'
      ? '#FFFFFF'
      : colors.muted;
  const iconColor = status === 'completed'
    ? '#FFFFFF'
    : status === 'available'
      ? unitColor
      : colors.locked;
  const borderColor = status === 'locked' ? colors.border : unitColor;

  return (
    <TouchableOpacity
      onPress={() => status !== 'locked' && router.push(`/lesson/${lessonId}` as any)}
      disabled={status === 'locked'}
      style={[styles.lessonNode, { backgroundColor: bg, borderColor, shadowColor: status !== 'locked' ? unitColor : 'transparent' }]}
      activeOpacity={status === 'locked' ? 1 : 0.75}
    >
      <View style={styles.lessonNodeInner}>
        <Ionicons name={status === 'completed' ? 'checkmark' : (status === 'locked' ? 'lock-closed' : iconName as any)} size={26} color={iconColor} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.lessonTitle, { color: status === 'completed' ? '#fff' : status === 'locked' ? colors.mutedForeground : colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.lessonHindi, { color: status === 'completed' ? 'rgba(255,255,255,0.8)' : status === 'locked' ? colors.locked : unitColor }]}>
            {titleHindi}
          </Text>
        </View>
        <View style={[styles.xpBadge, { backgroundColor: status === 'completed' ? 'rgba(255,255,255,0.25)' : unitColor + '20' }]}>
          <Text style={[styles.xpText, { color: status === 'completed' ? '#fff' : unitColor }]}>+{xpReward} XP</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, progress } = useAppContext();
  const unlockedLessons = useUnlockedLessons();

  const xpToday = 0;
  const goalXp = Math.ceil((userProfile?.dailyGoalMinutes ?? 10) * 2);
  const dailyProgress = Math.min(1, xpToday / goalXp);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, {
        paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8,
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Namaste 🙏</Text>
          <Text style={[styles.userName, { color: colors.foreground }]}>{userProfile?.displayName ?? 'Learner'}</Text>
        </View>
        <View style={styles.stats}>
          <StatPill icon="flame" value={progress.streak} color="#FF6B35" />
          <StatPill icon="heart" value={progress.hearts} color="#EF4444" />
          <StatPill icon="star" value={progress.xp} color="#F59E0B" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === 'web' ? 100 : insets.bottom + 80 }]}
      >
        <View style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.goalRow}>
            <Ionicons name="flag" size={18} color={colors.primary} />
            <Text style={[styles.goalLabel, { color: colors.foreground }]}>Daily Goal</Text>
            <Text style={[styles.goalTarget, { color: colors.mutedForeground }]}>{userProfile?.dailyGoalMinutes ?? 10} min</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${dailyProgress * 100}%` as any, backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.goalStatus, { color: colors.mutedForeground }]}>
            {progress.completedLessons.length > 0 ? `${progress.completedLessons.length} lessons done today` : 'Start your first lesson!'}
          </Text>
        </View>

        {CURRICULUM.map((unit) => {
          const unitLessons = unit.lessons;
          const completedCount = unitLessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const isUnitStarted = completedCount > 0;

          return (
            <View key={unit.id} style={styles.unitSection}>
              <View style={[styles.unitHeader, { backgroundColor: unit.color + '15', borderColor: unit.color + '30' }]}>
                <View style={[styles.unitBadge, { backgroundColor: unit.color }]}>
                  <Text style={styles.unitBadgeText}>{unit.id.replace('unit', '')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.unitTitle, { color: unit.color }]}>{unit.title}</Text>
                  <Text style={[styles.unitHindi, { color: colors.mutedForeground }]}>{unit.titleHindi} · {unit.description}</Text>
                </View>
                {isUnitStarted && (
                  <Text style={[styles.unitProgress, { color: unit.color }]}>{completedCount}/{unitLessons.length}</Text>
                )}
              </View>

              <View style={styles.lessonList}>
                {unitLessons.map((lesson) => {
                  const completed = progress.completedLessons.includes(lesson.id);
                  const unlocked = unlockedLessons.has(lesson.id);
                  const status = completed ? 'completed' : unlocked ? 'available' : 'locked';
                  return (
                    <LessonNode
                      key={lesson.id}
                      lessonId={lesson.id}
                      title={lesson.title}
                      titleHindi={lesson.titleHindi}
                      iconName={lesson.iconName}
                      status={status}
                      unitColor={unit.color}
                      xpReward={lesson.xpReward}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 1 },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  userName: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  stats: { flexDirection: 'row', gap: 8 },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statValue: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, gap: 20 },
  goalCard: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 10 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  goalLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1 },
  goalTarget: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  goalStatus: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  unitSection: { gap: 10 },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  unitBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  unitBadgeText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  unitTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  unitHindi: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  unitProgress: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  lessonList: { gap: 8, paddingLeft: 8 },
  lessonNode: { borderRadius: 16, borderWidth: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  lessonNodeInner: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  lessonTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  lessonHindi: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  xpBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  xpText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  locked: { color: '#D1D5DB' },
});
