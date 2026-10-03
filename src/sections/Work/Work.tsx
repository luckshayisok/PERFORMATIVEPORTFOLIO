import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { chapters, work } from '../../data/site';
import { Plate } from '../../components/Plate/Plate';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './Work.module.css';

/* the card is one of three columns, then two, then the full measure */
const SHOT_SIZES = '(max-width: 620px) 92vw, (max-width: 1040px) 46vw, 31vw';

/**
 * Plate 01 — the work.
 *
 * Each card carries a real screenshot of the running project and its own
 * links. Where a project has no public build to photograph — a React
 * Native app, a script that lives in WhatsApp — the card falls back to a
 * plate plotted from that project's own numbers.
 *
 * The card's own link is stretched over the whole card; the live and
 * source links sit above it, so they stay separately clickable without
 * ever nesting one anchor inside another.
 */
export function Work({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(`.${styles.card}`, {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: { each: 0.06, grid: 'auto', from: 'start' },
        scrollTrigger: { trigger: scope.current, start: 'top 72%', once: true },
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="work"
      ref={scope}
      className={styles.section}
      aria-labelledby="work-title"
    >
      <div className="shell">
        <header className={styles.head}>
          <span className="chapter">
            {chapters.work.no} / {chapters.work.title}
          </span>
          <h2 id="work-title" className="title">
            Things I have
            <br />
            actually built.
          </h2>
          <p className={styles.note}>
            Live where there is something to visit, source where the code is
            mine to publish.
          </p>
        </header>

        <ul className={styles.grid}>
          {work.map((item) => (
            <li key={item.slug} className={styles.card}>
              <div className={styles.frame}>
                {item.shot ? (
                  <picture>
                    <source
                      srcSet={item.shot.webpSet}
                      sizes={SHOT_SIZES}
                      type="image/webp"
                    />
                    <img
                      className={styles.shot}
                      src={item.shot.src}
                      srcSet={item.shot.srcSet}
                      sizes={SHOT_SIZES}
                      width={item.shot.width}
                      height={item.shot.height}
                      alt={item.shot.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <Plate
                    kind={item.plate}
                    plotKey={item.slug}
                    facts={{
                      commits: item.commits,
                      tools: item.stack.length,
                      notes: item.highlights.length,
                    }}
                    reduced={reduced}
                    caption={false}
                  />
                )}
              </div>

              <span className={styles.meta}>
                <span>{item.code}</span>
                <span>{item.label === 'CLIENT' ? 'Client' : 'Personal'}</span>
                <span>{item.year}</span>
              </span>

              <h3 className={styles.name}>
                <Link className={styles.nameLink} to={`/work/${item.slug}`}>
                  {item.name}
                </Link>
              </h3>

              <p className={styles.tagline}>{item.tagline}</p>

              <span className={styles.tags}>
                {item.tags.slice(0, 4).map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </span>

              {(item.demo || item.repo) && (
                <span className={styles.links}>
                  {item.demo && (
                    <a
                      className={styles.linkBtn}
                      href={item.demo}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Live <span aria-hidden="true">&#8599;</span>
                      <span className="sr-only">— {item.name}</span>
                    </a>
                  )}
                  {item.repo && (
                    <a
                      className={styles.linkBtn}
                      href={item.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Source <span aria-hidden="true">&#8599;</span>
                      <span className="sr-only">— {item.name}</span>
                    </a>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
