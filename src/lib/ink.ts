/* ============================================================
   THE INK ENGINE
   Every drawing on this site comes out of here: the machines in the
   hero and the plate on each project. Shapes go in as plain point
   lists; what comes out is an outline that wobbles like a pen and
   cross-hatch shading clipped to the shape.

   Everything is seeded, so a drawing is identical on every render,
   on the server, and between reloads — no drawing ever "jumps".
   ============================================================ */

export type Rng = () => number;

/** xorshift32 — small, fast, and the same sequence for the same seed. */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/** Turn a slug into a seed, so each project always draws its own plate. */
export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Pt = [number, number];

export const INK = '#121110';
export const PAPER = '#faf8f4';

/* ---------- shapes ---------- */

export function rectPts(x: number, y: number, w: number, h: number): Pt[] {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
}

/** A rectangle with its corners cut — reads as moulded plastic. */
export function chamferPts(
  x: number,
  y: number,
  w: number,
  h: number,
  c: number,
): Pt[] {
  return [
    [x + c, y],
    [x + w - c, y],
    [x + w, y + c],
    [x + w, y + h - c],
    [x + w - c, y + h],
    [x + c, y + h],
    [x, y + h - c],
    [x, y + c],
  ];
}

export function circlePts(cx: number, cy: number, r: number, n = 26): Pt[] {
  const p: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return p;
}

export function rotatePts(pts: Pt[], cx: number, cy: number, t: number): Pt[] {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return pts.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * c - dy * s, cy + dx * s + dy * c] as Pt;
  });
}

/* ---------- strokes ---------- */

/**
 * Resample a point list at a fixed step and nudge every sample off the
 * true line. A straight edge drawn this way reads as drawn rather than
 * printed, which is the whole point of the house style.
 */
export function inkPath(
  pts: Pt[],
  rng: Rng,
  { amp = 2.1, step = 9, close = false } = {},
): string {
  const out: Pt[] = [];
  const n = pts.length;
  const last = close ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const steps = Math.max(1, Math.round(len / step));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      out.push([
        a[0] + (b[0] - a[0]) * t + (rng() - 0.5) * amp,
        a[1] + (b[1] - a[1]) * t + (rng() - 0.5) * amp,
      ]);
    }
  }
  if (!close) out.push(pts[n - 1]);
  const d = `M${out.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}`;
  return close ? `${d}Z` : d;
}

/**
 * Parallel strokes across a box at an angle, returned as ONE path.
 * Shading a shape costs a single node this way instead of forty.
 */
export function hatchPath(
  x: number,
  y: number,
  w: number,
  h: number,
  angle: number,
  gap: number,
  rng: Rng,
): string {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const R = Math.hypot(w, h) / 2 + 6;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  let d = '';
  for (let t = -R; t <= R; t += gap) {
    const mx = cx - sa * t;
    const my = cy + ca * t;
    const j1 = (rng() - 0.5) * 1.6;
    const j2 = (rng() - 0.5) * 1.6;
    d +=
      `M${(mx - ca * R + j1).toFixed(1)} ${(my - sa * R + j1).toFixed(1)}` +
      `L${(mx + ca * R + j2).toFixed(1)} ${(my + sa * R + j2).toFixed(1)}`;
  }
  return d;
}

/* ---------- the builder ----------
   Collects markup into three buckets. `behind` is painted before the
   wordmark and `front` after it, which is how the machines end up
   leaning on the letters. */

export type Shade = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** hatch angle in radians; the default leans the way a right hand does */
  a?: number;
  gap?: number;
  /** add a second pass at 77° to it for a darker, denser tone */
  cross?: boolean;
  sw?: number;
  o?: number;
};

export class Ink {
  readonly rng: Rng;
  private defs: string[] = [];
  private layers: Record<'behind' | 'front', string[]> = {
    behind: [],
    front: [],
  };
  private id = 0;
  private prefix: string;

  constructor(seed: number, prefix = 'k') {
    this.rng = makeRng(seed);
    this.prefix = prefix;
  }

  /** A solid object: paper body, inked outline, optional hatch inside. */
  shape(
    layer: 'behind' | 'front',
    pts: Pt[],
    opts: { shade?: Shade; stroke?: number; fill?: boolean; amp?: number } = {},
  ) {
    const id = `${this.prefix}${++this.id}`;
    const d = inkPath(pts, this.rng, { close: true, amp: opts.amp });
    this.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);

    let g = '<g>';
    if (opts.fill !== false) g += `<path d="${d}" fill="${PAPER}"/>`;
    if (opts.shade) {
      const s = opts.shade;
      const a = s.a ?? -0.62;
      const gap = s.gap ?? 7;
      g +=
        `<g clip-path="url(#${id})" stroke="${INK}" stroke-width="${s.sw ?? 1.5}" ` +
        `stroke-linecap="round" fill="none" opacity="${s.o ?? 0.95}">` +
        `<path d="${hatchPath(s.x, s.y, s.w, s.h, a, gap, this.rng)}"/>` +
        (s.cross
          ? `<path d="${hatchPath(s.x, s.y, s.w, s.h, a + 1.35, gap * 1.25, this.rng)}"/>`
          : '') +
        '</g>';
    }
    g +=
      `<path d="${d}" fill="none" stroke="${INK}" ` +
      `stroke-width="${opts.stroke ?? 3.2}" stroke-linejoin="round"/></g>`;
    this.layers[layer].push(g);
  }

  /** An open or closed stroke with no fill. */
  line(
    layer: 'behind' | 'front',
    pts: Pt[],
    width = 2.6,
    close = false,
    opacity?: number,
  ) {
    const d = inkPath(pts, this.rng, { close, amp: 1.8, step: 10 });
    this.layers[layer].push(
      `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${width}" ` +
        `stroke-linecap="round" stroke-linejoin="round"` +
        (opacity != null ? ` opacity="${opacity}"` : '') +
        '/>',
    );
  }

  /** Three crossed strokes. A drawn one always beats a font glyph here. */
  spark(layer: 'behind' | 'front', cx: number, cy: number, r: number, w = 3) {
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3 + 0.2;
      this.line(
        layer,
        [
          [cx - Math.cos(a) * r, cy - Math.sin(a) * r],
          [cx + Math.cos(a) * r, cy + Math.sin(a) * r],
        ],
        w,
      );
    }
  }

  /** Raw markup, for the few things the helpers do not cover. */
  raw(layer: 'behind' | 'front', markup: string) {
    this.layers[layer].push(markup);
  }

  get markup() {
    return {
      defs: this.defs.join(''),
      behind: this.layers.behind.join(''),
      front: this.layers.front.join(''),
    };
  }
}
