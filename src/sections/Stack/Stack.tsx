import { useRef } from 'react';
import { stack, chapters } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import { ScrambleCode } from '../../components/ScrambleCode';
import styles from './Stack.module.css';

function SpectrumArrow({ from, to }: { from: string; to: string }) {
  return (
    <div className={styles.spectrum} aria-hidden="true">
      <span className={styles.endpoint}>{from}</span>
      <svg
        className={styles.arrowSvg}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        focusable="false"
      >
        <line
          className={styles.arrowLine}
          x1="0"
          y1="5"
          x2="99"
          y2="5"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        className={styles.arrowHead}
        viewBox="0 0 8 10"
        width="8"
        height="10"
        focusable="false"
      >
        <path d="M0 0 8 5 0 10z" fill="currentColor" />
      </svg>
      <span className={styles.endpoint}>{to}</span>
    </div>
  );
}

export function Stack({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(`.${styles.row}`);

      if (reduced) {
        gsap.set(`.${styles.tagA}, .${styles.tagB}`, {
          opacity: 1,
          yPercent: 0,
        });
        gsap.set(`.${styles.arrowLine}`, { strokeDashoffset: 0 });
        gsap.set(`.${styles.arrowHead}`, { opacity: 1 });
        return;
      }

      rows.forEach((row) => {
        const above = row.querySelectorAll(`.${styles.tagA}`);
        const below = row.querySelectorAll(`.${styles.tagB}`);
        const line = row.querySelector(`.${styles.arrowLine}`);
        const head = row.querySelector(`.${styles.arrowHead}`);
        const title = row.querySelectorAll(`.${styles.reveal}`);

        gsap.set(above, { opacity: 0, yPercent: -140 });
        gsap.set(below, { opacity: 0, yPercent: 140 });
        gsap.set(title, { opacity: 0, yPercent: 70 });
        gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(head, { opacity: 0, xPercent: -60 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 84%', once: true },
        });

        tl.to(title, {
          opacity: 1,
          yPercent: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.05,
        })
          .to(
            above,
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.06,
            },
            '<0.05',
          )
          .to(
            below,
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.06,
            },
            '<',
          )
          // the arrow draws itself
          .to(
            line,
            { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
            '<0.1',
          )
          .to(head, { opacity: 1, xPercent: 0, duration: 0.35, ease: 'power2.out' }, '-=0.2');
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="stack"
      ref={scope}
      className={`${styles.section} surface-bone`}
      aria-labelledby="stack-title"
    >
      <div className="shell">
        <p className={styles.chapter}>
          {chapters.stack.no} / {chapters.stack.title}
        </p>

        <div className={styles.head}>
          <h2 id="stack-title" className={styles.headTitle}>
            <span className={styles.headCode}>
              <ScrambleCode text="STK" reduced={reduced} />
            </span>
            <span>Capabilities</span>
          </h2>
          <span className={styles.headCount}>
            {String(stack.length).padStart(2, '0')} areas
          </span>
        </div>

        <ul>
          {stack.map((row) => (
            <li key={row.code} className={styles.row}>
              <div className={styles.grid}>
                <div className={styles.colCode}>
                  <span className={`${styles.code} ${styles.reveal}`}>
                    <ScrambleCode text={row.code} reduced={reduced} />
                  </span>
                  <span className={`${styles.id} ${styles.reveal}`}>
                    {row.id}
                  </span>
                </div>

                <h3 className={`${styles.title} display ${styles.reveal}`}>
                  {row.title}
                </h3>

                <div className={styles.cols}>
                  <ul className={styles.col}>
                    {row.colA.map((t) => (
                      <li key={t} className={styles.tagWrap}>
                        <span className={styles.tagA}>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className={styles.col}>
                    {row.colB.map((t) => (
                      <li key={t} className={styles.tagWrap}>
                        <span className={styles.tagB}>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <SpectrumArrow from={row.from} to={row.to} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
