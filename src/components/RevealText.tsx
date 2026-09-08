import { useRef } from 'react';
import type { ElementType } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { splitLines } from '../lib/splitLines';

type Props = {
  as?: ElementType;
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** play on load instead of on scroll */
  immediate?: boolean;
  reduced: boolean;
};

/**
 * Per-line masked reveal. The wrapper clips; only the inner line is moved,
 * so the animation is transform + opacity only.
 */
export function RevealText({
  as: Tag = 'p',
  children,
  className,
  delay = 0,
  stagger = 0.08,
  immediate = false,
  reduced,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      let split = splitLines(el);

      const build = () => {
        gsap.set(split.lines, { yPercent: 108, opacity: 0 });
        gsap.to(split.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger,
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                },
              }),
        });
      };

      build();

      // re-split when the line breaks change
      let raf = 0;
      const onResize = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          split.revert();
          split = splitLines(el);
          gsap.set(split.lines, { yPercent: 0, opacity: 1 });
        });
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(raf);
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
