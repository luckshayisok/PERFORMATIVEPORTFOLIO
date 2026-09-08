import { useEffect, useRef } from 'react';
import styles from './Cover.module.css';

/**
 * The small halftone plate on the cover. An eye is drawn to an offscreen
 * canvas, then re-printed as a grid of dots whose radius tracks the darkness
 * underneath — the same way a newspaper screen works.
 *
 * It draws once on mount and once per resize. Nothing animates.
 */
export function HalftonePanel() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styleOf = getComputedStyle(canvas);
    const ink = styleOf.color;
    const paper = styleOf.backgroundColor;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // --- 1. draw the source artwork offscreen ---
      const src = document.createElement('canvas');
      src.width = w;
      src.height = h;
      const s = src.getContext('2d');
      if (!s) return;

      s.fillStyle = '#fff';
      s.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.54;
      const eyeW = w * 0.94;
      const eyeH = h * 0.36;

      // the eye opening, reused as both outline and clip
      const opening = () => {
        s.beginPath();
        s.moveTo(cx - eyeW / 2, cy);
        s.quadraticCurveTo(cx, cy - eyeH, cx + eyeW / 2, cy);
        s.quadraticCurveTo(cx, cy + eyeH * 0.82, cx - eyeW / 2, cy);
        s.closePath();
      };

      // iris and pupil, clipped so they cannot spill past the lids
      s.save();
      opening();
      s.clip();

      const r = eyeH * 0.82;
      s.fillStyle = 'rgba(0,0,0,0.48)';
      s.beginPath();
      s.arc(cx, cy - eyeH * 0.06, r, 0, Math.PI * 2);
      s.fill();

      s.fillStyle = '#000';
      s.beginPath();
      s.arc(cx, cy - eyeH * 0.06, r * 0.44, 0, Math.PI * 2);
      s.fill();

      s.fillStyle = '#fff';
      s.beginPath();
      s.arc(cx - r * 0.36, cy - eyeH * 0.06 - r * 0.38, r * 0.26, 0, Math.PI * 2);
      s.fill();
      s.restore();

      // lash line — heavier along the top lid
      s.strokeStyle = '#000';
      s.lineJoin = 'round';
      s.lineWidth = Math.max(2, h * 0.022);
      opening();
      s.stroke();

      s.lineWidth = Math.max(3, h * 0.05);
      s.beginPath();
      s.moveTo(cx - eyeW / 2, cy);
      s.quadraticCurveTo(cx, cy - eyeH, cx + eyeW / 2, cy);
      s.stroke();

      // brow, so the plate is not just a floating eye
      s.globalAlpha = 0.55;
      s.fillStyle = '#000';
      s.beginPath();
      s.ellipse(cx, cy - eyeH * 2.1, eyeW * 0.44, h * 0.045, -0.04, 0, Math.PI * 2);
      s.fill();
      s.globalAlpha = 1;

      // --- 2. re-print it as dots ---
      const data = s.getImageData(0, 0, w, h).data;
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = ink;

      const step = 3;
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const i = (Math.floor(y) * w + Math.floor(x)) * 4;
          const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
          const radius = (1 - lum) * (step * 0.62);
          if (radius < 0.25) continue;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    /* The plate is decoration, and re-printing ~1500 dots is enough work to
       show up in Total Blocking Time on a throttled phone. Push it past first
       paint so it never competes with the cover rendering. */
    type Idle = (cb: () => void) => number;
    const idle: Idle =
      (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback ??
      ((cb) => window.setTimeout(cb, 1));

    let ro: ResizeObserver | undefined;
    const handle = idle(() => {
      render();
      ro = new ResizeObserver(render);
      ro.observe(canvas);
    });

    return () => {
      window.clearTimeout(handle);
      (
        window as unknown as { cancelIdleCallback?: (h: number) => void }
      ).cancelIdleCallback?.(handle);
      ro?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={styles.halftoneCanvas} aria-hidden="true" />;
}
