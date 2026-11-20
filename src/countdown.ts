export type Countdown = {
  durationMs: number;
  remainingMs: number;
  deadline: number | null;
  status: 'ready' | 'running' | 'paused' | 'complete';
};

export type CountdownAction = { type: 'start' | 'pause' | 'tick'; now: number };

export function createCountdown(seconds: number): Countdown {
  return { durationMs: seconds * 1000, remainingMs: seconds * 1000, deadline: null, status: 'ready' };
}

// Use elapsed time, not interval counts, so delayed/background ticks catch up.
export function countdownReducer(state: Countdown, action: CountdownAction): Countdown {
  if (action.type === 'start') {
    if (state.status === 'running') return state;
    const remainingMs = state.status === 'complete' ? state.durationMs : state.remainingMs;
    return { ...state, remainingMs, deadline: action.now + remainingMs, status: 'running' };
  }
  if (state.status !== 'running' || state.deadline === null) return state;
  const remainingMs = Math.max(0, Math.min(state.remainingMs, state.deadline - action.now));
  if (remainingMs === 0) return { ...state, remainingMs: 0, deadline: null, status: 'complete' };
  if (action.type === 'pause') return { ...state, remainingMs, deadline: null, status: 'paused' };
  return { ...state, remainingMs };
}
