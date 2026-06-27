import { Ionicons } from '@expo/vector-icons';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import { LEADERBOARD_MOCK } from '@/data/curriculum';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, progress } = useAppContext();

  const userEntry = {
    id: 'me',
    name: userProfile?.displayName ?? 'You',
    xp: progress.weeklyXp,
    flag: '🇮🇳',
    streak: progress.streak,
  };

  const allEntries = [...LEADERBOARD_MOCK, userEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const userRank = allEntries.find(e => e.id === 'me')?.rank ?? allEntries.length;

  const top3 = allEntries.slice(0, 3);
  const rest = allEntries.slice(3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Leaderboard</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Weekly XP ranking</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 100 : insets.bottom + 80 }]}
      >
        <View style={[styles.podium, { backgroundColor: colors.primary + '08' }]}>
          <View style={[styles.podiumItem, { marginTop: 20 }]}>
            <Text style={styles.podiumFlag}>{top3[1]?.flag}</Text>
            <View style={[styles.podiumCircle, { backgroundColor: MEDAL_COLORS[1] + '20', borderColor: MEDAL_COLORS[1] }]}>
              <Text style={[styles.podiumRank, { color: MEDAL_COLORS[1] }]}>2</Text>
            </View>
            <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{top3[1]?.name}</Text>
            <Text style={[styles.podiumXp, { color: colors.mutedForeground }]}>{top3[1]?.xp} XP</Text>
          </View>
          <View style={styles.podiumItem}>
            <Text style={styles.podiumFlag}>{top3[0]?.flag}</Text>
            <View style={[styles.podiumCircle, { width: 60, height: 60, borderRadius: 30, backgroundColor: MEDAL_COLORS[0] + '20', borderColor: MEDAL_COLORS[0] }]}>
              <Ionicons name="trophy" size={24} color={MEDAL_COLORS[0]} />
            </View>
            <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{top3[0]?.name}</Text>
            <Text style={[styles.podiumXp, { color: colors.mutedForeground }]}>{top3[0]?.xp} XP</Text>
          </View>
          <View style={[styles.podiumItem, { marginTop: 32 }]}>
            <Text style={styles.podiumFlag}>{top3[2]?.flag}</Text>
            <View style={[styles.podiumCircle, { backgroundColor: MEDAL_COLORS[2] + '20', borderColor: MEDAL_COLORS[2] }]}>
              <Text style={[styles.podiumRank, { color: MEDAL_COLORS[2] }]}>3</Text>
            </View>
            <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{top3[2]?.name}</Text>
            <Text style={[styles.podiumXp, { color: colors.mutedForeground }]}>{top3[2]?.xp} XP</Text>
          </View>
        </View>

        {userRank > 3 && (
          <View style={[styles.youCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary }]}>
            <Text style={[styles.youRank, { color: colors.primary }]}>#{userRank}</Text>
            <Text style={[styles.youName, { color: colors.foreground }]}>You · {userEntry.name}</Text>
            <Text style={[styles.youXp, { color: colors.primary }]}>{userEntry.xp} XP</Text>
          </View>
        )}

        <View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {rest.map((entry) => {
            const isMe = entry.id === 'me';
            return (
              <View
                key={entry.id}
                style={[
                  styles.row,
                  { borderBottomColor: colors.border },
                  isMe && { backgroundColor: colors.primary + '08' }
                ]}
              >
                <Text style={[styles.rankNum, { color: isMe ? colors.primary : colors.mutedForeground }]}>#{entry.rank}</Text>
                <Text style={styles.rowFlag}>{entry.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowName, { color: isMe ? colors.primary : colors.foreground }]}>
                    {isMe ? `${entry.name} (You)` : entry.name}
                  </Text>
                  <View style={styles.rowStats}>
                    <Ionicons name="flame" size={12} color="#FF6B35" />
                    <Text style={[styles.rowStreak, { color: colors.mutedForeground }]}>{entry.streak} day streak</Text>
                  </View>
                </View>
                <Text style={[styles.rowXp, { color: isMe ? colors.primary : colors.foreground }]}>{entry.xp} XP</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 2 },
  content: { padding: 16, gap: 14 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 12, padding: 20, borderRadius: 20 },
  podiumItem: { alignItems: 'center', gap: 6, width: 96 },
  podiumFlag: { fontSize: 24 },
  podiumCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  podiumRank: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  podiumName: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  podiumXp: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  youCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 2, gap: 10 },
  youRank: { fontSize: 18, fontFamily: 'Inter_700Bold', width: 40 },
  youName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', flex: 1 },
  youXp: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  listCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 1 },
  rankNum: { fontSize: 14, fontFamily: 'Inter_700Bold', width: 30 },
  rowFlag: { fontSize: 20 },
  rowName: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  rowStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rowStreak: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  rowXp: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
