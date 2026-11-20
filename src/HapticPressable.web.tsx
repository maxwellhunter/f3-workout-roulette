import { useEffect, useRef, type ComponentRef } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { attachSwitchHaptics, usesSwitchHaptics, vibrateForTap } from './buttonHaptics';

export function HapticPressable({ onPress, disabled, ...props }: PressableProps) {
  const host = useRef<ComponentRef<typeof Pressable>>(null);
  const enabled = !disabled && !props.accessibilityState?.disabled
    && props.accessible !== false && props.accessibilityRole === 'button' && Boolean(onPress);

  useEffect(() => {
    const button = host.current as unknown as HTMLElement | null;
    if (!enabled || !button || !usesSwitchHaptics(navigator, 'switch' in document.createElement('input'))) return;
    return attachSwitchHaptics(button);
  }, [enabled]);

  return (
    <Pressable {...props} ref={host} disabled={disabled} onPress={(event) => {
      if (disabled || props.accessibilityState?.disabled) return;
      if (enabled) vibrateForTap(navigator);
      onPress?.(event);
    }} />
  );
}
