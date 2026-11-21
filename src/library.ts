import type { EquipmentFilter, Exercise } from './exercises';
import { doseUnitLabel, type RepRange } from './repRanges.ts';

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

export type LibraryFilter = 'all' | 'favorites' | 'excluded';

/** Browsing includes excluded favorites so both preferences can be managed together. */
export function filterLibraryExercises(
  catalog: readonly Exercise[], filter: LibraryFilter, favoriteIds: readonly string[], excludedIds: readonly string[],
): readonly Exercise[] {
  if (filter === 'all') return catalog;
  const ids = filter === 'favorites' ? favoriteIds : excludedIds;
  return catalog.filter(({ id }) => ids.includes(id));
}

/** Search both F3 and everyday names, ignoring punctuation such as "push-ups". */
export function searchExercises(catalog: readonly Exercise[], query: string, equipment: EquipmentFilter = 'all'): Exercise[] {
  const terms = query.trim().split(/\s+/).map(normalize).filter(Boolean);
  return catalog.filter((exercise) => {
    if (equipment !== 'all' && exercise.equipment !== equipment) return false;
    const equipmentNames = exercise.equipment === 'block' ? 'block cinder block coupon' : 'bodyweight';
    const searchable = normalize(`${exercise.name} ${exercise.plainName} ${(exercise.aliases ?? []).join(' ')} ${exercise.category} ${equipmentNames}`);
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}

/** Preview the selected range without rolling a count until a workout is chosen. */
export function libraryDose(exercise: Exercise, range: RepRange | null): { count: string; unit: string } {
  if (exercise.unit === 'distance') return { count: 'Pick your distance', unit: '' };
  const count = range === null ? String(exercise.amount)
    : range.min === range.max ? String(range.min) : `${range.min}–${range.max}`;
  return { count, unit: doseUnitLabel(exercise.unit) };
}
