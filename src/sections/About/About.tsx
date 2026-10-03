import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { aboutPoster, chapters, profile } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import { Barcode } from '../../components/Cover/Barcode';
import styles from './About.module.css';

/**
 * CH.03 — After hours.
 *
 * Laid out as a printed poster: a red wordmark, a figure walking toward the
 * reader with a long cast shadow, labels on hairline leader lines, one
 * sentence of the bio stepping down the page, and a dense credits band along
 * the bottom. Every word on it comes from the bio.
 */
export function About({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);
  const { figure } = aboutPoster;

  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      const q = (c: string) => `.${styles[c]}`;

      gsap
        .timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: scope.current, start: 'top 72%', once: true },
        })
        .from(q('letter'), { yPercent: 110, duration: 1.1, stagger: 0.07 })
        .from(q('figure'), { opacity: 0, y: 40, duration: 1.1 }, 0.3)
        .from(q('shadowWrap'), { scaleY: 0, duration: 1.3, ease: 'power3.out' }, 0.45)
        .from(q('tagLine'), { scaleX: 0, duration: 0.8, stagger: 0.06 }, 0.7)
        .from(q('tagText'), { opacity: 0, y: 8, duration: 0.6, stagger: 0.06 }, 0.8)
        .from(q('stepInner'), { yPercent: 110, duration: 0.9, stagger: 0.12 }, 1)
        .from(q('band'), { opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, 1.2);

      // the figure keeps walking toward you a little as the poster passes
      gsap.fromTo(
        q('walker'),
        { yPercent: 5 },
        {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="about"
      ref={scope}
      className={`${styles.section} surface-paper`}
      aria-labelledby="about-title"
    >
      <h2 id="about-title" className="sr-only">
        {`About — ${chapters.about.no}, ${chapters.about.title}`}
      </h2>

      <div className={styles.poster}>
        <span className={styles.chapter}>
          {chapters.about.no} / {chapters.about.title}
        </span>

        {/* ---- wordmark ---- */}
        <p className={styles.wordmark} aria-hidden="true">
          <span className={styles.wordInner}>
            {aboutPoster.wordmark.split('').map((ch, i) => (
              <span key={i} className={styles.letterMask}>
                <span className={styles.letter}>{ch}</span>
              </span>
            ))}
          </span>
        </p>

        {/* ---- the figure and its cast shadow ---- */}
        <div className={styles.walker}>
          <div className={styles.shadowWrap} aria-hidden="true">
            <img
              className={styles.shadow}
              src={figure.shadow}
              alt=""
              width={540}
              height={600}
              loading="lazy"
              decoding="async"
            />
          </div>
          <picture>
            <source srcSet={figure.webpSet} sizes="(max-width: 960px) 70vw, 34vw" type="image/webp" />
            <img
              className={styles.figure}
              src={figure.src}
              srcSet={figure.srcSet}
              sizes="(max-width: 960px) 70vw, 34vw"
              alt=""
              width={figure.width}
              height={figure.height}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        {/* ---- labels on leader lines ---- */}
        <ul className={styles.tags}>
          {aboutPoster.tags.map((t) => (
            <li
              key={t.text}
              className={`${styles.tag} ${styles[t.side]}`}
              style={
                {
                  '--x': `${t.x}%`,
                  '--y': `${t.y}%`,
                  '--len': 'len' in t ? `${t.len}%` : undefined,
                } as CSSProperties
              }
            >
              <span className={styles.tagText}>{t.text}</span>
              <span className={styles.tagLine} aria-hidden="true" />
            </li>
          ))}
        </ul>

        {/* ---- one sentence stepping down the page ---- */}
        {/* three fragments positioned apart on the page, one sentence to a
            screen reader — the fragments are hidden, the sentence is not */}
        <p className={styles.steps}>
          <span className="sr-only">
            {aboutPoster.steps
              .map((s) => ('mark' in s ? `${s.text} ${s.mark}${s.after}` : s.text))
              .join(' ')}
          </span>
          {aboutPoster.steps.map((s) => (
            <span
              key={s.text}
              className={styles.step}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-hidden="true"
            >
              <span className={styles.stepInner}>
                {s.text}
                {'mark' in s && (
                  <>
                    {' '}
                    <u className={styles.mark}>{s.mark}</u>
                    {s.after}
                  </>
                )}
              </span>
            </span>
          ))}
        </p>

        <div className={styles.edition}>
          <Barcode seed={aboutPoster.edition} className={styles.barcode} bars={30} />
          <span className={styles.editionText}>
            <span>{aboutPoster.edition}</span>
            <span>{aboutPoster.editionLabel}</span>
          </span>
        </div>

        {/* ---- credits band ---- */}
        <div className={styles.bandRow}>
          <p className={`${styles.band} ${styles.synopsis}`}>{profile.bio[0]}</p>

          <div className={`${styles.band} ${styles.credits}`}>
            <span className={styles.capsule} lang="ja" title={aboutPoster.credits.labelGloss}>
              {aboutPoster.credits.label}
            </span>
            <ul className={styles.names}>
              {aboutPoster.credits.names.map((n) =>
                n === aboutPoster.credits.struck ? (
                  <li key={n}>
                    <s className={styles.struck}>{n}</s>
                  </li>
                ) : (
                  <li key={n}>{n}</li>
                ),
              )}
            </ul>
          </div>

          <div className={`${styles.band} ${styles.aside}`}>
            <span className={styles.capsule} lang="ja" title={aboutPoster.aside.labelGloss}>
              {aboutPoster.aside.label}
            </span>
            <div className={styles.asideBody}>
              <p className={styles.headline}>
                <span lang="ja" aria-hidden="true">
                  {aboutPoster.aside.headline}
                </span>
                <span className="sr-only">{aboutPoster.aside.headlineGloss}</span>
              </p>
              <p className={styles.tail}>{profile.bioTail}</p>
            </div>
          </div>

          <ul className={`${styles.band} ${styles.checks}`}>
            {aboutPoster.checks.map((c) => (
              <li key={c.text}>
                <span className={styles.box} aria-hidden="true" />
                <span lang="ja" aria-hidden="true">
                  {c.text}
                </span>
                <span className="sr-only">{c.gloss}</span>
              </li>
            ))}
          </ul>
        </div>

        <span className={styles.grain} aria-hidden="true" />
      </div>
    </section>
  );
}
