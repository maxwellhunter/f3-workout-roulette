import { useCallback, useEffect, useRef, useState } from 'react';

export function useCompletionChime() {
  const context = useRef<AudioContext | null>(null);
  const active = useRef(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      if (context.current) void context.current.close().catch(() => {});
      context.current = null;
    };
  }, []);

  // Resume directly in the Start/Resume click so browser autoplay rules allow
  // the later completion sound without a second user interaction.
  const arm = useCallback(() => {
    setError(false);
    try {
      context.current ??= new AudioContext();
      void context.current.resume().catch(() => { if (active.current) setError(true); });
    } catch {
      setError(true);
    }
  }, []);

  const play = useCallback(async () => {
    const audio = context.current;
    if (!audio || audio.state !== 'running') {
      if (active.current) setError(true);
      return;
    }
    try {
      // Three short rising tones with attack/release envelopes to avoid clicks.
      [880, 1108.73, 1318.51].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + index * 0.34;
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.55, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(start);
        oscillator.stop(start + 0.31);
      });
    } catch {
      if (active.current) setError(true);
    }
  }, []);

  return { arm, play, error };
}
