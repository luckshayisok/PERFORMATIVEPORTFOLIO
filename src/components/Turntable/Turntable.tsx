import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import styles from './Turntable.module.css';

const FRAMES = 40;
const frameSrc = (i: number) =>
  `/turntable/crt-${String(i).padStart(3, '0')}.webp`;

/**
 * The machine from the hero, modelled in 3D and rendered as line art, one
 * frame per 9° of turn. Scrolling past it turns it.
 *
 * The frames are drawn to a canvas rather than swapped as <img> elements:
 * forty images toggling `display` thrashes layout, and a canvas lets the
 * scrub land on a frame that is already decoded.
 *
 * Nothing here is required to understand the section — under reduced
 * motion, or if the frames fail, the first frame simply stays put.
 */
export function Turntable({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const state = useRef({ frame: 0 });
  const [ready, setReady] = useState(false);

  // decode every frame once, then never touch the network again
  useEffect(() => {
    let cancelled = false;
    const loaded: HTMLImageElement[] = [];
    let done = 0;

    for (let i = 0; i < FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(i);
      img.onload = img.onerror = () => {
        done += 1;
        if (done === FRAMES && !cancelled) setReady(true);
      };
      loaded.push(img);
    }
    images.current = loaded;

    return () => {
      cancelled = true;
    };
  }, []);

  const draw = (index: number) => {
    const c = canvas.current;
    const img = images.current[index];
    if (!c || !img || !img.naturalWidth) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = c.clientWidth;
    if (c.width !== size * dpr) {
      c.width = size * dpr;
      c.height = size * dpr;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
  };

  useGSAP(
    () => {
      if (!ready) return;
      draw(0);
      if (reduced) return;

      const tween = gsap.to(state.current, {
        frame: FRAMES - 1,
        ease: 'none',
        snap: 'frame',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 0.5,
        },
        onUpdate: () => draw(Math.round(state.current.frame)),
      });

      const onResize = () => draw(Math.round(state.current.frame));
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope, dependencies: [ready, reduced] },
  );

  // the first frame refreshes measurements once the images settle
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <div ref={scope} className={styles.wrap}>
      <canvas
        ref={canvas}
        className={styles.canvas}
        role="img"
        aria-label="A cathode-ray monitor, drawn as line art, turning as the page scrolls."
      />
      <span className={styles.caption}>
        modelled, then drawn — {FRAMES} frames, 9° apart
      </span>
    </div>
  );
}
