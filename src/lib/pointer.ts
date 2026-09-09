/**
 * Unified pointer state. A single module-level snapshot is kept up to date by
 * global listeners and re-emitted to subscribers, so every effect (custom
 * cursor, magnetic/tilt/parallax, three.js scenes) reads from the same source.
 */
export type PointerSnapshot = {
  /** client coordinates */
  x: number;
  y: number;
  /** normalized -1..1 relative to the viewport center */
  nx: number;
  ny: number;
  /** velocity, px per 16.67ms frame */
  vx: number;
  vy: number;
  pressed: boolean;
  /** whether the pointer is over the window */
  over: boolean;
};

const snap: PointerSnapshot = {
  x: 0,
  y: 0,
  nx: 0,
  ny: 0,
  vx: 0,
  vy: 0,
  pressed: false,
  over: true,
};

let lastX = 0;
let lastY = 0;
let lastT = 0;
const subscribers = new Set<(s: PointerSnapshot) => void>();

function emit() {
  for (const fn of subscribers) fn(snap);
}

function track(event: PointerEvent) {
  const now = performance.now();
  if (lastT) {
    const dt = Math.max(8, now - lastT);
    snap.vx = ((event.clientX - lastX) / dt) * 16.67;
    snap.vy = ((event.clientY - lastY) / dt) * 16.67;
  }
  lastX = event.clientX;
  lastY = event.clientY;
  lastT = now;
  snap.x = event.clientX;
  snap.y = event.clientY;
  snap.nx = (event.clientX / window.innerWidth) * 2 - 1;
  snap.ny = (event.clientY / window.innerHeight) * 2 - 1;
  snap.pressed = (event.buttons & 1) === 1;
  snap.over = true;
  emit();
}

export function subscribePointer(fn: (s: PointerSnapshot) => void): () => void {
  subscribers.add(fn);
  fn(snap);
  return () => {
    subscribers.delete(fn);
  };
}

export function getPointer(): PointerSnapshot {
  return snap;
}

export const isFinePointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', track, { passive: true });
  window.addEventListener('pointerdown', track, { passive: true });
  window.addEventListener('pointerup', track, { passive: true });
  window.addEventListener('pointerleave', () => {
    snap.over = false;
    emit();
  });
  window.addEventListener('pointerenter', () => {
    snap.over = true;
    emit();
  });
}
