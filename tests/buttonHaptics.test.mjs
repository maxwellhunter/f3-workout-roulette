import assert from 'node:assert/strict';
import test from 'node:test';
import { usesSwitchHaptics, vibrateForTap } from '../src/buttonHaptics.ts';

test('switch feedback is limited to supported iOS devices', () => {
  const iphone = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone', maxTouchPoints: 5 };
  assert.equal(usesSwitchHaptics(iphone, true), true);
  assert.equal(usesSwitchHaptics(iphone, false), false);
  assert.equal(usesSwitchHaptics({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 5 }, true), true);
  assert.equal(usesSwitchHaptics({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 0 }, true), false);
  assert.equal(usesSwitchHaptics({ userAgent: 'Mozilla/5.0 (Linux; Android)', platform: 'Linux', maxTouchPoints: 5 }, true), false);
});

test('supported vibration is one brief pulse with its navigator receiver intact', () => {
  const calls = [];
  const device = { vibrate(duration) { assert.equal(this, device); calls.push(duration); return true; } };
  vibrateForTap(device);
  assert.deepEqual(calls, [10]);
});

test('missing, denied, or throwing vibration cannot break the button action', () => {
  let actions = 0;
  for (const device of [undefined, {}, { vibrate: () => false }, { vibrate() { throw new Error('blocked'); } }]) {
    assert.doesNotThrow(() => { vibrateForTap(device); actions += 1; });
  }
  assert.equal(actions, 4);
});
