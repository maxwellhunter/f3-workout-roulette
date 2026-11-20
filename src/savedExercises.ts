export interface ExerciseListStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
}

export function parseSavedExercises(raw: string | null, validIds: ReadonlySet<string>): string[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1
    || !('ids' in value) || !Array.isArray(value.ids) || value.ids.some((id) => typeof id !== 'string')) {
    throw new Error('Unsupported saved exercise data');
  }
  return [...new Set(value.ids as string[])].filter((id) => validIds.has(id));
}

export function createExerciseListRepository(storage: ExerciseListStorage, validIds: ReadonlySet<string>, key: string) {
  return {
    async load(): Promise<string[]> {
      return parseSavedExercises(await storage.getItem(key), validIds);
    },
    async toggle(ids: readonly string[], id: string): Promise<string[]> {
      if (!validIds.has(id)) throw new Error('Unknown exercise');
      const next = ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id];
      // Only report success after durable storage accepts the change.
      await storage.setItem(key, JSON.stringify({ version: 1, ids: next }));
      return next;
    },
  };
}
