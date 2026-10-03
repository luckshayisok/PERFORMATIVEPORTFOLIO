import { useMemo, useRef } from 'react';
import {
  Ink,
  chamferPts,
  circlePts,
  rectPts,
  rotatePts,
  type Pt,
} from '../../lib/ink';
import { profile, hero } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './Hero.module.css';

/* ------------------------------------------------------------------
   The stage is drawn in one coordinate space and scales as a whole, so
   the machines never drift away from the letters they lean on. These
   four numbers are the only contract between the type and the drawings.

   The two lines of the name are set with real air between them — an
   earlier pass let them touch and the M of MAHESHWARI collided with the
   LA above it, which read as a mistake rather than a decision.
   ------------------------------------------------------------------ */
const VIEW = { x: 0, y: -62, w: 1200, h: 824 };
const L1_BASE = 300; // LAKSHYA baseline
const L1_CAP = 81; // ...and the top of its capitals
const L2_BASE = 520; // MAHESHWARI baseline
const L2_CAP = 364;
const GROUND = 700;

/** Short strokes where an object meets the ground, so it sits on it. */
function shadow(ink: Ink, x: number, w: number, dense = 7) {
  for (let i = 0; i < dense; i++) {
    const t = i / (dense - 1);
    const sx = x + w * t;
    ink.line(
      'front',
      [
        [sx - 10, GROUND + 4 + (ink.rng() - 0.5) * 3],
        [sx + 12, GROUND + 4 + (ink.rng() - 0.5) * 3],
      ],
      1.6,
      false,
      0.45,
    );
  }
}

