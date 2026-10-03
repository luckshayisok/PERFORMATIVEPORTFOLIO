/* ============================================================
   PLATES
   One drawing per project, plotted from that project's own numbers:
   how many commits are in its repository, how many tools it is built
   from, how many things it does. Change the data and the drawing
   changes with it — that is the only reason these are here.

   Same ink, same seeded randomness as the hero; only the pen is
   finer, the way a plotter draws against a drawn illustration.
   ============================================================ */

import { hashSeed, inkPath, makeRng, type Pt, type Rng, INK } from './ink';

export type PlateKind = 'weave' | 'orbits' | 'strata' | 'graph';

export type PlateFacts = {
  /** commits in the repository, where there is a public one */
  commits?: number;
  /** tools in the stack */
  tools: number;
  /** things the project does */
  notes: number;
};

const SIZE = 320;

/** Strokes are bucketed by opacity so a whole drawing is a few nodes. */
type Bucket = { d: string; o: number; w: number };

function paths(buckets: Bucket[]): string {
  return buckets
    .filter((b) => b.d)
    .map(
      (b) =>
        `<path d="${b.d}" fill="none" stroke="${INK}" stroke-width="${b.w}" ` +
        `stroke-linecap="round" opacity="${b.o}"/>`,
    )
    .join('');
}

/* ---------- 1. weave ----------
   A flow field: every stroke follows the same smooth angle field, and a
   ring of emphasis makes a form rise out of the weave. Density is the
   project's commit count, so a project with more history is denser. */

