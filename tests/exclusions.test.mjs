import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises, filterExercises, drawExercise, reconcileExercise } from '../src/exercises.ts';
import { createExclusionsRepository, createFavoritesRepository, EXCLUSIONS_KEY, FAVORITES_KEY } from '../src/favorites.ts';

const validIds = new Set(exercises.map(({ id }) => id));

function storageWithFavorites() {
  const values = new Map([[FAVORITES_KEY, JSON.stringify({ version: 1, ids: ['merkins', 'block-curls'] })]]);
  return {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => { values.set(key, value); },
  };
}

test('exclusions persist independently without changing existing favorites', async () => {
  const storage = storageWithFavorites();
  const favorites = createFavoritesRepository(storage, validIds);
  const exclusions = createExclusionsRepository(storage, validIds);
  assert.deepEqual(await exclusions.load(), []);
  const ids = await exclusions.toggle([], 'merkins');
  await exclusions.toggle(ids, 'block-curls');
  assert.deepEqual(await createExclusionsRepository(storage, validIds).load(), ['merkins', 'block-curls']);
  assert.deepEqual(await favorites.load(), ['merkins', 'block-curls']);
  await favorites.toggle(await favorites.load(), 'burpees');
  assert.deepEqual(await exclusions.load(), ['merkins', 'block-curls']);
  await exclusions.toggle(await exclusions.load(), 'merkins');
  await exclusions.toggle(await exclusions.load(), 'block-curls');
  assert.deepEqual(await createExclusionsRepository(storage, validIds).load(), []);
  assert.deepEqual(await favorites.load(), ['merkins', 'block-curls', 'burpees']);
});

test('failed exclusion saves preserve the prior saved list and can be retried', async () => {
  const storage = storageWithFavorites();
  let fail = false;
  const repo = createExclusionsRepository({
    getItem: storage.getItem,
    setItem: async (key, value) => { if (fail) throw new Error('Full'); await storage.setItem(key, value); },
  }, validIds);
  const saved = await repo.toggle([], 'merkins');
  fail = true;
  await assert.rejects(repo.toggle(saved, 'merkins'), /Full/);
  assert.deepEqual(saved, ['merkins']);
  assert.deepEqual(await repo.load(), ['merkins']);
  fail = false;
  assert.deepEqual(await repo.toggle(saved, 'merkins'), []);
});

test('malformed exclusion data is not overwritten and legacy/duplicate IDs are cleaned', async () => {
  for (const raw of ['{', 'null', '{"version":2,"ids":[]}', '{"version":1,"ids":[false]}']) {
    let writes = 0;
    const repo = createExclusionsRepository({
      getItem: async (key) => { assert.equal(key, EXCLUSIONS_KEY); return raw; },
      setItem: async () => { writes++; },
    }, validIds);
    await assert.rejects(repo.load());
    assert.equal(writes, 0);
  }
  const repo = createExclusionsRepository({
    getItem: async () => '{"version":1,"ids":["merkins","obsolete","merkins"]}',
    setItem: async () => {},
  }, validIds);
  assert.deepEqual(await repo.load(), ['merkins']);
  await assert.rejects(repo.toggle([], 'unknown'), /Unknown/);
});

test('exclusions override all equipment and favorite decks, including their last eligible card', () => {
  const favorites = ['merkins', 'burpees', 'block-curls'];
  const excluded = ['merkins', 'block-curls'];
  for (const equipment of ['all', 'bodyweight', 'block']) {
    for (const saved of [undefined, favorites]) {
      const deck = filterExercises(equipment, saved, excluded);
      assert.ok(deck.every(({ id }) => !excluded.includes(id)));
      assert.ok(deck.every(({ equipment: type }) => equipment === 'all' || type === equipment));
      assert.ok(deck.every(({ id }) => saved === undefined || saved.includes(id)));
      for (let i = 0; i < deck.length; i++) {
        assert.ok(!excluded.includes(drawExercise(undefined, () => (i + 0.5) / deck.length, deck).id));
      }
    }
  }
  assert.deepEqual(favorites, ['merkins', 'burpees', 'block-curls']);
  assert.equal(filterExercises('all', undefined, excluded).length, 34);
  assert.deepEqual(filterExercises('all', favorites, excluded).map(({ id }) => id), ['burpees']);
  const empty = filterExercises('all', undefined, [...validIds]);
  assert.deepEqual(empty, []);
  assert.equal(drawExercise(undefined, () => { throw new Error('Empty deck must not draw'); }, empty), undefined);
});

test('excluding the current card replaces or clears it; unrelated changes preserve its identity', () => {
  const current = exercises.find(({ id }) => id === 'merkins');
  assert.equal(reconcileExercise(current, filterExercises('all', undefined, ['burpees'])), current);
  const eligible = filterExercises('all', undefined, ['merkins']);
  assert.notEqual(reconcileExercise(current, eligible, current.id).id, current.id);
  assert.equal(reconcileExercise(current, filterExercises('bodyweight', ['merkins'], ['merkins'])), undefined);
  assert.equal(reconcileExercise(null, filterExercises('bodyweight', ['merkins'], [])), current);
});
