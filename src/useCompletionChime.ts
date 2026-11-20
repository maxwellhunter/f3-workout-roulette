import { useCallback, useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

export function useCompletionChime() {
  const player = useAudioPlayer(require('../assets/audio/timer-complete.wav'));
  const active = useRef(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  const arm = useCallback(() => {
    setError(false);
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    }).catch(() => { if (active.current) setError(true); });
  }, []);

  const play = useCallback(async () => {
    try {
      await player.seekTo(0);
      if (active.current) player.play();
    } catch {
      if (active.current) setError(true);
    }
  }, [player]);

  // useAudioPlayer releases the native player (and stops playback) on a new card.
  return { arm, play, error };
}
