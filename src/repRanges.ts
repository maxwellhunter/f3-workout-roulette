import type { Exercise } from './exercises';

export type RepRange = Readonly<{ min: number; max: number }>;
export const REP_STEP = 5;
export const MIN_REPS = REP_STEP;
export const MAX_REPS = 100;
export const REP_PRESETS: readonly (RepRange | null)[] = [
  null,
  { min: 10, max: 20 },
  { min: 20, max: 30 },
  { min: 30, max: 50 },
  { min: 50, max: 100 },
];

function isValidRange(range: RepRange): boolean {
  return Number.isInteger(range.min) && Number.isInteger(range.max)
    && range.min >= MIN_REPS && range.max <= MAX_REPS && range.min <= range.max
    && range.min % REP_STEP === 0 && range.max % REP_STEP === 0;
}

export function parseRepRange(minText: string, maxText: string):
  { range: RepRange; error: null } | { range: null; error: string } {
  if (!/^\d+$/.test(minText.trim()) || !/^\d+$/.test(maxText.trim())) {
    return { range: null, error: `Use multiples of ${REP_STEP} from ${MIN_REPS} to ${MAX_REPS}.` };
  }
  const range = { min: Number(minText), max: Number(maxText) };
  if (range.min < MIN_REPS || range.max > MAX_REPS || range.min > MAX_REPS || range.max < MIN_REPS) {
    return { range: null, error: `Choose ${MIN_REPS}–${MAX_REPS} reps.` };
  }
  if (range.min > range.max) {
    return { range: null, error: 'Minimum must be no higher than maximum.' };
  }
  if (range.min % REP_STEP !== 0 || range.max % REP_STEP !== 0) {
    return { range: null, error: `Use multiples of ${REP_STEP} (${REP_STEP}, ${REP_STEP * 2}, ${REP_STEP * 3}…).` };
  }
  return { range, error: null };
}

export function sameRepRange(a: RepRange | null, b: RepRange | null): boolean {
  return a === b || (a !== null && b !== null && a.min === b.min && a.max === b.max);
}

export function repRangeLabel(range: RepRange | null): string {
  return range === null ? 'Default' : range.min === range.max ? String(range.min) : `${range.min}–${range.max}`;
}

/** Roll only when drawing a card or applying a range; open-distance cards have no count. */
export function repAmount(exercise: Exercise, range: RepRange | null, random: () => number = Math.random): number | null {
  if (range === null || exercise.unit === 'distance') return exercise.amount;
  if (!isValidRange(range)) throw new RangeError(`Rep range must be ordered multiples of ${REP_STEP} from ${MIN_REPS} to ${MAX_REPS}.`);
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random value must be in [0, 1).');
  const choices = (range.max - range.min) / REP_STEP + 1;
  return range.min + Math.floor(value * choices) * REP_STEP;
}

/** Keep instructions aligned with the displayed count, including odd alternating totals. */
export function countingText(exercise: Exercise): string {
  if (exercise.unit === 'distance') return exercise.counting;
  const split = exercise.amount % 2 === 0
    ? `${exercise.amount / 2} per side`
    : `${Math.ceil(exercise.amount / 2)} on the first side, ${Math.floor(exercise.amount / 2)} on the other`;
  return exercise.counting.replaceAll('{amount}', String(exercise.amount))
    .replaceAll('{total}', String(exercise.amount * 2)).replaceAll('{split}', split);
}

/** Shared by the workout, Browse, and screen-reader announcements. */
export function doseUnitLabel(unit: Exercise['unit']): string {
  return {
    reps: 'reps',
    cadence: 'in cadence',
    'per side': 'reps / side',
    count: 'count hold',
    'count per side': 'count / side',
    steps: 'steps',
    distance: '',
  }[unit];
}
