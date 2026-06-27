import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { Exercise, MultipleChoiceExercise, WordOrderExercise } from '@/data/curriculum';

type AnswerState = 'idle' | 'correct' | 'wrong';

interface ExerciseViewProps {
  exercise: Exercise;
  onAnswer: (correct: boolean, exerciseId: string) => void;
}

function MultipleChoiceView({
  exercise,
  onAnswer,
}: {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const colors = useColors();
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<AnswerState>('idle');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleSelect = useCallback(async (index: number) => {
    if (state !== 'idle') return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    setState(correct ? 'correct' : 'wrong');

    if (Platform.OS !== 'web') {
      if (correct) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
      }
    }

    setTimeout(() => {
      onAnswer(correct);
    }, 1200);
  }, [state, exercise.correctIndex, onAnswer, shakeAnim]);

  const getOptionStyle = (index: number) => {
    if (state === 'idle' || selected !== index) return styles.optionBase;
    if (state === 'correct') return [styles.optionBase, { borderColor: colors.success, backgroundColor: '#F0FDF4' }];
    return [styles.optionBase, { borderColor: colors.destructive, backgroundColor: '#FEF2F2' }];
  };

  const getOptionTextColor = (index: number) => {
    if (state === 'idle' || selected !== index) return colors.foreground;
    if (state === 'correct') return colors.success;
    return colors.destructive;
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptSection}>
        {exercise.promptScript ? (
          <>
            <Text style={[styles.scriptText, { color: colors.primary }]}>{exercise.promptScript}</Text>
            <Text style={[styles.translitText, { color: colors.mutedForeground }]}>{exercise.promptTranslit ?? exercise.prompt}</Text>
          </>
        ) : (
          <Text style={[styles.promptText, { color: colors.foreground }]}>{exercise.prompt}</Text>
        )}
        {exercise.hint ? (
          <Text style={[styles.hintText, { color: colors.mutedForeground }]}>{exercise.hint}</Text>
        ) : null}
      </View>

      <Text style={[styles.instruction, { color: colors.mutedForeground }]}>
        {exercise.promptScript ? 'What does this mean?' : 'Choose the correct Hindi word'}
      </Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={styles.optionsGrid}>
          {exercise.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                getOptionStyle(index),
                { borderColor: selected === index && state === 'idle' ? colors.primary : colors.border },
              ]}
              onPress={() => handleSelect(index)}
              activeOpacity={0.7}
            >
              {state !== 'idle' && selected === index && (
                <Ionicons
                  name={state === 'correct' ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={state === 'correct' ? colors.success : colors.destructive}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={[styles.optionText, { color: getOptionTextColor(index) }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {state !== 'idle' && (
        <View style={[
          styles.feedback,
          { backgroundColor: state === 'correct' ? '#F0FDF4' : '#FEF2F2', borderColor: state === 'correct' ? colors.success : colors.destructive }
        ]}>
          <Ionicons
            name={state === 'correct' ? 'checkmark-circle' : 'close-circle'}
            size={22}
            color={state === 'correct' ? colors.success : colors.destructive}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.feedbackTitle, { color: state === 'correct' ? colors.success : colors.destructive }]}>
              {state === 'correct' ? 'Shabash! 🎉' : 'Galat! Try again'}
            </Text>
            {state === 'wrong' && (
              <Text style={[styles.feedbackSub, { color: colors.mutedForeground }]}>
                Correct: {exercise.options[exercise.correctIndex]}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function WordOrderView({
  exercise,
  onAnswer,
}: {
  exercise: WordOrderExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const colors = useColors();
  const [available, setAvailable] = useState<string[]>([...exercise.words]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [state, setState] = useState<AnswerState>('idle');

  useEffect(() => {
    const shuffled = [...exercise.words].sort(() => Math.random() - 0.5);
    setAvailable(shuffled);
    setPlaced([]);
    setState('idle');
  }, [exercise.id]);

  const tapWord = useCallback((word: string, fromAvailable: boolean) => {
    if (state !== 'idle') return;
    if (fromAvailable) {
      setAvailable(prev => {
        const idx = prev.indexOf(word);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
      setPlaced(prev => [...prev, word]);
    } else {
      setPlaced(prev => {
        const idx = prev.indexOf(word);
        if (idx === -1) return prev;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
      setAvailable(prev => [...prev, word]);
    }
  }, [state]);

  const handleSubmit = useCallback(async () => {
    if (placed.length === 0 || state !== 'idle') return;
    const answer = placed.join(' ');
    const correct = answer === exercise.correctSentence;
    setState(correct ? 'correct' : 'wrong');

    if (Platform.OS !== 'web') {
      if (correct) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    setTimeout(() => onAnswer(correct), 1200);
  }, [placed, state, exercise.correctSentence, onAnswer]);

  return (
    <View style={styles.container}>
      <View style={styles.promptSection}>
        <Text style={[styles.promptText, { color: colors.foreground }]}>{exercise.instruction}</Text>
      </View>

      <View style={[styles.answerZone, { borderColor: state === 'correct' ? colors.success : state === 'wrong' ? colors.destructive : colors.border }]}>
        {placed.length === 0 ? (
          <Text style={[styles.placeholderText, { color: colors.mutedForeground }]}>Tap words to build your answer</Text>
        ) : (
          <View style={styles.wordRow}>
            {placed.map((word, i) => (
              <TouchableOpacity
                key={`${word}-${i}`}
                onPress={() => tapWord(word, false)}
                style={[styles.wordChip, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                disabled={state !== 'idle'}
              >
                <Text style={[styles.wordChipText, { color: '#fff' }]}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.wordBank}>
        <View style={styles.wordRow}>
          {available.map((word, i) => (
            <TouchableOpacity
              key={`${word}-${i}`}
              onPress={() => tapWord(word, true)}
              style={[styles.wordChip, { backgroundColor: colors.card, borderColor: colors.border }]}
              disabled={state !== 'idle'}
            >
              <Text style={[styles.wordChipText, { color: colors.foreground }]}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {state === 'idle' && (
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: placed.length > 0 ? colors.primary : colors.muted, opacity: pressed ? 0.8 : 1 }
          ]}
          disabled={placed.length === 0}
        >
          <Text style={[styles.submitBtnText, { color: placed.length > 0 ? '#fff' : colors.mutedForeground }]}>
            Check Answer
          </Text>
        </Pressable>
      )}

      {state !== 'idle' && (
        <View style={[
          styles.feedback,
          { backgroundColor: state === 'correct' ? '#F0FDF4' : '#FEF2F2', borderColor: state === 'correct' ? colors.success : colors.destructive }
        ]}>
          <Ionicons
            name={state === 'correct' ? 'checkmark-circle' : 'close-circle'}
            size={22}
            color={state === 'correct' ? colors.success : colors.destructive}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.feedbackTitle, { color: state === 'correct' ? colors.success : colors.destructive }]}>
              {state === 'correct' ? 'Shabash! 🎉' : 'Correct order:'}
            </Text>
            {state === 'wrong' && (
              <Text style={[styles.feedbackSub, { color: colors.mutedForeground }]}>{exercise.correctSentence}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default function ExerciseView({ exercise, onAnswer }: ExerciseViewProps) {
  const handleAnswer = useCallback((correct: boolean) => {
    onAnswer(correct, exercise.id);
  }, [exercise.id, onAnswer]);

  if (exercise.type === 'MULTIPLE_CHOICE') {
    return <MultipleChoiceView exercise={exercise} onAnswer={handleAnswer} />;
  }
  if (exercise.type === 'WORD_ORDER') {
    return <WordOrderView exercise={exercise} onAnswer={handleAnswer} />;
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  promptSection: {
    alignItems: 'center',
    paddingVertical: 24,
    minHeight: 120,
    justifyContent: 'center',
  },
  scriptText: {
    fontSize: 44,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  translitText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  promptText: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  instruction: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  optionsGrid: {
    gap: 12,
  },
  optionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 16,
  },
  feedbackTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  feedbackSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  answerZone: {
    minHeight: 64,
    borderWidth: 2,
    borderRadius: 14,
    borderStyle: 'dashed',
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordBank: {
    marginBottom: 20,
    minHeight: 48,
  },
  wordChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  wordChipText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
