import assert from 'node:assert/strict';
import test from 'node:test';
import { exercises, filterExercises, knownExerciseIds } from '../src/exercises.ts';
import { FAVORITES_KEY, parseFavorites, createFavoritesRepository } from '../src/favorites.ts';

const valid = new Set(['merkins', 'burpees', 'arm-circles']);
function memoryStorage(initial = null) {
  let value = initial;
  return {
    async getItem(key) { assert.equal(key, FAVORITES_KEY); return value; },
    async setItem(key, next) { assert.equal(key, FAVORITES_KEY); value = next; },
  };
}

test('favorites survive a new repository instance and can be removed', async () => {
  const storage = memoryStorage();
  const first = createFavoritesRepository(storage, valid);
  assert.deepEqual(await first.load(), []);
  let ids = await first.toggle([], 'merkins');
  ids = await first.toggle(ids, 'burpees');
  const reloaded = createFavoritesRepository(storage, valid);
  assert.deepEqual(await reloaded.load(), ['merkins', 'burpees']);
  assert.deepEqual(await reloaded.toggle(ids, 'merkins'), ['burpees']);
  assert.deepEqual(await reloaded.load(), ['burpees']);
});

test('unknown IDs and duplicates in saved data are removed without reordering valid IDs', () => {
  assert.deepEqual(parseFavorites(JSON.stringify({ version: 1, ids: ['burpees', 'obsolete', 'burpees', 'merkins'] }), valid), ['burpees', 'merkins']);
});

test('malformed or future data is reported, never silently overwritten', async () => {
  for (const raw of ['{', 'null', '[]', '{"version":2,"ids":[]}', '{"version":1,"ids":[12]}']) {
    let writes = 0;
    const repo = createFavoritesRepository({ getItem: async () => raw, setItem: async () => { writes++; } }, valid);
    await assert.rejects(repo.load());
    assert.equal(writes, 0);
  }
});

test('load failure preserves storage and allows a later retry', async () => {
  let failing = true;
  let writes = 0;
  const repo = createFavoritesRepository({
    getItem: async () => { if (failing) throw new Error('Unavailable'); return '{"version":1,"ids":["merkins"]}'; },
    setItem: async () => { writes++; },
  }, valid);
  await assert.rejects(repo.load(), /Unavailable/);
  failing = false;
  assert.deepEqual(await repo.load(), ['merkins']);
  assert.equal(writes, 0);
});

test('failed save does not mutate caller state and can be retried', async () => {
  const original = ['merkins'];
  const storage = memoryStorage('{"version":1,"ids":["merkins"]}');
  let failing = true;
  const repo = createFavoritesRepository({
    getItem: storage.getItem,
    setItem: async (key, value) => { if (failing) throw new Error('Quota'); await storage.setItem(key, value); },
  }, valid);
  await assert.rejects(repo.toggle(original, 'burpees'), /Quota/);
  assert.deepEqual(original, ['merkins']);
  assert.deepEqual(await repo.load(), ['merkins']);
  failing = false;
  assert.deepEqual(await repo.toggle(original, 'burpees'), ['merkins', 'burpees']);
});

test('only valid exercise IDs can be saved; removing the last favorite persists an empty deck', async () => {
  const repo = createFavoritesRepository(memoryStorage(), valid);
  await assert.rejects(repo.toggle([], 'unknown'), /Unknown/);
  const ids = await repo.toggle([], 'merkins');
  assert.deepEqual(await repo.toggle(ids, 'merkins'), []);
  assert.deepEqual(await repo.load(), []);
});


test('catalog curation preserves retired preferences while only drawing active classics', async () => {
  const storage = memoryStorage('{"version":1,"ids":["merkins","hollow-hold"]}');
  const repo = createFavoritesRepository(storage, knownExerciseIds);
  const oldIds = await repo.load();
  assert.deepEqual(oldIds, ['merkins', 'hollow-hold']);
  await repo.toggle(oldIds, 'block-curl-hold');
  const reloaded = createFavoritesRepository(storage, knownExerciseIds);
  assert.deepEqual(await reloaded.load(), ['merkins', 'hollow-hold', 'block-curl-hold']);
  assert.deepEqual(filterExercises('all', await reloaded.load()).map(({ id }) => id), ['merkins']);
});

test('renamed classics retain favorites and exclusions under their original IDs', async () => {
  const storage = memoryStorage('{"version":1,"ids":["bicycle-crunches","pike-push-ups","wide-push-ups"]}');
  const repo = createFavoritesRepository(storage, knownExerciseIds);
  const saved = await repo.load();
  assert.deepEqual(filterExercises('bodyweight', saved).map(({ name }) => name), ['Freddie Mercury', 'Carolina Dry Docks', 'Werkins']);
  assert.ok(exercises.some(({ id }) => id === 'big-boy-sit-ups'));
  await repo.toggle(saved, 'big-boy-sit-ups');
  assert.ok((await repo.load()).includes('big-boy-sit-ups'));
  assert.deepEqual(filterExercises('bodyweight', saved, ['pike-push-ups']).map(({ id }) => id), ['bicycle-crunches', 'wide-push-ups']);
});

test('new block favorites persist and exclude correctly; restored coupon lunges keep their old ID', async () => {
  const storage = memoryStorage('{"version":1,"ids":["block-reverse-lunges","boxer-shuffle"]}');
  const repo = createFavoritesRepository(storage, knownExerciseIds);
  assert.deepEqual(await repo.load(), ['block-reverse-lunges', 'boxer-shuffle']);
  let ids = await repo.toggle(await repo.load(), 'block-swings');
  ids = await repo.toggle(ids, 'man-makers');
  assert.deepEqual(await createFavoritesRepository(storage, knownExerciseIds).load(), ids);
  assert.deepEqual(new Set(filterExercises('block', ids).map(({ id }) => id)), new Set(['block-reverse-lunges', 'block-swings', 'man-makers']));
  assert.deepEqual(new Set(filterExercises('block', ids, ['man-makers']).map(({ id }) => id)), new Set(['block-reverse-lunges', 'block-swings']));
});
