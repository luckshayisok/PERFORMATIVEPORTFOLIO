import { useMemo, useRef } from 'react';
import { Ink, chamferPts, circlePts, rectPts, rotatePts, type Pt } from '../../lib/ink';
import { profile, hero } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './Hero.module.css';

/* ------------------------------------------------------------------
   The stage is drawn in one coordinate space and scales as a whole, so
   the machines never drift away from the letters they are leaning on.
   These four numbers are the only contract between the type and the
   drawings: everything is positioned against them.
   ------------------------------------------------------------------ */
const VIEW = { x: 0, y: -46, w: 1200, h: 761 };
const L1_BASE = 320; // LAKSHYA baseline
const L1_CAP = 101; // ...and the top of its capitals
const L2_BASE = 492; // MAHESHWARI baseline
const GROUND = 672;

/** Everything in the scene except the wordmark itself. */
function buildScene() {
  const ink = new Ink(987654321, 'h');

  /* 1. The CRT. It stands on the ground at the left and its head covers
        the feet of the first letters — never a whole letter, or the name
        stops being readable. */
  {
    const x = 24;
    const y = 430;
    const w = 288;
    const h = 186;
    ink.shape('front', chamferPts(x, y, w, h, 16), {
      shade: { x: x + w - 78, y, w: 78, h, gap: 6.5, cross: true, o: 0.9 },
    });
    ink.shape('front', chamferPts(x + 26, y + 24, w - 104, h - 84, 10), {
      shade: { x: x + 26, y: y + 24, w: 42, h: h - 84, gap: 9, o: 0.45 },
    });
    ink.line('front', [[x + 84, y + 52], [x + 84, y + 70]], 7);
    ink.line('front', [[x + 142, y + 52], [x + 142, y + 70]], 7);
    ink.line(
      'front',
      [
        [x + 82, y + 88],
        [x + 100, y + 101],
        [x + 126, y + 101],
        [x + 144, y + 88],
      ],
      4,
    );
    ink.line('front', circlePts(x + w - 42, y + 52, 13), 2.6, true);
    ink.line('front', circlePts(x + w - 42, y + 96, 9), 2.6, true);
    for (let i = 0; i < 4; i++) {
      ink.line(
        'front',
        [[x + w - 64, y + 128 + i * 13], [x + w - 20, y + 128 + i * 13]],
        2.2,
      );
    }
    ink.shape(
      'front',
      [
        [x + 96, y + h],
        [x + 190, y + h],
        [x + 204, GROUND - 16],
        [x + 82, GROUND - 16],
      ],
      { shade: { x: x + 150, y: y + h, w: 56, h: 44, gap: 7 } },
    );
    ink.shape('front', chamferPts(x + 58, GROUND - 18, 172, 20, 6), {});
  }

  /* 2. The tower, standing at the right. */
  {
    const x = 998;
    const y = 464;
    const w = 118;
    const h = 190;
    ink.shape('front', chamferPts(x, y, w, h, 9), {
      shade: { x: x + w - 38, y, w: 38, h, gap: 6, cross: true },
    });
    for (let i = 0; i < 5; i++) {
      ink.line('front', [[x + 18, y + 96 + i * 13], [x + w - 48, y + 96 + i * 13]], 2.2);
    }
    ink.line('front', circlePts(x + w - 30, y + 28, 11), 2.6, true);
    ink.line('front', [[x + 18, y + 24], [x + 62, y + 24]], 3);
    ink.line('front', [[x + 18, y + 42], [x + 50, y + 42]], 3);
    ink.shape('front', rectPts(x - 8, GROUND - 18, w + 16, 18), {});
  }

  /* 3. The bot, perched on the first line and holding on to it. */
  {
    const w = 116;
    const h = 94;
    const x = 792;
    const y = L1_CAP - h;
    ink.line('front', [[x + 58, y - 26], [x + 58, y]], 3);
    ink.line('front', circlePts(x + 58, y - 33, 9), 3, true);
    ink.shape('front', chamferPts(x, y, w, h, 18), {
      shade: { x: x + w - 34, y, w: 34, h, gap: 6.5, cross: true },
    });
    ink.line('front', circlePts(x + 35, y + 40, 11), 3, true);
    ink.line('front', circlePts(x + 79, y + 40, 11), 3, true);
    ink.line('front', [[x + 33, y + 68], [x + 83, y + 68]], 3.4);
    ink.line('front', [[x, y + 50], [x - 28, y + 72], [x - 24, y + 96]], 3);
    ink.line('front', [[x + w, y + 50], [x + w + 28, y + 72], [x + w + 24, y + 96]], 3);
  }

  /* 4. The mug, standing on the first line. */
  {
    const w = 74;
    const h = 78;
    const x = 318;
    const y = L1_CAP - h;
    ink.shape(
      'front',
      [[x, y], [x + w, y], [x + w - 7, y + h], [x + 7, y + h]],
      { shade: { x: x + w - 26, y, w: 26, h, gap: 6.5, cross: true } },
    );
    ink.line(
      'front',
      [
        [x + w, y + 16],
        [x + w + 24, y + 24],
        [x + w + 24, y + 50],
        [x + w - 4, y + 58],
      ],
      3,
    );
    // steam: long waves, or they read as stray tick marks
    ink.line('front', [[x + 18, y - 10], [x + 30, y - 24], [x + 18, y - 38], [x + 30, y - 52]], 2.6);
    ink.line('front', [[x + 48, y - 8], [x + 60, y - 24], [x + 48, y - 40], [x + 58, y - 56]], 2.6);
  }

  /* 5. The floppy, leaning on the ground between the two machines. */
  {
    const w = 108;
    const h = 108;
    const x = 556;
    const y = GROUND - 18 - h;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rot = (p: Pt[]) => rotatePts(p, cx, cy, -0.13);
    ink.shape('front', rot(rectPts(x, y, w, h)), {
      shade: { x, y: y + h - 38, w, h: 38, gap: 6.5, cross: true },
    });
    ink.shape('front', rot(rectPts(x + 22, y + 7, 64, 38)), {});
    ink.line('front', rot(rectPts(x + 48, y + 7, 18, 38)), 2.6, true);
    ink.shape('front', rot(rectPts(x + 18, y + 60, 72, 40)), {
      shade: { x: x + 18, y: y + 60, w: 72, h: 40, gap: 9, o: 0.4 },
    });
  }

  /* 6. A cable running out of the frame. */
  {
    const p: Pt[] = [];
    for (let i = 0; i <= 44; i++) {
      const t = i / 44;
      p.push([
        96 + (1104 - 96) * t,
        GROUND + 14 + Math.sin(t * 7.4) * 12 + Math.sin(t * 2.1) * 6,
      ]);
    }
    ink.line('front', p, 3.4);
    const e = p[p.length - 1];
    ink.shape('front', rectPts(e[0] - 2, e[1] - 15, 32, 30), {
      shade: { x: e[0] - 2, y: e[1] - 15, w: 32, h: 30, gap: 6 },
    });
  }

  /* 7. The ground, drawn in a few passes the way a pen would. */
  {
    for (let k = 0; k < 3; k++) {
      const p: Pt[] = [];
      const y = GROUND + k * 5;
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        p.push([34 + 1132 * t, y + Math.sin(t * 11 + k) * 3]);
      }
      ink.line('behind', p, 2.2, false, 0.9 - k * 0.25);
    }
    for (let i = 0; i < 28; i++) {
      const gx = 52 + ink.rng() * 1096;
      const gh = 7 + ink.rng() * 13;
      ink.line(
        'behind',
        [[gx, GROUND], [gx + (ink.rng() - 0.5) * 9, GROUND - gh]],
        2,
        false,
        0.7,
      );
    }
  }

  /* 8. Marks from the job, in the clear bands above and below the type. */
  ink.spark('front', 300, 48, 17);
  ink.spark('front', 690, 44, 20);
  ink.spark('front', 486, 74, 11, 2.4);
  ink.spark('front', 1156, 560, 13, 2.6);
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

