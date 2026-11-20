import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises } from '../src/exercises.ts';
import { countingText, parseRepRange, REP_PRESETS, repAmount } from '../src/repRanges.ts';

const merkins = exercises.find(({ id }) => id === 'merkins');

test('custom ranges accept fixed counts and both limits, rejecting invalid input', () => {
  for (const [min, max] of [['5', '100'], ['25', '25'], [' 30 ', '50']]) {
    assert.deepEqual(parseRepRange(min, max), { range: { min: Number(min), max: Number(max) }, error: null });
  }
  for (const [min, max] of [['', '20'], ['10', ''], ['0', '20'], ['1', '100'], ['5', '101'], ['50', '30'], ['-1', '20'], ['10.5', '20'], ['1e1', '20'], ['ten', '20'], ['12', '20'], ['10', '23'], ['37', '43']]) {
    const parsed = parseRepRange(min, max);
    assert.equal(parsed.range, null);
    assert.ok(parsed.error);
  }
});

test('rep ranges draw every multiple of five uniformly, including both endpoints', () => {
  for (const range of [...REP_PRESETS.filter(Boolean), { min: 5, max: 5 }, { min: 35, max: 45 }, { min: 100, max: 100 }]) {
    const size = (range.max - range.min) / 5 + 1;
    const results = Array.from({ length: size }, (_, i) => repAmount(merkins, range, () => (i + 0.5) / size));
    assert.deepEqual(results, Array.from({ length: size }, (_, i) => range.min + i * 5));
    assert.equal(repAmount(merkins, range, () => 0), range.min);
    assert.equal(repAmount(merkins, range, () => 1 - Number.EPSILON), range.max);
    for (let draw = 0; draw < 1000; draw++) {
      const amount = repAmount(merkins, range, () => draw / 1000);
      assert.equal(amount % 5, 0);
      assert.ok(amount >= range.min && amount <= range.max);
    }
  }
});

test('default restores each original dose and ranges never alter timers or the catalog', () => {
  const before = JSON.stringify(exercises);
  for (const exercise of exercises) {
    assert.equal(repAmount(exercise, null, () => { throw new Error('Default must not roll'); }), exercise.amount);
    if (exercise.unit === 'seconds') {
      assert.equal(repAmount(exercise, { min: 50, max: 100 }, () => { throw new Error('Timers must not roll'); }), exercise.amount);
    } else {
      assert.equal(repAmount(exercise, { min: 50, max: 100 }, () => 0), 50);
    }
  }
  assert.equal(JSON.stringify(exercises), before);
});

test('rep draws reject invalid ranges and random values', () => {
  for (const range of [{ min: 0, max: 20 }, { min: 50, max: 30 }, { min: 5, max: 101 }, { min: 1.5, max: 20 }, { min: 12, max: 20 }, { min: 10, max: 23 }]) {
    assert.throws(() => repAmount(merkins, range), RangeError);
  }
  for (const value of [-1, 1, NaN, Infinity]) {
    assert.throws(() => repAmount(merkins, { min: 10, max: 20 }, () => value), RangeError);
  }
});

test('counting instructions follow changed reps and explain uneven alternating totals', () => {
  const lunges = exercises.find(({ id }) => id === 'reverse-lunges');
  assert.equal(countingText({ ...lunges, amount: 30 }), 'Count each leg separately: 30 per side, 60 total.');
  const hammers = exercises.find(({ id }) => id === 'american-hammers');
  assert.equal(countingText({ ...hammers, amount: 30 }), 'Each side touch is 1 rep; 30 total (15 per side).');
  assert.equal(countingText({ ...hammers, amount: 35 }), 'Each side touch is 1 rep; 35 total (18 on the first side, 17 on the other).');
  for (const exercise of exercises) {
    assert.ok(!countingText(exercise).includes('{'), exercise.id);
    if (exercise.unit === 'seconds') continue;
    const numbers = countingText({ ...exercise, amount: 40 }).match(/\d+/g)?.map(Number) ?? [];
    assert.ok(numbers.every((number) => [1, 20, 40, 80].includes(number)), `Stale dose in ${exercise.id}`);
  }
});

test('new block cards apply rep ranges in fives while Rifle Carry retains its timer', () => {
  const range = { min: 20, max: 30 };
  for (const id of ['block-swings', 'man-makers', 'block-chest-press', 'skull-crushers', 'block-reverse-lunges', 'murder-bunnies', 'block-merkins']) {
    const exercise = exercises.find((item) => item.id === id);
    assert.equal(exercise.equipment, 'block');
    assert.deepEqual([0, 0.5, 0.99].map((random) => repAmount(exercise, range, () => random)), [20, 25, 30]);
    assert.ok(!countingText({ ...exercise, amount: 25 }).includes('{'));
  }
  const carry = exercises.find(({ id }) => id === 'rifle-carry');
  assert.equal(carry.unit, 'seconds');
  assert.equal(repAmount(carry, range), 20);
  const lunges = exercises.find(({ id }) => id === 'block-reverse-lunges');
  assert.equal(countingText({ ...lunges, amount: 25 }), 'Each backward lunge and return is 1 rep; 25 total (13 on the first side, 12 on the other).');
});
