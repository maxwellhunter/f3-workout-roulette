import assert from 'node:assert/strict';
import test from 'node:test';
import { countdownReducer as reduce, createCountdown } from '../src/countdown.ts';

test('a new card waits for Start, even when ticks arrive', () => {
  const ready = createCountdown(30);
  assert.equal(ready.status, 'ready');
  assert.equal(reduce(ready, { type: 'tick', now: 10000 }), ready);
  assert.equal(ready.remainingMs, 30000);
});

test('pause freezes exact remaining time; resume excludes paused time', () => {
  let timer = reduce(createCountdown(30), { type: 'start', now: 1000 });
  timer = reduce(timer, { type: 'pause', now: 4250 });
  assert.equal(timer.status, 'paused');
  assert.equal(timer.remainingMs, 26750);
  assert.equal(reduce(timer, { type: 'tick', now: 50000 }), timer);
  timer = reduce(timer, { type: 'start', now: 60000 });
  timer = reduce(timer, { type: 'tick', now: 61750 });
  assert.equal(timer.remainingMs, 25000);
});

test('delayed/background ticks catch up, finish at zero, and stop', () => {
  let timer = reduce(createCountdown(20), { type: 'start', now: 1000 });
  timer = reduce(timer, { type: 'tick', now: 15000 });
  assert.equal(timer.remainingMs, 6000);
  timer = reduce(timer, { type: 'tick', now: 90000 });
  assert.equal(timer.remainingMs, 0);
  assert.equal(timer.status, 'complete');
  assert.equal(timer.deadline, null);
  assert.equal(reduce(timer, { type: 'tick', now: 100000 }), timer);
});

test('restart after completion uses the full duration', () => {
  let timer = reduce(createCountdown(20), { type: 'start', now: 1000 });
  timer = reduce(timer, { type: 'tick', now: 21000 });
  timer = reduce(timer, { type: 'start', now: 30000 });
  assert.equal(timer.remainingMs, 20000);
  assert.equal(timer.deadline, 50000);
  assert.equal(timer.status, 'running');
});

test('duplicate starts do not extend a running timer; pausing at expiry completes', () => {
  const timer = reduce(createCountdown(20), { type: 'start', now: 0 });
  assert.equal(reduce(timer, { type: 'start', now: 4000 }), timer);
  assert.equal(reduce(timer, { type: 'pause', now: 20000 }).status, 'complete');
});
