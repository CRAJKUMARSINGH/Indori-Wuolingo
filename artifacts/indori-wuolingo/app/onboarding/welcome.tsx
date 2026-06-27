import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>ह</Text>
        </View>
        <Text style={styles.appName}>Indori Wuolingo</Text>
        <Text style={styles.tagline}>Learn Indian Languages the fun way</Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: 'flame', label: 'Build daily streaks', color: '#FF6B35' },
          { icon: 'trophy', label: 'Earn XP & badges', color: '#F59E0B' },
          { icon: 'mic', label: 'Speaking & listening', color: '#10B981' },
          { icon: 'heart', label: 'Culturally localized', color: '#EC4899' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: f.color + '22' }]}>
              <Ionicons name={f.icon as any} size={22} color={f.color} />
            </View>
            <Text style={styles.featureText}>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={() => router.push('/onboarding/language')}
          style={({ pressed }) => [styles.startBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.startBtnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#4F46E5" />
        </Pressable>
        <Text style={styles.freeText}>Free forever · No credit card needed</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  features: {
    gap: 16,
    paddingVertical: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
  },
  bottom: {
    alignItems: 'center',
    gap: 12,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  startBtnText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#4F46E5',
  },
  freeText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
  },
});