/** Everything in the scene except the wordmark itself. */
function buildScene() {
  const ink = new Ink(987654321, 'h');

  /* 1. The CRT. It stands on the ground at the left and its head covers
        the feet of the first letters — never a whole letter, or the name
        stops being readable. */
  {
    const x = 28;
    const y = 470;
    const w = 322;
    const h = 214;
    ink.shape('front', chamferPts(x, y, w, h, 18), {
      shade: { x: x + w - 86, y, w: 86, h, gap: 6.5, cross: true, o: 0.9 },
    });
    ink.shape('front', chamferPts(x + 28, y + 26, w - 118, h - 92, 11), {
      shade: { x: x + 28, y: y + 26, w: 46, h: h - 92, gap: 9, o: 0.45 },
    });
    // a face on the glass — the one thing on the page that is just charm
    ink.line('front', [[x + 92, y + 64], [x + 92, y + 84]], 7.5);
    ink.line('front', [[x + 156, y + 64], [x + 156, y + 84]], 7.5);
    ink.line(
      'front',
      [
        [x + 88, y + 104],
        [x + 108, y + 119],
        [x + 138, y + 119],
        [x + 158, y + 104],
      ],
      4.2,
    );
    ink.line('front', circlePts(x + w - 46, y + 56, 14), 2.8, true);
    ink.line('front', circlePts(x + w - 46, y + 104, 10), 2.8, true);
    for (let i = 0; i < 4; i++) {
      ink.line(
        'front',
        [[x + w - 70, y + 140 + i * 14], [x + w - 22, y + 140 + i * 14]],
        2.3,
      );
    }
    ink.shape(
      'front',
      [
        [x + 108, y + h],
        [x + 212, y + h],
        [x + 228, GROUND - 18],
        [x + 92, GROUND - 18],
      ],
      { shade: { x: x + 168, y: y + h, w: 62, h: 50, gap: 7 } },
    );
    ink.shape('front', chamferPts(x + 62, GROUND - 20, 196, 22, 7), {});
    shadow(ink, x + 52, 220);
  }

  /* 2. The tower, standing at the right. */
  {
    const x = 1032;
    const y = 478;
    const w = 142;
    const h = 206;
    ink.shape('front', chamferPts(x, y, w, h, 10), {
      shade: { x: x + w - 46, y, w: 46, h, gap: 6, cross: true },
    });
    for (let i = 0; i < 5; i++) {
      ink.line(
        'front',
        [[x + 22, y + 104 + i * 15], [x + w - 58, y + 104 + i * 15]],
        2.3,
      );
    }
    ink.line('front', circlePts(x + w - 36, y + 32, 12), 2.8, true);
    ink.line('front', [[x + 22, y + 28], [x + 72, y + 28]], 3.2);
    ink.line('front', [[x + 22, y + 50], [x + 58, y + 50]], 3.2);
    ink.shape('front', rectPts(x - 10, GROUND - 20, w + 20, 22), {});
    shadow(ink, x - 16, w + 34, 6);
  }

  /* 3. A desk lamp, leaning in over the middle of the ground. Without it
        the centre of the stage is a hole. */
  {
    const bx = 404;
    ink.shape('front', chamferPts(bx, GROUND - 30, 118, 30, 9), {
      shade: { x: bx + 66, y: GROUND - 30, w: 52, h: 30, gap: 6.5, cross: true },
    });
    ink.line('front', [[bx + 58, GROUND - 30], [bx + 44, 552]], 7);
    ink.line('front', [[bx + 44, 552], [bx + 130, 504]], 7);
    ink.line('front', circlePts(bx + 44, 552, 9), 3, true);
    const shade: Pt[] = [
      [bx + 112, 478],
      [bx + 190, 510],
      [bx + 152, 556],
      [bx + 90, 520],
    ];
    ink.shape('front', shade, {
      shade: { x: bx + 140, y: 478, w: 56, h: 78, gap: 6.5, cross: true },
    });
    // three strokes of light, the way a drawing says "this is on"
    for (let i = 0; i < 3; i++) {
      ink.line(
        'front',
        [
          [bx + 118 + i * 16, 560 + i * 4],
          [bx + 132 + i * 22, 596 + i * 8],
        ],
        2.2,
        false,
        0.75,
      );
    }
    shadow(ink, bx - 4, 132, 6);
  }

  /* 3b. A plant, for the one thing on the ground that is alive. */
  {
    const px = 540;
    const pot: Pt[] = [
      [px, 660],
      [px + 62, 660],
      [px + 54, GROUND - 2],
      [px + 8, GROUND - 2],
    ];
    ink.shape('front', pot, {
      shade: { x: px + 34, y: 660, w: 28, h: 40, gap: 6, cross: true },
    });
    ink.line('front', [[px + 4, 668], [px + 58, 668]], 2.6);
    ink.line('front', [[px + 31, 660], [px + 28, 618]], 2.8);
    ink.line(
      'front',
      [[px + 28, 622], [px + 2, 600], [px + 10, 574], [px + 30, 600]],
      2.6,
      true,
    );
    ink.line(
      'front',
      [[px + 30, 636], [px + 58, 616], [px + 54, 590], [px + 32, 614]],
      2.6,
      true,
    );
    shadow(ink, px - 4, 72, 4);
  }

  /* 4. A keyboard lying on the ground, filling the middle band. */
  {
    const k: Pt[] = [
      [628, 662],
      [878, 648],
      [890, 684],
      [638, 700],
    ];
    ink.shape('front', k, {
      shade: { x: 628, y: 674, w: 262, h: 26, gap: 6.5 },
    });
    for (let r = 0; r < 3; r++) {
      ink.line(
        'front',
        [
          [646 + r * 4, 668 + r * 9],
          [872 - r * 4, 655 + r * 9],
        ],
        1.8,
        false,
        0.8,
      );
    }
    shadow(ink, 630, 260, 6);
  }

  /* 5. The floppy, propped against the keyboard. */
  {
    const w = 118;
    const h = 118;
    const x = 904;
    const y = GROUND - 22 - h;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rot = (p: Pt[]) => rotatePts(p, cx, cy, -0.15);
    ink.shape('front', rot(rectPts(x, y, w, h)), {
      shade: { x, y: y + h - 42, w, h: 42, gap: 6.5, cross: true },
    });
    ink.shape('front', rot(rectPts(x + 24, y + 8, 70, 42)), {});
    ink.line('front', rot(rectPts(x + 52, y + 8, 20, 42)), 2.8, true);
    ink.shape('front', rot(rectPts(x + 20, y + 66, 78, 44)), {
      shade: { x: x + 20, y: y + 66, w: 78, h: 44, gap: 9, o: 0.4 },
    });
    shadow(ink, x - 6, w + 16, 5);
  }

  /* 6. The bot, perched on the first line and holding on to it. */
  {
    const w = 118;
    const h = 96;
    const x = 790;
    const y = L1_CAP - h;
    ink.line('front', [[x + 59, y - 28], [x + 59, y]], 3.2);
    ink.line('front', circlePts(x + 59, y - 36, 10), 3.2, true);
    ink.shape('front', chamferPts(x, y, w, h, 19), {
      shade: { x: x + w - 36, y, w: 36, h, gap: 6.5, cross: true },
    });
    ink.line('front', circlePts(x + 36, y + 41, 12), 3.2, true);
    ink.line('front', circlePts(x + 81, y + 41, 12), 3.2, true);
    ink.line('front', [[x + 34, y + 70], [x + 84, y + 70]], 3.6);
    ink.line('front', [[x, y + 52], [x - 30, y + 74], [x - 26, y + 98]], 3.2);
    ink.line(
      'front',
      [[x + w, y + 52], [x + w + 30, y + 74], [x + w + 26, y + 98]],
      3.2,
    );
  }

  /* 7. The mug, standing on the first line. */
  {
    const w = 76;
    const h = 80;
    const x = 316;
    const y = L1_CAP - h;
    ink.shape(
      'front',
      [[x, y], [x + w, y], [x + w - 7, y + h], [x + 7, y + h]],
      { shade: { x: x + w - 27, y, w: 27, h, gap: 6.5, cross: true } },
    );
    ink.line(
      'front',
      [
        [x + w, y + 16],
        [x + w + 25, y + 25],
        [x + w + 25, y + 52],
        [x + w - 4, y + 60],
      ],
      3.2,
    );
    // steam: long waves, or they read as stray tick marks
    ink.line(
      'front',
      [[x + 19, y - 10], [x + 31, y - 25], [x + 19, y - 40], [x + 31, y - 55]],
      2.7,
    );
    ink.line(
      'front',
      [[x + 50, y - 8], [x + 62, y - 25], [x + 50, y - 42], [x + 60, y - 58]],
      2.7,
    );
  }

  /* 8. A cable out of the tower, looping across the ground and off the
        left edge of the frame. */
  {
    const p: Pt[] = [];
    for (let i = 0; i <= 52; i++) {
      const t = i / 52;
      p.push([
        1058 - 1086 * t,
        GROUND + 22 + Math.sin(t * 6.6 + 0.4) * 15 + Math.sin(t * 2.3) * 7,
      ]);
    }
    ink.line('front', p, 3.6);
  }

  /* 9. The ground, drawn in a few passes the way a pen would. */
  {
    for (let k = 0; k < 3; k++) {
      const p: Pt[] = [];
      const y = GROUND + k * 5;
      for (let i = 0; i <= 32; i++) {
        const t = i / 32;
        p.push([24 + 1152 * t, y + Math.sin(t * 11 + k) * 3]);
      }
      ink.line('behind', p, 2.3, false, 0.9 - k * 0.25);
    }
    for (let i = 0; i < 34; i++) {
      const gx = 40 + ink.rng() * 1120;
      const gh = 8 + ink.rng() * 14;
      ink.line(
        'behind',
        [[gx, GROUND], [gx + (ink.rng() - 0.5) * 10, GROUND - gh]],
        2,
        false,
        0.7,
      );
    }
  }

  /* 10. Marks from the job, in the clear bands around the type. */
  ink.spark('front', 262, 36, 18);
  ink.spark('front', 700, 24, 21);
  ink.spark('front', 486, 62, 12, 2.5);
  ink.spark('front', 1168, 598, 14, 2.7);
  ink.spark('front', 150, 404, 13, 2.5);
  for (const m of hero.marks) {
    ink.raw(
      'front',
      `<text x="${m.x}" y="${m.y}" font-family="Space Mono, monospace" ` +
        `font-weight="700" font-size="${m.size}" fill="#121110" opacity="0.82" ` +
        `transform="rotate(${m.rot} ${m.x} ${m.y})">${m.text}</text>`,
    );
  }

  return ink.markup;
}

