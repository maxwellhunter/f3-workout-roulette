import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises } from '../src/exercises.ts';
import { filterLibraryExercises, libraryDose, searchExercises } from '../src/library.ts';

test('the library includes every workout alphabetically without changing the draw catalog', () => {
  const original = exercises.map(({ id }) => id);
  const results = searchExercises(exercises, '');
  assert.equal(results.length, 36);
  assert.equal(new Set(results.map(({ id }) => id)).size, 36);
  assert.deepEqual(results.map(({ name }) => name), [...exercises].map(({ name }) => name)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  assert.deepEqual(exercises.map(({ id }) => id), original);
  assert.equal(searchExercises(exercises, '', 'bodyweight').length, 22);
  assert.equal(searchExercises(exercises, '', 'block').length, 14);
});

test('search finds F3 names, everyday movement names, categories, and equipment aliases', () => {
  for (const query of ['MERKINS', 'pushups', ' push-ups ', 'push ups', 'upper body push']) {
    assert.ok(searchExercises(exercises, query).some(({ id }) => id === 'merkins'), query);
  }
  assert.equal(searchExercises(exercises, 'cinder block').length, 14);
  assert.equal(searchExercises(exercises, 'coupon').length, 14);
  assert.ok(searchExercises(exercises, 'core').every(({ category }) => category === 'Core'));
  assert.deepEqual(searchExercises(exercises, 'no-such-workout'), []);
  assert.equal(searchExercises(exercises, '  ').length, 36);
});

test('search and equipment filters intersect', () => {
  assert.ok(searchExercises(exercises, 'squat', 'block').length > 0);
  assert.ok(searchExercises(exercises, 'squat', 'block').every(({ equipment }) => equipment === 'block'));
  assert.ok(searchExercises(exercises, 'squat', 'bodyweight').every(({ equipment }) => equipment === 'bodyweight'));
  assert.deepEqual(searchExercises(exercises, 'coupon', 'bodyweight'), []);
});

test('Browse filters include all starred or excluded moves, including their overlap', () => {
  const favorites = ['merkins', 'block-curls', 'unknown', 'merkins'];
  const excluded = ['merkins', 'al-gore'];
  const before = JSON.stringify({ exercises, favorites, excluded });
  assert.equal(filterLibraryExercises(exercises, 'all', favorites, excluded).length, 36);
  assert.deepEqual(filterLibraryExercises(exercises, 'favorites', favorites, excluded).map(({ id }) => id), ['merkins', 'block-curls']);
  assert.deepEqual(new Set(filterLibraryExercises(exercises, 'excluded', favorites, excluded).map(({ id }) => id)), new Set(['merkins', 'al-gore']));
  assert.equal(JSON.stringify({ exercises, favorites, excluded }), before);
});

test('Browse preference filters intersect with search and equipment', () => {
  const favorites = filterLibraryExercises(exercises, 'favorites', ['merkins', 'block-curls'], ['merkins']);
  assert.deepEqual(searchExercises(favorites, 'pushups', 'bodyweight').map(({ id }) => id), ['merkins']);
  assert.deepEqual(searchExercises(favorites, 'curl', 'block').map(({ id }) => id), ['block-curls']);
  assert.deepEqual(searchExercises(favorites, 'pushups', 'block'), []);
  const excluded = filterLibraryExercises(exercises, 'excluded', [], ['merkins', 'block-curls']);
  assert.deepEqual(searchExercises(excluded, 'coupon', 'block').map(({ id }) => id), ['block-curls']);
});

test('removing the last favorite or restoring the last exclusion empties only that Browse filter', () => {
  assert.equal(filterLibraryExercises(exercises, 'favorites', ['merkins'], ['merkins']).length, 1);
  assert.deepEqual(filterLibraryExercises(exercises, 'favorites', [], ['merkins']), []);
  assert.equal(filterLibraryExercises(exercises, 'excluded', [], ['merkins']).length, 1);
  assert.deepEqual(filterLibraryExercises(exercises, 'excluded', ['merkins'], []), []);
  assert.equal(filterLibraryExercises(exercises, 'favorites', ['merkins'], []).length, 1);
  assert.equal(filterLibraryExercises(exercises, 'all', [], []).length, 36);
});

test('dose previews use the selected rep range and preserve timed and per-side units', () => {
  const merkins = exercises.find(({ id }) => id === 'merkins');
  const lunges = exercises.find(({ id }) => id === 'reverse-lunges');
  const sidePlank = exercises.find(({ id }) => id === 'side-plank');
  assert.deepEqual(libraryDose(merkins, null), { count: String(merkins.amount), unit: 'reps' });
  assert.deepEqual(libraryDose(merkins, { min: 20, max: 30 }), { count: '20–30', unit: 'reps' });
  assert.deepEqual(libraryDose(merkins, { min: 50, max: 50 }), { count: '50', unit: 'reps' });
  assert.deepEqual(libraryDose(lunges, { min: 20, max: 30 }), { count: '20–30', unit: 'reps / side' });
  assert.deepEqual(libraryDose(sidePlank, { min: 50, max: 100 }), { count: String(sidePlank.amount), unit: 'sec / side' });
  for (const exercise of exercises.filter(({ unit, id }) => unit === 'seconds' && id !== 'side-plank')) {
    assert.deepEqual(libraryDose(exercise, { min: 50, max: 100 }), { count: String(exercise.amount), unit: 'sec' });
  }
});

test('F3 titles and previous plain-English names both find the same saved movement', () => {
  for (const [id, title, query] of [
    ['pike-push-ups', 'Carolina Dry Docks', 'pike pushups'],
    ['wide-push-ups', 'Werkins', 'wide pushups'],
    ['bicycle-crunches', 'Freddie Mercury', 'bicycle crunches'],
    ['forearm-plank', 'Chilcutts', 'forearm plank'],
    ['block-curls', 'Curls for the Girls', 'block curls'],
  ]) {
    assert.equal(exercises.find((exercise) => exercise.id === id).name, title);
    for (const term of [title, query]) {
      assert.ok(searchExercises(exercises, term).some((exercise) => exercise.id === id));
    }
  }
  assert.ok(searchExercises(exercises, 'Freddy Mercury').some(({ id }) => id === 'bicycle-crunches'));
});

test('retired warm-ups stay out of Browse even when previously starred or excluded', () => {
  for (const filter of ['all', 'favorites', 'excluded']) {
    const catalog = filterLibraryExercises(exercises, filter, ['boxer-shuffle', 'merkins'], ['arm-circles']);
    assert.deepEqual(searchExercises(catalog, 'boxer'), []);
    assert.deepEqual(searchExercises(catalog, 'arm circles'), []);
  }
});

test('block movement aliases find one card without inflating its draw odds', () => {
  for (const query of ['Man Makers', 'manmaker', 'man-maker', 'Blockee', 'Blockees', 'Blockies']) {
    assert.deepEqual(searchExercises(exercises, query, 'block').map(({ id }) => id), ['man-makers']);
    assert.deepEqual(searchExercises(exercises, query, 'bodyweight'), []);
  }
  for (const [query, id] of [['coupon swings', 'block-swings'], ['kettlebell swing', 'block-swings'], ['triceps extensions', 'skull-crushers'], ['block pushups', 'block-merkins'], ['overhead carry', 'rifle-carry'], ['murder bunny', 'murder-bunnies'], ['weighted lunges', 'block-reverse-lunges']]) {
    assert.deepEqual(searchExercises(exercises, query, 'block').map((exercise) => exercise.id), [id]);
  }
});
