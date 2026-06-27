import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const LANGUAGES = [
  { code: 'hindi', name: 'Hindi', script: 'हिंदी', flag: '🇮🇳', speakers: '600M+ speakers' },
  { code: 'marathi', name: 'Marathi', script: 'मराठी', flag: '🇮🇳', speakers: '83M speakers', comingSoon: true },
  { code: 'bengali', name: 'Bengali', script: 'বাংলা', flag: '🇮🇳', speakers: '230M speakers', comingSoon: true },
  { code: 'tamil', name: 'Tamil', script: 'தமிழ்', flag: '🇮🇳', speakers: '75M speakers', comingSoon: true },
  { code: 'telugu', name: 'Telugu', script: 'తెలుగు', flag: '🇮🇳', speakers: '82M speakers', comingSoon: true },
  { code: 'kannada', name: 'Kannada', script: 'ಕನ್ನಡ', flag: '🇮🇳', speakers: '44M speakers', comingSoon: true },
  { code: 'gujarati', name: 'Gujarati', script: 'ગુજરાતી', flag: '🇮🇳', speakers: '55M speakers', comingSoon: true },
];

export default function LanguageScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>('hindi');
  const [name, setName] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.progressDots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, { backgroundColor: i === 0 ? colors.primary : colors.border }]} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.foreground }]}>What do you want{'\n'}to learn?</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Choose your target language</Text>

        <View style={styles.nameSection}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Your name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Priya"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.nameInput, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.languageList}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => !lang.comingSoon && setSelected(lang.code)}
              style={[
                styles.languageCard,
                {
                  borderColor: selected === lang.code ? colors.primary : colors.border,
                  backgroundColor: selected === lang.code ? colors.primary + '10' : colors.card,
                  opacity: lang.comingSoon ? 0.55 : 1,
                }
              ]}
              activeOpacity={lang.comingSoon ? 1 : 0.75}
            >
              <Text style={styles.flagText}>{lang.flag}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.langNameRow}>
                  <Text style={[styles.langName, { color: colors.foreground }]}>{lang.name}</Text>
                  {lang.comingSoon && (
                    <View style={[styles.soonBadge, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.soonText, { color: colors.mutedForeground }]}>Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.langScript, { color: colors.primary }]}>{lang.script}</Text>
                <Text style={[styles.speakers, { color: colors.mutedForeground }]}>{lang.speakers}</Text>
              </View>
              {selected === lang.code && !lang.comingSoon && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={async () => {
            if (!selected || !name.trim()) return;
            await AsyncStorage.setItem('iw_onboarding_name', JSON.stringify(name.trim()));
            router.push('/onboarding/goals');
          }}
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: selected && name.trim() ? colors.primary : colors.muted, opacity: pressed ? 0.85 : 1 }
          ]}
        >
          <Text style={[styles.nextBtnText, { color: selected && name.trim() ? '#fff' : colors.mutedForeground }]}>
            Continue
          </Text>
          <Ionicons name="arrow-forward" size={20} color={selected && name.trim() ? '#fff' : colors.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { padding: 4 },
  progressDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', marginBottom: 8 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  nameSection: { marginBottom: 24 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  nameInput: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontFamily: 'Inter_400Regular' },
  languageList: { gap: 10 },
  languageCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 2 },
  flagText: { fontSize: 28 },
  langNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  langName: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  langScript: { fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  speakers: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  soonBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  soonText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderTopWidth: 1 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
  nextBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
});
