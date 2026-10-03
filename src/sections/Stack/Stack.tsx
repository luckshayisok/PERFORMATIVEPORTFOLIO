import { useRef } from 'react';
import { chapters, stack } from '../../data/site';
import { Plate } from '../../components/Plate/Plate';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './Stack.module.css';

const TOOLS = stack.reduce((n, row) => n + row.colA.length + row.colB.length, 0);

/**
 * Plate 02 — the toolkit.
 *
 * One drawing for the whole stack: a node for every tool, edges where
 * two of them have to talk to each other. The list beside it is the
 * key to that drawing.
 */
export function Stack({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(`.${styles.row}`, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: { trigger: scope.current, start: 'top 68%', once: true },
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="stack"
      ref={scope}
      className={styles.section}
      aria-labelledby="stack-title"
    >
      <div className="shell">
        <header className={styles.head}>
          <span className="chapter">
            {chapters.stack.no} / {chapters.stack.title}
          </span>
          <h2 id="stack-title" className="title">
            What I reach for.
          </h2>
        </header>

        <div className={styles.grid}>
          <div className={styles.aside}>
            <Plate
              kind="graph"
              plotKey="toolkit"
              facts={{ tools: TOOLS, notes: stack.length }}
              reduced={reduced}
            />
            <p className={styles.legend}>
              {TOOLS} tools across {stack.length} areas. Every node is one of
              them; every edge is two that have to agree on a format.
            </p>
          </div>

          <ul className={styles.rows}>
            {stack.map((row) => (
              <li key={row.code} className={styles.row}>
                <span className={styles.rowHead}>
                  <span className={styles.code}>{row.code}</span>
                  <span className={styles.rowTitle}>{row.title}</span>
                  <span className={styles.flow} aria-hidden="true">
                    {row.from} &rarr; {row.to}
                  </span>
                </span>
                <span className={styles.tools}>
                  {[...row.colA, ...row.colB].map((t) => (
                    <span key={t} className={styles.tool}>
                      {t}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
