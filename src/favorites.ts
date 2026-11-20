import { createExerciseListRepository, type ExerciseListStorage } from './savedExercises.ts';
export { parseSavedExercises as parseFavorites } from './savedExercises.ts';
export type { ExerciseListStorage as FavoritesStorage } from './savedExercises.ts';

export const FAVORITES_KEY = 'f3-workout-roulette:favorites:v1';
export const EXCLUSIONS_KEY = 'f3-workout-roulette:exclusions:v1';

export function createFavoritesRepository(storage: ExerciseListStorage, validIds: ReadonlySet<string>) {
  return createExerciseListRepository(storage, validIds, FAVORITES_KEY);
}

export function createExclusionsRepository(storage: ExerciseListStorage, validIds: ReadonlySet<string>) {
  return createExerciseListRepository(storage, validIds, EXCLUSIONS_KEY);
}
