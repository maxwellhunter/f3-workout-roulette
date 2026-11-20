import { useCallback, useEffect, useRef, useState } from 'react';
import type { createExerciseListRepository } from './savedExercises';

export type SavedListPhase = 'loading' | 'ready' | 'saving' | 'load-error' | 'save-error';
export type SavedExerciseList = ReturnType<typeof useSavedExercises>;

export function useSavedExercises(repository: ReturnType<typeof createExerciseListRepository>) {
  const [ids, setIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<SavedListPhase>('loading');
  const busy = useRef(false);
  const loaded = useRef(false);
  const latest = useRef<string[]>([]);
  const alive = useRef(true);

  const load = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    return repository.load().then((saved) => {
      if (alive.current) {
        latest.current = saved;
        loaded.current = true;
        setIds(saved);
        setPhase('ready');
      }
    }).catch(() => {
      if (alive.current) setPhase('load-error');
    }).finally(() => {
      busy.current = false;
    });
  }, [repository]);

  useEffect(() => {
    alive.current = true;
    void load();
    return () => { alive.current = false; };
  }, [load]);

  const toggle = useCallback(async (id: string): Promise<string[] | undefined> => {
    if (busy.current || !loaded.current) return undefined;
    busy.current = true;
    setPhase('saving');
    try {
      const saved = await repository.toggle(latest.current, id);
      if (!alive.current) return undefined;
      latest.current = saved;
      setIds(saved);
      setPhase('ready');
      return saved;
    } catch {
      // Preserve the last saved state if storage rejects the change.
      if (alive.current) setPhase('save-error');
      return undefined;
    } finally {
      busy.current = false;
    }
  }, [repository]);

  const reload = useCallback(() => {
    if (busy.current) return;
    setPhase('loading');
    return load();
  }, [load]);

  return { ids, phase, toggle, reload };
}
