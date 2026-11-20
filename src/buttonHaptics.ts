type HapticDevice = Pick<Navigator, 'userAgent' | 'platform' | 'maxTouchPoints'> & Partial<Pick<Navigator, 'vibrate'>>;
let nextSwitchId = 0;

export function usesSwitchHaptics(device: HapticDevice, switchSupported: boolean): boolean {
  return switchSupported && (
    /iPhone|iPad|iPod/.test(device.userAgent)
    || (device.platform === 'MacIntel' && device.maxTouchPoints > 1)
  );
}

/** Best effort only: feedback must never delay or prevent the button's action. */
export function vibrateForTap(device: Partial<Pick<Navigator, 'vibrate'>> | undefined): void {
  try {
    device?.vibrate?.(10);
  } catch {
    // Browser/device settings may block vibration even when the API exists.
  }
}

/**
 * iPhone Safari only gives switch feedback to a real tap on the switch/label.
 * Let that default action happen before forwarding a single click to Pressable.
 * An invisible switch under the finger would consume scrolling, so only its
 * label covers the button. Both remain outside the accessibility/tab order.
 */
export function attachSwitchHaptics(button: HTMLElement): () => void {
  const label = document.createElement('label');
  const input = document.createElement('input');
  label.dataset.tapHaptic = 'switch';
  label.setAttribute('aria-hidden', 'true');
  Object.assign(label.style, {
    position: 'absolute', inset: '0', borderRadius: 'inherit',
    touchAction: 'manipulation', cursor: 'inherit',
  });
  input.type = 'checkbox';
  input.id = `f3-tap-${++nextSwitchId}`;
  input.setAttribute('switch', '');
  input.setAttribute('aria-hidden', 'true');
  input.tabIndex = -1;
  label.htmlFor = input.id;
  Object.assign(input.style, {
    position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', margin: '0', visibility: 'hidden',
  });

  const enabled = () => button.isConnected && button.getAttribute('aria-disabled') !== 'true';
  label.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!enabled()) event.preventDefault();
  });
  input.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!enabled()) {
      event.preventDefault();
      return;
    }
    // The forwarded click runs the existing handler once, including audio unlock.
    button.click();
  });
  // Keep the switch alive through its default action even if the tap closes a
  // sheet or replaces the whole card. Removing it with the button can lose feedback.
  document.body.append(input);
  button.append(label);
  return () => {
    label.remove();
    setTimeout(() => input.remove(), 0);
  };
}