function weave(rng: Rng, facts: PlateFacts): string {
  const W = SIZE;
  const R = W * 0.3;
  const SIG = W * 0.15;
  const BUCKETS = 6;
  const lines = Math.round(170 + Math.min(facts.commits ?? facts.notes * 4, 40) * 5);

  const angle = (x: number, y: number) => {
    const u = (x / W) * 3.1;
    const v = (y / W) * 3.1;
    return (
      (Math.sin(u * 1.7 + Math.cos(v * 2.3) * 1.4) +
        Math.sin(v * 1.1 - Math.cos(u * 0.7) * 2.1) * 0.8) *
      Math.PI
    );
  };

  const groups: string[] = Array.from({ length: BUCKETS }, () => '');
  for (let i = 0; i < lines; i++) {
    let x = rng() * W;
    let y = rng() * W;
    const d0 = Math.hypot(x - W / 2, y - W / 2);
    const a = 0.1 + 0.52 * Math.exp(-((d0 - R) * (d0 - R)) / (2 * SIG * SIG));
    const bi = Math.min(BUCKETS - 1, Math.round(((a - 0.1) / 0.52) * (BUCKETS - 1)));
    let seg = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    for (let s = 0; s < 44; s++) {
      const th = angle(x, y);
      x += Math.cos(th) * 2.6;
      y += Math.sin(th) * 2.6;
      if (x < -10 || x > W + 10 || y < -10 || y > W + 10) break;
      seg += `L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    groups[bi] += seg;
  }

  const out = groups.map((d, g) => ({
    d,
    o: Number((0.1 + (g / (BUCKETS - 1)) * 0.52).toFixed(3)),
    w: 0.7,
  }));
  return (
    paths(out) +
    `<circle cx="${W / 2}" cy="${W / 2}" r="${R.toFixed(1)}" fill="none" ` +
    `stroke="${INK}" stroke-width="0.9" opacity="0.5"/>`
  );
}

/* ---------- 2. orbits ----------
   One ring per commit, each one pulled out of true by the field it sits
   in. A young repository draws a sparse plate; a worked-on one fills. */

function orbits(rng: Rng, facts: PlateFacts): string {
  const C = SIZE / 2;
  const rings = Math.max(6, Math.min(facts.commits ?? facts.notes * 3, 34));
  let d = '';
  for (let i = 0; i < rings; i++) {
    const t = (i + 1) / rings;
    const r = 18 + t * (C - 26);
    const wob = 3 + t * 9;
    const phase = rng() * Math.PI * 2;
    const lobes = 2 + Math.floor(rng() * 3);
    const pts: Pt[] = [];
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2;
      const rr = r + Math.sin(a * lobes + phase) * wob;
      pts.push([C + Math.cos(a) * rr, C + Math.sin(a) * rr * 0.92]);
    }
    d += inkPath(pts, rng, { close: true, amp: 1.1, step: 14 });
  }
  return paths([{ d, o: 0.78, w: 0.75 }]);
}

/* ---------- 3. strata ----------
   Horizontal bands, one band per tool in the stack, each displaced by
   the field. Reads as a section through the thing. */

function strata(rng: Rng, facts: PlateFacts): string {
  const W = SIZE;
  const bands = Math.max(4, facts.tools);
  let light = '';
  let heavy = '';
  let ties = '';

  for (let b = 0; b < bands; b++) {
    const y0 = 24 + ((W - 48) * b) / (bands - 1 || 1);
    // two waves of different lengths plus a slow drift, so no band ever
    // repeats the one above it
    const a1 = 4 + rng() * 13;
    const a2 = 2 + rng() * 7;
    const f1 = 0.8 + rng() * 1.9;
    const f2 = 2.4 + rng() * 3.4;
    const p1 = rng() * Math.PI * 2;
    const p2 = rng() * Math.PI * 2;
    const drift = (rng() - 0.5) * 14;
    const strokes = 3 + Math.floor(rng() * 5);

    const at = (t: number) =>
      y0 +
      drift * t +
      Math.sin(t * f1 * Math.PI * 2 + p1) * a1 +
      Math.sin(t * f2 * Math.PI * 2 + p2) * a2;

    for (let k = 0; k < strokes; k++) {
      const off = (k - strokes / 2) * 2.1;
      const pts: Pt[] = [];
      for (let i = 0; i <= 44; i++) {
        const t = i / 44;
        pts.push([16 + (W - 32) * t, at(t) + off]);
      }
      const d = inkPath(pts, rng, { amp: 0.9, step: 16 });
      if (k === 0 || k === strokes - 1) heavy += d;
      else light += d;
    }

    // a couple of vertical ties down to the next band, the way a section
    // drawing marks a correlation between two layers
    if (b < bands - 1) {
      for (let k = 0; k < 2; k++) {
        const t = 0.12 + rng() * 0.76;
        const x = 16 + (W - 32) * t;
        ties += inkPath(
          [
            [x, at(t) + 3],
            [x, y0 + (W - 48) / (bands - 1 || 1) - 3],
          ],
          rng,
          { amp: 0.7, step: 9 },
        );
      }
    }
  }

  return paths([
    { d: light, o: 0.4, w: 0.65 },
    { d: ties, o: 0.5, w: 0.6 },
    { d: heavy, o: 0.85, w: 1 },
  ]);
}

/* ---------- 4. graph ----------
   A node for every tool, an edge wherever two of them actually have to
   talk to each other. Used for the toolkit plate. */

function graph(rng: Rng, facts: PlateFacts): string {
  const C = SIZE / 2;
  const n = Math.max(5, Math.min(facts.tools + facts.notes, 14));
  const nodes: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rng() * 0.3;
    const r = 58 + rng() * (C - 78);
    nodes.push([C + Math.cos(a) * r, C + Math.sin(a) * r * 0.94]);
  }

  let edges = '';
  for (let i = 0; i < n; i++) {
    const j = (i + 1 + Math.floor(rng() * 2)) % n;
    const a = nodes[i];
    const b = nodes[j];
    // bow each edge away from the middle so they do not all cross at once
    const mx = (a[0] + b[0]) / 2 + (rng() - 0.5) * 46;
    const my = (a[1] + b[1]) / 2 + (rng() - 0.5) * 46;
    const pts: Pt[] = [];
    for (let k = 0; k <= 18; k++) {
      const t = k / 18;
      const u = 1 - t;
      pts.push([
        u * u * a[0] + 2 * u * t * mx + t * t * b[0],
        u * u * a[1] + 2 * u * t * my + t * t * b[1],
      ]);
    }
    edges += inkPath(pts, rng, { amp: 1, step: 14 });
  }

  let rings = '';
  for (const [x, y] of nodes) {
    const r = 5 + rng() * 7;
    const pts: Pt[] = [];
    for (let k = 0; k < 22; k++) {
      const a = (k / 22) * Math.PI * 2;
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    }
    rings += inkPath(pts, rng, { close: true, amp: 0.9, step: 6 });
  }

  return paths([
    { d: edges, o: 0.6, w: 0.8 },
    { d: rings, o: 0.95, w: 1.4 },
  ]);
}

const GENERATORS: Record<PlateKind, (rng: Rng, facts: PlateFacts) => string> = {
  weave,
  orbits,
  strata,
  graph,
};

export type Plate = {
  /** square drawing, in its own 0 0 320 320 space */
  markup: string;
  size: number;
  /** what the drawing was plotted from, printed under it */
  caption: string;
};

export function drawPlate(
  kind: PlateKind,
  key: string,
  facts: PlateFacts,
): Plate {
  const rng = makeRng(hashSeed(`${kind}:${key}`));
  const bits = [
    facts.commits != null ? `${facts.commits} commits` : null,
    `${facts.tools} tools`,
    `${facts.notes} notes`,
  ].filter(Boolean);
  return {
    markup: GENERATORS[kind](rng, facts),
    size: SIZE,
    caption: `plotted from ${bits.join(' · ')}`,
  };
}
