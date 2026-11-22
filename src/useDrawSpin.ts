import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';

export function useDrawSpin(onDraw: () => void, enabled: boolean, visible: boolean) {
  const [rotation] = useState(() => new Animated.Value(0));
  const [spinning, setSpinning] = useState(false);
  const mounted = useRef(false);
  const pending = useRef(false);
  const reducedMotion = useRef(true);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const draw = useRef(onDraw);

  useEffect(() => { draw.current = onDraw; }, [onDraw]);

  const finish = useCallback(() => {
    if (!mounted.current) return;
    animation.current = null;
    setSpinning(false);
    if (!pending.current) return;
    pending.current = false;
    draw.current();
  }, []);

  const cancel = useCallback(() => {
    // Clear the guard before stop(), which also calls the animation callback.
    pending.current = false;
    animation.current?.stop();
    animation.current = null;
  }, []);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    let changed = false;
    function updatePreference(reduce: boolean) {
      if (!active) return;
      reducedMotion.current = reduce;
      if (reduce && pending.current) {
        if (animation.current) animation.current.stop();
        else finish();
      }
    }
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (reduce) => {
      changed = true;
      updatePreference(reduce);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!changed) updatePreference(reduce);
    }).catch(() => { /* Keep the immediate-draw fallback if the preference is unavailable. */ });

    return () => {
      active = false;
      mounted.current = false;
      subscription?.remove();
      cancel();
    };
  }, [cancel, finish]);

  useEffect(() => {
    if (!pending.current) return;
    if (!enabled) {
      cancel();
      rotation.setValue(0);
    } else if (!visible) {
      // A resize or larger text can hide the dial while it is running.
      if (animation.current) animation.current.stop();
      else finish();
    }
  }, [cancel, enabled, finish, rotation, visible]);

  function start() {
    if (!enabled || pending.current) return;
    pending.current = true;
    if (reducedMotion.current || !visible) {
      finish();
      return;
    }
    rotation.setValue(0);
    setSpinning(true);
    animation.current = Animated.timing(rotation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    });
    // An interrupted animation should also reveal the requested workout;
    // cancel() prevents callbacks after unmount or when drawing becomes unavailable.
    animation.current.start(finish);
  }

  return { rotation, spinning, start };
}
