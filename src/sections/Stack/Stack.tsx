import { useRef } from 'react';
import { chapters, stack } from '../../data/site';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import { Barcode } from '../../components/Cover/Barcode';
import styles from './Stack.module.css';

/** The capability blocks, set as terminal output. */
function SkillBlocks({ className }: { className: string }) {
  return (
    <div className={className}>
      {stack.map((row) => (
        <div key={row.code} className={styles.block}>
          <span className={styles.lineHead}>
            <span className={styles.prompt}>&gt;</span>
            <span className={styles.headCode}>{row.code}</span>
            {row.title}
          </span>
          {[...row.colA, ...row.colB].map((t) => (
            <span key={t} className={styles.lineItem}>
              {t}
            </span>
          ))}
          <span className={styles.lineFlow}>
            {row.from} ──▸ {row.to}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The toolkit chapter.
 *
 * The machine is a cut-out of the supplied photograph, dropped onto the paper.
 * You scroll in close enough that the TV fills the view and the full skill
 * list is readable on it. Keep scrolling and the camera pulls back: the
 * machine shrinks, straightens and settles into its place on the page, while
 * the list on the glass fades down to the six area headings.
 *
 * Nothing moves inside the screen. The whole machine is what animates.
 */
export function Stack({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);
  const machine = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      const m = machine.current;
      const g = glass.current;
      if (reduced || !section || !m || !g) return;

      const mm = gsap.matchMedia();

      mm.add(
        { wide: '(min-width: 701px)', narrow: '(max-width: 700px)' },
        (ctx) => {
          const { wide } = ctx.conditions as { wide: boolean };

          /* Where the glass sits when the machine is at rest, and the
             transform that puts it in the middle of the viewport instead.
             Offsets are layout values, so the transform being tweened never
             feeds back into the measurement. */
          let last = { ox: 0, oy: 0, s: 1, tx: 0, ty: 0 };
          const measure = () => {
            const vw = document.documentElement.clientWidth;
            const vh = window.innerHeight;
            const inner = m.offsetParent as HTMLElement | null;
            // not rendered (display: none somewhere above it) — there is
            // nothing to measure, and throwing here would take down every
            // ScrollTrigger on the page mid-refresh
            if (!inner) return last;
            const mx = inner.offsetLeft + m.offsetLeft;
            const my = inner.offsetTop + m.offsetTop;
            const gw = g.offsetWidth;
            const gh = g.offsetHeight;
            if (!gw || !gh) return last;
            const ox = g.offsetLeft + gw / 2;
            const oy = g.offsetTop + gh / 2;
            last = {
              ox,
              oy,
              // fit the glass to the view with a sliver of bezel showing, so
              // it still reads as a television rather than a black page
              s: Math.min(vw / gw, vh / gh) * 0.94,
              tx: vw / 2 - (mx + ox),
              ty: vh / 2 - (my + oy),
            };
            return last;
          };

          let geo = measure();
          const applyOrigin = () =>
            gsap.set(m, { transformOrigin: `${geo.ox}px ${geo.oy}px` });
          applyOrigin();

          const onRefreshInit = () => {
            geo = measure();
            applyOrigin();
          };
          ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * 1.6)}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // a beat on the close-up first, so the list can actually be read
          tl.fromTo(
            m,
            {
              x: () => geo.tx,
              y: () => geo.ty,
              scale: () => geo.s,
              // the screen is a few degrees off square in the photograph —
              // level it for the close-up, let it settle back as it lands
              rotation: 3.4,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              ease: 'power2.inOut',
              duration: 1,
            },
            0.18,
          );

          if (wide) {
            tl.fromTo(
              `.${styles.screenList}`,
              { opacity: 1 },
              { opacity: 0, duration: 0.34 },
              0.3,
            ).fromTo(
              `.${styles.screenHeadings}`,
              { opacity: 0 },
              { opacity: 1, duration: 0.34 },
              0.62,
            );
          }

          tl.fromTo(
            [`.${styles.chapter}`, `.${styles.footer}`],
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.92,
          ).to({}, { duration: 0.2 });

          return () => {
            ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
          };
        },
      );

      return () => mm.revert();
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="stack"
      ref={scope}
      className={`${styles.section} surface-paper ${
        reduced ? styles.isStatic : ''
      }`}
      aria-labelledby="stack-title"
    >
      <div className={styles.inner}>
        <span className={styles.chapter}>
          {chapters.stack.no} / {chapters.stack.title}
        </span>

        <h2 id="stack-title" className="sr-only">
          {`Capabilities — ${chapters.stack.no}, ${chapters.stack.title}`}
        </h2>

        <div ref={machine} className={styles.machine}>
          <picture>
            <source
              srcSet="/skills-crt-600.webp 600w, /skills-crt-900.webp 900w, /skills-crt-1200.webp 1200w"
              sizes="(max-width: 700px) 92vw, 720px"
              type="image/webp"
            />
            <img
              className={styles.crt}
              src="/skills-crt.png"
              srcSet="/skills-crt-600.png 600w, /skills-crt-900.png 900w, /skills-crt.png 1200w"
              sizes="(max-width: 700px) 92vw, 720px"
              alt=""
              width={1200}
              height={1040}
              loading="lazy"
              decoding="async"
            />
          </picture>

          {/* the glass — clipped to the exact corners of the screen in the
              photograph, so nothing on it can spill onto the bezel */}
          <div ref={glass} className={styles.glass}>
            {/* full listing: readable while the TV fills the view */}
            <SkillBlocks className={styles.screenList} />

            {/* at rest the glass is too small for 61 lines, so it carries
                only the area headings — a visual summary of the list above,
                hidden from assistive tech to avoid reading it twice */}
            <div className={styles.screenHeadings} aria-hidden="true">
              {stack.map((row) => (
                <span key={row.code} className={styles.lineHead}>
                  <span className={styles.prompt}>&gt;</span>
                  <span className={styles.headCode}>{row.code}</span>
                  <span className={styles.headTitle}>{row.title}</span>
                </span>
              ))}
              <span className={styles.lineHead}>
                <span className={styles.prompt}>&gt;</span>
                <span className={styles.caret} />
              </span>
            </div>

            <span className={styles.scanlines} aria-hidden="true" />
            <span className={styles.glare} aria-hidden="true" />
          </div>
        </div>

        {/* On phones and under reduced motion the full list cannot live on the
            glass, so it is printed on the paper instead. Only one of this and
            the on-screen listing is ever displayed. */}
        <SkillBlocks className={styles.printed} />

        <div className={styles.footer}>
          <Barcode seed="STK 02-26" className={styles.barcode} bars={30} />
          <span className={styles.footerText}>
            <span>— 002/007</span>
            <span>toolkit</span>
          </span>
        </div>
      </div>
    </section>
  );
}
