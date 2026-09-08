import { createContext, useContext, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import { useSmoothScroll } from '../../lib/SmoothScroll';
import styles from './Transition.module.css';

type Ctx = { go: (to: string) => void };

const TransitionContext = createContext<Ctx>({ go: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const PANELS = 6;

/**
 * Cover wipe out → route change → scroll restored to top → wipe in.
 * With reduced motion the cover is skipped entirely and the route swaps.
 */
export function TransitionProvider({
  children,
  reduced,
}: {
  children: ReactNode;
  reduced: boolean;
}) {
  const navigate = useNavigate();
  const { scrollTo } = useSmoothScroll();
  const wrap = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const go = useCallback(
    (to: string) => {
      if (busy.current) return;

      if (reduced || !wrap.current) {
        navigate(to);
        window.scrollTo(0, 0);
        return;
      }

      busy.current = true;
      const panels = wrap.current.querySelectorAll(`.${styles.panel}`);

      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
        },
      });

      tl.set(wrap.current, { pointerEvents: 'auto' })
        .set(panels, { transformOrigin: 'bottom center', scaleY: 0 })
        .to(panels, {
          scaleY: 1,
          duration: 0.5,
          ease: 'power3.inOut',
          stagger: 0.04,
        })
        .add(() => {
          navigate(to);
          scrollTo(0);
          window.scrollTo(0, 0);
        })
        .set(panels, { transformOrigin: 'top center' })
        .to(panels, {
          scaleY: 0,
          duration: 0.5,
          ease: 'power3.inOut',
          stagger: 0.04,
          delay: 0.12,
        })
        .set(wrap.current, { pointerEvents: 'none' });
    },
    [navigate, reduced, scrollTo],
  );

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={wrap} className={styles.wrap} aria-hidden="true">
        {Array.from({ length: PANELS }, (_, i) => (
          <div key={i} className={styles.panel} />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}
