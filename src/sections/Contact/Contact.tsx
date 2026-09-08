import { profile, chapters } from '../../data/site';
import { RevealText } from '../../components/RevealText';
import { ScrambleCode } from '../../components/ScrambleCode';
import { useMagnetic } from '../../lib/useMagnetic';
import styles from './Contact.module.css';

export function Contact({ reduced }: { reduced: boolean }) {
  const year = new Date().getFullYear();
  const bookRef = useMagnetic<HTMLAnchorElement>(0.22, reduced);

  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className="shell">
        <p className={styles.chapter}>
          {chapters.contact.no} / {chapters.contact.title}
        </p>

        <div className={styles.head}>
          <span className={styles.headCode}>
            <ScrambleCode text="CTC" reduced={reduced} />
          </span>
          <span className={styles.headCount}>CTC 09-26-01</span>
        </div>

        <RevealText
          as="h2"
          className={`${styles.title} display`}
          stagger={0.08}
          reduced={reduced}
        >
          Got something that only breaks on real machines?
        </RevealText>
        <span id="contact-title" className="sr-only">
          Contact
        </span>

        <ul className={styles.links}>
          <li className={styles.linkRow}>
            <span className={styles.linkLabel}>Email</span>
            <a
              className={styles.link}
              href={`mailto:${profile.email}`}
              data-cursor="hover"
            >
              {profile.emailDisplay}
            </a>
          </li>
          <li className={styles.linkRow}>
            <span className={styles.linkLabel}>Phone</span>
            <a
              className={styles.link}
              href={`tel:${profile.phone}`}
              data-cursor="hover"
            >
              {profile.phoneDisplay}
            </a>
          </li>
          <li className={styles.linkRow}>
            <span className={styles.linkLabel}>Code</span>
            <a
              className={styles.link}
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="hover"
            >
              {profile.githubDisplay}
            </a>
          </li>
        </ul>

        <a
          ref={bookRef}
          className={`${styles.book} surface-accent`}
          href={profile.callUrl}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor="hover"
        >
          <span>Book a video call</span>
          <span aria-hidden="true" className={styles.bookArrow}>
            ↗
          </span>
        </a>
      </div>

      <footer className={styles.footer}>
        <div className={`${styles.footerInner} shell`}>
          <span>
            © {year} {profile.name}
          </span>
          <span className={styles.footerMid}>
            Built with Vite · React · GSAP · Lenis
          </span>
          <span>LKM — {profile.location}</span>
        </div>
      </footer>
    </section>
  );
}
