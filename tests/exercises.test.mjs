import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { DEFAULT_EQUIPMENT_FILTER, drawExercise, exercises, filterExercises, knownExerciseIds, reconcileExercise } from '../src/exercises.ts';

test('deck has 36 unique, fully described exercises with positive doses', () => {
  assert.equal(exercises.length, 36);
  assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, 36);
  assert.equal(new Set(exercises.map((exercise) => exercise.category)).size, 5);
  for (const exercise of exercises) {
    assert.ok(['bodyweight', 'block'].includes(exercise.equipment));
    assert.ok(exercise.name && exercise.plainName && exercise.description);
    assert.ok(exercise.description.length <= 150);
    assert.equal(exercise.steps.length, 3);
    assert.ok(exercise.steps.every((step) => step.length > 20));
    assert.ok(exercise.counting.length > 15);
    assert.ok(Number.isInteger(exercise.amount) && exercise.amount > 0);
    if (exercise.unit !== 'seconds') assert.equal(exercise.amount % 5, 0, `${exercise.id} must use reps in fives`);
    assert.ok(['reps', 'seconds', 'per side'].includes(exercise.unit));
  }
});

test('every card is reachable on the first draw, including both range edges', () => {
  const drawn = exercises.map((_, index) => drawExercise(undefined, () => (index + 0.5) / exercises.length).id);
  assert.deepEqual(drawn, exercises.map((exercise) => exercise.id));
  assert.equal(drawExercise(undefined, () => 0).id, exercises[0].id);
  assert.equal(drawExercise(undefined, () => 1 - Number.EPSILON).id, exercises.at(-1).id);
});

test('every previous card excludes itself and allows each other card exactly once', () => {
  for (const previous of exercises) {
    const draws = Array.from({ length: exercises.length - 1 }, (_, index) => drawExercise(previous.id, () => (index + 0.5) / (exercises.length - 1)).id);
    assert.ok(!draws.includes(previous.id));
    assert.equal(new Set(draws).size, exercises.length - 1);
  }
});

test('a long draw sequence never repeats consecutively', () => {
  let previous;
  for (let i = 0; i < 10000; i++) {
    const next = drawExercise(previous);
    assert.notEqual(next.id, previous);
    previous = next.id;
  }
});

test('invalid random values fail clearly instead of returning an empty card', () => {
  for (const value of [-1, 1, NaN, Infinity]) {
    assert.throws(() => drawExercise(undefined, () => value), RangeError);
  }
});


test('classics retire warm-ups while keeping historical preference IDs valid', () => {
  const bodyweightIds = JSON.parse(readFileSync(new URL('./bodyweight-ids.json', import.meta.url)));
  assert.ok(bodyweightIds.every((id) => knownExerciseIds.has(id)));
  const retired = ['boxer-shuffle', 'side-straddle-hops', 'arm-circles', 'high-knees', 'butt-kicks', 'step-jacks', 'front-clap-jacks', 'inchworms', 'pogo-hops', 'standing-cross-knees', 'prone-y-raises', 'block-march'];
  for (const id of retired) {
    assert.ok(knownExerciseIds.has(id));
    assert.ok(!exercises.some((exercise) => exercise.id === id));
    assert.deepEqual(filterExercises('all', [id]), []);
  }
  assert.equal(new Set(exercises.map((exercise) => exercise.name.toLowerCase())).size, exercises.length);
});

test('favorite decks handle zero, one, and two cards without escaping the deck', () => {
  assert.equal(drawExercise(undefined, () => 0, []), undefined);
  const [a, b] = exercises;
  assert.equal(drawExercise(a.id, () => 0, [a]), a);
  assert.equal(drawExercise(a.id, () => 0.99, [a, b]), b);
  assert.equal(drawExercise(b.id, () => 0, [a, b]), a);
  assert.equal(drawExercise('not-in-this-deck', () => 0, [a]), a);
});


test('equipment filter defaults to bodyweight and partitions the complete catalog', () => {
  assert.equal(DEFAULT_EQUIPMENT_FILTER, 'bodyweight');
  assert.equal(filterExercises('bodyweight').length, 22);
  assert.equal(filterExercises('block').length, 14);
  assert.deepEqual(filterExercises('all'), exercises);
  for (const equipment of ['bodyweight', 'block']) {
    assert.ok(filterExercises(equipment).every((exercise) => exercise.equipment === equipment));
  }
});

test('favorites intersect equipment without modifying saved IDs', () => {
  const ids = ['merkins', 'block-rows', 'block-deadlifts'];
  assert.deepEqual(filterExercises('bodyweight', ids).map(({ id }) => id), ['merkins']);
  assert.deepEqual(filterExercises('block', ids).map(({ id }) => id), ['block-rows', 'block-deadlifts']);
  assert.equal(filterExercises('all', ids).length, 3);
  assert.deepEqual(filterExercises('block', ['merkins']), []);
  assert.deepEqual(filterExercises('all', []), []);
  assert.deepEqual(ids, ['merkins', 'block-rows', 'block-deadlifts']);
});

test('filter transitions retain eligible cards, replace excluded cards, and clear empty decks', () => {
  const body = exercises.find(({ id }) => id === 'forearm-plank');
  const block = exercises.find(({ id }) => id === 'block-deadlifts');
  assert.equal(reconcileExercise(body, filterExercises('all'), body.id), body);
  assert.equal(reconcileExercise(block, filterExercises('block'), block.id), block);
  assert.equal(reconcileExercise(body, filterExercises('block'), body.id, () => 0).equipment, 'block');
  assert.equal(reconcileExercise(block, filterExercises('bodyweight'), block.id, () => 0).equipment, 'bodyweight');
  assert.equal(reconcileExercise(block, filterExercises('block', ['merkins']), block.id), undefined);
  assert.equal(reconcileExercise(null, [block], body.id), block);
});

test('draws never escape any filtered deck or repeat when an alternative exists', () => {
  const favorites = ['merkins', 'al-gore', 'block-rows', 'block-deadlifts'];
  for (const equipment of ['all', 'bodyweight', 'block']) {
    for (const saved of [undefined, favorites]) {
      const deck = filterExercises(equipment, saved);
      for (const previous of deck) {
        for (let index = 0; index < deck.length - 1; index++) {
          const next = drawExercise(previous.id, () => (index + 0.5) / (deck.length - 1), deck);
          assert.ok(deck.includes(next));
          assert.notEqual(next.id, previous.id);
        }
      }
    }
  }
});