export function Hero({
  reduced,
  onOpenResume,
}: {
  reduced: boolean;
  onOpenResume: () => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const scene = useMemo(() => buildScene(), []);

  useGSAP(
    () => {
      if (reduced) return;

      // the letters arrive first, then the pen draws the machines onto them
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(`.${styles.word}`, {
          yPercent: 115,
          duration: 1,
          stagger: 0.08,
        })
        .fromTo(
          `.${styles.wipe}`,
          { attr: { width: 0 } },
          { attr: { width: VIEW.w }, duration: 1.3, ease: 'none' },
          0.35,
        )
        .from(
          `.${styles.below} > *`,
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.09 },
          0.7,
        );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section ref={scope} className={styles.section} aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        {profile.name} — {hero.role}
      </h1>

      <div className={styles.stage}>
        <svg
          className={styles.svg}
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          aria-hidden="true"
        >
          <defs>
            <mask id="hero-wipe" maskUnits="userSpaceOnUse">
              <rect
                className={styles.wipe}
                x={VIEW.x}
                y={VIEW.y}
                width={reduced ? VIEW.w : 0}
                height={VIEW.h}
                fill="#fff"
              />
            </mask>
            <clipPath id="hero-line-1">
              <rect x="0" y={L1_CAP - 46} width={VIEW.w} height={L1_BASE - L1_CAP + 46} />
            </clipPath>
            <clipPath id="hero-line-2">
              <rect x="0" y={L2_CAP - 40} width={VIEW.w} height={L2_BASE - L2_CAP + 40} />
            </clipPath>
          </defs>

          <g
            mask="url(#hero-wipe)"
            dangerouslySetInnerHTML={{ __html: scene.defs + scene.behind }}
          />

          {/* both lines are stretched to one measure, so the block sets
              flush left and right like a printed poster */}
          <g fill="#121110" fontFamily="Anton, sans-serif" textAnchor="middle">
            <g clipPath="url(#hero-line-1)">
              <text
                className={styles.word}
                x={VIEW.w / 2}
                y={L1_BASE}
                fontSize="300"
                textLength="1120"
                lengthAdjust="spacingAndGlyphs"
              >
                LAKSHYA
              </text>
            </g>
            <g clipPath="url(#hero-line-2)">
              <text
                className={styles.word}
                x={VIEW.w / 2}
                y={L2_BASE}
                fontSize="214"
                textLength="1120"
                lengthAdjust="spacingAndGlyphs"
              >
                MAHESHWARI
              </text>
            </g>
          </g>

          <g
            mask="url(#hero-wipe)"
            dangerouslySetInnerHTML={{ __html: scene.front }}
          />
        </svg>
      </div>

      <div className={`shell ${styles.below}`}>
        <p className={styles.tagline}>{hero.tagline}</p>
        <div className={styles.actions}>
          <a className={`${styles.btn} ${styles.solid}`} href="#work">
            See the work
          </a>
          <button
            type="button"
            className={styles.btn}
            onClick={onOpenResume}
            aria-haspopup="dialog"
          >
            View résumé
          </button>
        </div>
        <p className={styles.meta}>
          <span>{profile.location}</span>
          <span aria-hidden="true">/</span>
          <span>{hero.role}</span>
        </p>
      </div>
    </section>
  );
}