export function Hero({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);
  const scene = useMemo(buildScene, []);

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
              <rect x="0" y={L1_CAP - 40} width={VIEW.w} height={L1_BASE - L1_CAP + 40} />
            </clipPath>
            <clipPath id="hero-line-2">
              <rect x="0" y={L2_BASE - 200} width={VIEW.w} height={210} />
            </clipPath>
          </defs>

          <g mask="url(#hero-wipe)" dangerouslySetInnerHTML={{ __html: scene.defs + scene.behind }} />

          {/* both lines are stretched to one measure, so the block sets
              flush left and right like a printed poster */}
          <g fill="#121110" fontFamily="Anton, sans-serif" textAnchor="middle">
            <g clipPath="url(#hero-line-1)">
              <text
                className={styles.word}
                x={VIEW.w / 2}
                y={L1_BASE}
                fontSize="300"
                textLength="1090"
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
                textLength="1090"
                lengthAdjust="spacingAndGlyphs"
              >
                MAHESHWARI
              </text>
            </g>
          </g>

          <g mask="url(#hero-wipe)" dangerouslySetInnerHTML={{ __html: scene.front }} />
        </svg>
      </div>

      <div className={`shell ${styles.below}`}>
        <p className={styles.tagline}>{hero.tagline}</p>
        <div className={styles.actions}>
          <a className={`${styles.btn} ${styles.solid}`} href="#work">
            See the work
          </a>
          <a className={styles.btn} href={profile.resume} download>
            Download résumé <span aria-hidden="true">&#8595;</span>
          </a>
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
