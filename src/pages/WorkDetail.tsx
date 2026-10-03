import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { work } from '../data/site';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';
import { RevealText } from '../components/RevealText';
import { usePageTransition } from '../components/Transition/Transition';
import { NotFound } from './NotFound';
import styles from './WorkDetail.module.css';

export function WorkDetail({ reduced }: { reduced: boolean }) {
  const { slug } = useParams();
  const scope = useRef<HTMLElement>(null);
  const { go } = usePageTransition();

  const index = work.findIndex((w) => w.slug === slug);
  const item = index >= 0 ? work[index] : undefined;
  const next = item ? work[(index + 1) % work.length] : undefined;

  useEffect(() => {
    if (item) document.title = `${item.name} — Lakshya Maheshwari`;
    return () => {
      document.title = 'Lakshya Maheshwari — Software Engineer';
    };
  }, [item]);

  useGSAP(
    () => {
      if (!item || reduced) return;

      gsap.from(`.${styles.metaCell}`, {
        opacity: 0,
        yPercent: 40,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.25,
      });

      gsap.from(`.${styles.chip}`, {
        opacity: 0,
        yPercent: 90,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: { trigger: `.${styles.chips}`, start: 'top 90%', once: true },
      });

      gsap.from(`.${styles.hlRow}`, {
        opacity: 0,
        yPercent: 30,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: `.${styles.hl}`, start: 'top 85%', once: true },
      });

      ScrollTrigger.refresh();
    },
    { scope, dependencies: [slug, reduced] },
  );

  if (!item) return <NotFound />;

  return (
    <main id="main" ref={scope} className={styles.page}>
      <div className="shell">
        <a
          href="/#work"
          className={styles.back}
          onClick={(e) => {
            e.preventDefault();
            go('/#work');
          }}
        >
          <span aria-hidden="true">←</span> Back to index
        </a>

        <div className={styles.head}>
          <span className={styles.code}>{item.code}</span>
          <span className={styles.id}>{item.id}</span>
        </div>

        <RevealText
          as="h1"
          className={`${styles.title} display`}
          immediate
          delay={0.1}
          stagger={0.08}
          reduced={reduced}
        >
          {item.name}
        </RevealText>

        <p className={styles.tagline}>{item.tagline}</p>

        <dl className={styles.meta}>
          <div className={styles.metaCell}>
            <dt>Type</dt>
            <dd>{item.label}</dd>
          </div>
          <div className={styles.metaCell}>
            <dt>Year</dt>
            <dd>{item.year}</dd>
          </div>
          <div className={styles.metaCell}>
            <dt>Role</dt>
            <dd>{item.role}</dd>
          </div>
          <div className={styles.metaCell}>
            <dt>Ref</dt>
            <dd>{item.id}</dd>
          </div>
        </dl>

        <div className={styles.body}>
          <div className={styles.summary}>
            {item.summary.map((p, i) => (
              <RevealText
                key={i}
                as="p"
                className={styles.para}
                stagger={0.04}
                reduced={reduced}
              >
                {p}
              </RevealText>
            ))}
          </div>

          <div className={styles.chipsCol}>
            <span className={styles.colLabel}>Stack</span>
            <div className={styles.chips}>
              {item.stack.map((s) => (
                <span key={s} className={styles.chip}>
                  {s}
                </span>
              ))}
            </div>

            {/* only ever rendered when the project actually has the link */}
            {(item.repo || item.demo) && (
              <div className={styles.links}>
                {item.demo && (
                  <a
                    className={`${styles.linkBtn} ${styles.linkPrimary}`}
                    href={item.demo}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="hover"
                  >
                    <span>Live demo</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {item.repo && (
                  <a
                    className={styles.linkBtn}
                    href={item.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="hover"
                  >
                    <span>Source</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}

            {item.label === 'CLIENT' && (
              <p className={styles.clientNote}>
                Client work — the source is not mine to publish.
              </p>
            )}
          </div>
        </div>

        <section className={styles.hl} aria-labelledby="hl-title">
          <h2 id="hl-title" className={styles.hlTitle}>
            <span className={styles.hlCode}>HLT</span> What it involved
          </h2>
          <ul>
            {item.highlights.map((h, i) => (
              <li key={i} className={styles.hlRow}>
                <span className={styles.hlIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {next && (
          <a
            href={`/work/${next.slug}`}
            className={styles.next}
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault();
              go(`/work/${next.slug}`);
            }}
          >
            <span className={styles.nextLabel}>Next entry — {next.code}</span>
            <span className={`${styles.nextName} display`}>{next.name}</span>
          </a>
        )}
      </div>
    </main>
  );
}
