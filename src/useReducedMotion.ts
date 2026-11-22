import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion() {
  // Keep everything immediate until the device preference is known.
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let active = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (reduce) => {
      changed = true;
      if (active) setReducedMotion(reduce);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (active && !changed) setReducedMotion(reduce);
    }).catch(() => { /* An unavailable preference keeps the immediate fallback. */ });

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return reducedMotion;
}
