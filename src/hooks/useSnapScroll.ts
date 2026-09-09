import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Paged (snap) scrolling over an ordered list of sections: a wheel gesture or
 * keyboard page key moves exactly one section up/down, gliding smoothly to
 * that section's top. Wheel deltas are accumulated so a trackpad fling lands
 * on one page, and gestures are held while a glide is still settling.
 * `refs` are the section elements in document order; `offsets` optionally
 * adjusts each section's scroll target (px, e.g. -20 to clear the page top).
 * Reduced motion snaps instantly instead of gliding.
 *
 * The glide lock is fail-safe: `go()` skips no-op targets (already there —
 * e.g. at a boundary, which fires no scroll event), a fallback timer always
 * releases the lock, and mid-glide is detected by distance to the last target
 * so the wheel can never get stuck permanently.
 */
export function useSnapScroll(
  refs: RefObject<HTMLElement | null>[],
  offsets: number[] = [],
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const nodes = refs.map((r) => r.current).filter((n): n is HTMLElement => !!n);
    if (nodes.length === 0) return;

    const tops = () =>
      nodes.map((n, i) => n.getBoundingClientRect().top + window.scrollY + (offsets[i] ?? 0));

    const nearest = (list: number[]) => {
      const y = window.scrollY;
      let best = 0;
      for (let i = 1; i < list.length; i++) {
        if (Math.abs(list[i] - y) < Math.abs(list[best] - y)) best = i;
      }
      return best;
    };

    let animating = false;
    let lastTarget: number | null = null;
    let settleTimer = 0;
    let failSafeTimer = 0;
    let acc = 0;

    const go = (i: number) => {
      const list = tops();
      const c = Math.max(0, Math.min(list.length - 1, i));
      const target = list[c];
      // no-op if already there (e.g. scrolling past the last page): never set
      // the lock, otherwise no scroll event fires and the wheel would stick
      if (Math.abs(target - window.scrollY) < 1) {
        acc = 0;
        return;
      }
      animating = true;
      lastTarget = target;
      window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
      // safety net: release the lock even if no scroll event ever fires
      window.clearTimeout(failSafeTimer);
      failSafeTimer = window.setTimeout(() => {
        animating = false;
      }, 1600);
    };

    // release the glide lock shortly after scrolling settles
    const onScroll = () => {
      if (!animating) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        animating = false;
        lastTarget = null;
        window.clearTimeout(failSafeTimer);
      }, 160);
    };

    const onWheel = (e: WheelEvent) => {
      // hold input while a glide is in flight — either flagged or still far
      // from where we last aimed
      const gliding =
        animating || (lastTarget !== null && Math.abs(window.scrollY - lastTarget) > 60);
      if (gliding) {
        e.preventDefault(); // don't let the native scroll fight the glide
        return;
      }
      acc += e.deltaY;
      if (Math.abs(acc) < 50) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      e.preventDefault();
      go(nearest(tops()) + dir);
    };

    const onKey = (e: KeyboardEvent) => {
      let dir = 0;
      if (e.key === 'PageDown' || e.key === 'ArrowDown') dir = 1;
      else if (e.key === 'PageUp' || e.key === 'ArrowUp') dir = -1;
      else if (e.key === 'Home' || e.key === 'End') {
        // always swallow native paging — even mid-glide, where it would
        // otherwise cancel the smooth scroll and strand the page
        e.preventDefault();
        if (!animating) go(e.key === 'Home' ? 0 : tops().length - 1);
        return;
      }
      if (dir === 0) return;
      // Always preventDefault, including while a glide is in flight: key
      // repeat otherwise drives native scrolling that cancels the smooth
      // glide halfway (the wheel path already does this).
      e.preventDefault();
      if (animating) return;
      go(nearest(tops()) + dir);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(settleTimer);
      window.clearTimeout(failSafeTimer);
    };
  }, [refs, reduced, offsets]);
}
