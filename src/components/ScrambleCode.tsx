import { useEffect, useRef } from 'react';
import { scrambleTo } from '../lib/scramble';

type Props = {
  text: string;
  className?: string;
  /** run once when the element scrolls into view */
  onView?: boolean;
  /** re-run whenever the nearest [data-scramble-host] is hovered */
  onHover?: boolean;
  delay?: number;
  reduced: boolean;
};

/**
 * A monospace code that resolves out of random glyphs. Length never changes,
 * so it cannot shift layout.
 */
export function ScrambleCode({
  text,
  className,
  onView = true,
  onHover = false,
  delay = 0,
  reduced,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let stop: (() => void) | undefined;
    const run = () => {
      stop?.();
      stop = scrambleTo(el, text, { delay });
    };

    const cleanups: Array<() => void> = [];

    if (onView) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              run();
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      io.observe(el);
      cleanups.push(() => io.disconnect());
    }

    if (onHover) {
      const host = el.closest<HTMLElement>('[data-scramble-host]') ?? el;
      host.addEventListener('pointerenter', run);
      cleanups.push(() => host.removeEventListener('pointerenter', run));
    }

    return () => {
      cleanups.forEach((c) => c());
      stop?.();
    };
  }, [text, delay, onView, onHover, reduced]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
