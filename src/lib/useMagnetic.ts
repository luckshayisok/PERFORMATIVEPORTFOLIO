import { useEffect, useRef } from 'react';
import { gsap } from './gsap';

/**
 * Pulls an element a little way towards the pointer while it is hovered,
 * then springs it back. Transform only, and never attached on coarse
 * pointers or under reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(
  strength = 0.32,
  disabled = false,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    });

    return () => ctx.revert();
  }, [strength, disabled]);

  return ref;
}
