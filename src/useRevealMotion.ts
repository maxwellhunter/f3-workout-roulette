import { useLayoutEffect, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';

export function useRevealMotion({ duration, reducedMotion, ready = true, replayKey }: {
  duration: number; reducedMotion: boolean; ready?: boolean; replayKey?: string;
}) {
  const [progress] = useState(() => new Animated.Value(reducedMotion ? 1 : 0));

  useLayoutEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    if (!ready) return;

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [duration, progress, ready, reducedMotion, replayKey]);

  return progress;
}
