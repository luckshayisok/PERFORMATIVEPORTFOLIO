import { useEffect, useRef } from 'react';
import styles from './GlyphField.module.css';

/** density ramp — sparse glyphs at low values, solid blocks at high */
const RAMP = ['·', ':', '-', '=', '+', '*', '/', 'X', '#', '█'];
const CELL = 16;
const FPS = 30;

/**
 * The hero centrepiece: a live monospace character field that ripples away
 * from the pointer while a slow scan wave travels through it.
 *
 * Everything is drawn to a single canvas, so it costs one composited layer
 * rather than hundreds of DOM nodes. It stops rendering entirely when
 * scrolled out of view, and paints one static frame under reduced motion.
 */
export function GlyphField({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // resolved rgb() values — see the note in GlyphField.module.css
    const styleOf = getComputedStyle(canvas);
    const fg = styleOf.color || '#ece7de';
    const accent = styleOf.outlineColor || '#ff4d1c';
    const monoStack =
      styleOf.getPropertyValue('--mono').trim() || 'monospace';

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = 0;
    let running = !reduced;
    const pointer = { x: -9999, y: -9999, active: false };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      ctx.font = `500 ${CELL - 4}px ${monoStack}`;
      ctx.textBaseline = 'top';
    };

    /** value in 0..1 for one cell */
    const fieldAt = (cx: number, cy: number, t: number) => {
      const x = cx / cols;
      const y = cy / rows;

      // two slow diagonal waves + a travelling scan band
      let v =
        0.5 +
        0.28 * Math.sin((x * 5.2 + y * 2.4 + t * 0.55) * Math.PI) +
        0.22 * Math.sin((x * -2.6 + y * 6.1 - t * 0.32) * Math.PI);

      const scan = ((t * 0.14) % 1.6) - 0.3;
      v += 0.34 * Math.exp(-Math.pow((y - scan) * 6, 2));

      // pointer pushes a ring outwards
      if (pointer.active) {
        const dx = cx * CELL + CELL / 2 - pointer.x;
        const dy = cy * CELL + CELL / 2 - pointer.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        v += 0.85 * Math.exp(-Math.pow(d / 130, 2));
        v -= 0.5 * Math.exp(-Math.pow((d - 150) / 90, 2));
      }
      return v;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // three passes so fillStyle is set three times, not once per cell
      const buckets: Array<{ style: string; cells: number[][] }> = [
        { style: fg, cells: [] },
        { style: fg, cells: [] },
        { style: accent, cells: [] },
      ];

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const v = fieldAt(cx, cy, t);
          if (v < 0.3) continue;
          const idx = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          const bucket = v > 1.05 ? 2 : v > 0.72 ? 1 : 0;
          buckets[bucket].cells.push([cx * CELL, cy * CELL, idx]);
        }
      }

      const alphas = [0.16, 0.42, 0.95];
      buckets.forEach((b, i) => {
        ctx.globalAlpha = alphas[i];
        ctx.fillStyle = b.style;
        b.cells.forEach(([x, y, idx]) => ctx.fillText(RAMP[idx], x, y));
      });
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now / 1000);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    // paint one frame synchronously so the panel is never empty — in a
    // background tab requestAnimationFrame is throttled to roughly 1Hz and
    // the first callback can be a second away
    draw(0.4);

    if (!reduced) {
      raf = requestAnimationFrame(loop);
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }

    const ro = new ResizeObserver(() => {
      resize();
      draw(0.4);
    });
    ro.observe(canvas);

    // stop burning frames once the hero is off screen
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
