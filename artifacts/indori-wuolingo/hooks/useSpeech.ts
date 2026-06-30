import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      Speech.stop();
    };
  }, []);

  const speak = useCallback((text: string, language = 'hi-IN') => {
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      language,
      pitch: 1,
      rate: 0.85,
      onDone: () => {
        if (mounted.current) {
          setIsSpeaking(false);
        }
      },
      onStopped: () => {
        if (mounted.current) {
          setIsSpeaking(false);
        }
      },
      onError: () => {
        if (mounted.current) {
          setIsSpeaking(false);
        }
      },
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop };
}
