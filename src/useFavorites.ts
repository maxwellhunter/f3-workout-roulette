import AsyncStorage from '@react-native-async-storage/async-storage';
import { knownExerciseIds } from './exercises';
import { createExclusionsRepository, createFavoritesRepository } from './favorites';
import { useSavedExercises } from './useSavedExercises';

const favorites = createFavoritesRepository(AsyncStorage, knownExerciseIds);
const exclusions = createExclusionsRepository(AsyncStorage, knownExerciseIds);

export function useFavorites() { return useSavedExercises(favorites); }
export function useExclusions() { return useSavedExercises(exclusions); }
