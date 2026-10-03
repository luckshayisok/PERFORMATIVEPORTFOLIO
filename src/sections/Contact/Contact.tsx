import { useRef } from 'react';
import { chapters, profile } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import styles from './Contact.module.css';

const YEAR = new Date().getFullYear();

/**
 * Plate 04 — off the clock.
 *
 * The three ways to reach me, and a colophon that says plainly how the
 * drawings on this page were made.
 */
export function Contact({
  reduced,
  onOpenResume,
}: {
  reduced: boolean;
  onOpenResume: () => void;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(`.${styles.row}`, {
        y: 22,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: 'top 76%', once: true },
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      id="contact"
      ref={scope}
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className="shell">
        <header className={styles.head}>
          <span className="chapter">
            {chapters.contact.no} / {chapters.contact.title}
          </span>
          <h2 id="contact-title" className={styles.title}>
            Say hello.
          </h2>
        </header>

        <ul className={styles.rows}>
          <li className={styles.row}>
            <span className={styles.label}>Email</span>
            <a className={styles.value} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
          <li className={styles.row}>
            <span className={styles.label}>Phone</span>
            <a className={styles.value} href={`tel:${profile.phone}`}>
              {profile.phoneDisplay}
            </a>
          </li>
          <li className={styles.row}>
            <span className={styles.label}>GitHub</span>
            <a
              className={styles.value}
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              {profile.githubDisplay}
            </a>
          </li>
          <li className={styles.row}>
            <span className={styles.label}>Résumé</span>
            <button
              type="button"
              className={styles.value}
              onClick={onOpenResume}
              aria-haspopup="dialog"
            >
              View it here <span aria-hidden="true">&#8599;</span>
            </button>
          </li>
        </ul>

        <footer className={styles.colophon}>
          <p className={styles.note}>
            The machines above are drawn in the browser from a seeded random
            sequence — outlines resampled and jittered, shading cross-hatched
            — and so is every plate on this site. Set in Anton, Instrument
            Serif, Space Mono and Inter.
          </p>
          <p className={styles.sign}>
            <span>
              {profile.name} — {profile.location}
            </span>
            <span>&copy; {YEAR}</span>
          </p>
        </footer>
      </div>
    </section>
  );
}
