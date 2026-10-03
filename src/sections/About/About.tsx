import { useRef } from 'react';
import { about, chapters, profile } from '../../data/site';
import { Plate } from '../../components/Plate/Plate';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './About.module.css';

/**
 * Plate 03 — after hours.
 *
 * The prose on the left, and beside it the list of things that actually
 * break on a managed Windows endpoint. That list is the job description.
 */
export function About({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(`.${styles.tag}`, {
        x: -14,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: `.${styles.tags}`, start: 'top 80%', once: true },
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="about"
      ref={scope}
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className="shell">
        <header className={styles.head}>
          <span className="chapter">
            {chapters.about.no} / {chapters.about.title}
          </span>
          <h2 id="about-title" className="title">
            Most of what I do is
            <br />
            debugging real machines.
          </h2>
        </header>

        <div className={styles.grid}>
          <div className={styles.body}>
            {profile.bio.map((para) => (
              <p key={para.slice(0, 24)} className="prose">
                {para}
              </p>
            ))}
            <p className={`prose ${styles.tail}`}>{profile.bioTail}</p>
          </div>

          <div className={styles.aside}>
            <Plate
              kind="strata"
              plotKey="after-hours"
              facts={{ tools: about.tags.length, notes: profile.bio.length }}
              reduced={reduced}
              caption={false}
            />
            <ul className={styles.tags}>
              {about.tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
