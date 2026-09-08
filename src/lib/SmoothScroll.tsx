import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

type Ctx = {
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  stop: () => void;
  start: () => void;
};

const noop = () => {};

const SmoothScrollContext = createContext<Ctx>({
  scrollTo: noop,
  stop: noop,
  start: noop,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Drives Lenis off the GSAP ticker so smooth scroll and ScrollTrigger stay on
 * the same clock. When reduced motion is on, Lenis is never created and the
 * browser's native scroll is used untouched — the context then falls back to
 * plain `window.scrollTo`.
 */
export function SmoothScrollProvider({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled: boolean;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Lenis drives the native window scroll, so ScrollTrigger needs no
    // scrollerProxy — only the update tap above.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  const value = useMemo<Ctx>(
    () => ({
      scrollTo: (target, offset = 0) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset });
          return;
        }
        if (typeof target === 'number') {
          window.scrollTo(0, target + offset);
          return;
        }
        const el =
          typeof target === 'string' ? document.querySelector(target) : target;
        if (el instanceof HTMLElement) {
          window.scrollTo(
            0,
            el.getBoundingClientRect().top + window.scrollY + offset,
          );
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
