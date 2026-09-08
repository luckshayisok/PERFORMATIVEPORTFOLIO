import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import styles from './Cursor.module.css';

const INTERACTIVE = 'a[href], button, [data-cursor="hover"], input, textarea';

/**
 * A small ring that trails the pointer, scales up and inverts (mix-blend
 * difference) over anything interactive. Never mounted on touch or when
 * reduced motion is requested.
 */
export function Cursor({ enabled }: { enabled: boolean }) {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'power3' });
      const dxTo = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' });
      const dyTo = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' });

      let visible = false;

      const onMove = (e: PointerEvent) => {
        if (!visible) {
          visible = true;
          gsap.to([ringEl, dotEl], { autoAlpha: 1, duration: 0.25 });
        }
        xTo(e.clientX);
        yTo(e.clientY);
        dxTo(e.clientX);
        dyTo(e.clientY);
      };

      const onOver = (e: Event) => {
        const t = e.target as HTMLElement | null;
        if (t?.closest(INTERACTIVE)) {
          ringEl.classList.add(styles.isActive);
          gsap.to(ringEl, { scale: 2.4, duration: 0.35, ease: 'power3.out' });
        }
      };

      const onOut = (e: Event) => {
        const t = e.target as HTMLElement | null;
        if (t?.closest(INTERACTIVE)) {
          ringEl.classList.remove(styles.isActive);
          gsap.to(ringEl, { scale: 1, duration: 0.35, ease: 'power3.out' });
        }
      };

      const onLeave = () => {
        visible = false;
        gsap.to([ringEl, dotEl], { autoAlpha: 0, duration: 0.2 });
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, true);
      document.addEventListener('pointerout', onOut, true);
      document.addEventListener('pointerleave', onLeave);

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver, true);
        document.removeEventListener('pointerout', onOut, true);
        document.removeEventListener('pointerleave', onLeave);
      };
    });

    return () => ctx.revert();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={ring} className={styles.ring} />
      <div ref={dot} className={styles.dot} />
    </div>
  );
}
