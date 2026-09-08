import { useRef } from 'react';
import { profile, aboutList, telemetry, marquee, chapters } from '../../data/site';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import { RevealText } from '../../components/RevealText';
import { ScrambleCode } from '../../components/ScrambleCode';
import styles from './About.module.css';

export function About({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ---- telemetry numerals count into place ----
      if (!reduced) {
        gsap.set(`.${styles.telValue}`, { yPercent: 110, opacity: 0 });
        gsap.set(`.${styles.listItem}`, { opacity: 0, yPercent: 60 });

        gsap.to(`.${styles.telValue}`, {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: `.${styles.telemetry}`, start: 'top 85%', once: true },
        });

        gsap.to(`.${styles.listItem}`, {
          opacity: 1,
          yPercent: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.045,
          scrollTrigger: { trigger: `.${styles.list}`, start: 'top 88%', once: true },
        });
      }

      // ---- infinite marquee, reverses on scroll up ----
      const el = track.current;
      if (!el || reduced) return;

      const slow = window.matchMedia('(max-width: 760px)').matches;
      const loop = gsap.to(el, {
        xPercent: -50,
        duration: slow ? 46 : 28,
        ease: 'none',
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          // 1 while scrolling down, -1 while scrolling up
          loop.timeScale(self.direction === 1 ? 1 : -1);
        },
      });

      return () => {
        loop.kill();
        st.kill();
      };
    },
    { scope, dependencies: [reduced] },
  );

  const strip = [...marquee, ...marquee];

  return (
    <section
      id="about"
      ref={scope}
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className="shell">
        <p className={styles.chapter}>
          {chapters.about.no} / {chapters.about.title}
        </p>

        <div className={styles.head}>
          <h2 id="about-title" className={styles.headTitle}>
            <span className={styles.headCode}>
              <ScrambleCode text="ABT" reduced={reduced} />
            </span>
            <span>About</span>
          </h2>
          <span className={styles.headCount}>BIO 01-26-00</span>
        </div>

        <div className={styles.body}>
          <div className={styles.bio}>
            {profile.bio.map((para, i) => (
              <RevealText
                key={i}
                as="p"
                className={styles.para}
                stagger={0.04}
                reduced={reduced}
              >
                {para}
              </RevealText>
            ))}
            <RevealText
              as="p"
              className={`${styles.para} ${styles.paraDim}`}
              stagger={0.04}
              reduced={reduced}
            >
              {profile.bioTail}
            </RevealText>
          </div>

          <div className={styles.listCol}>
            <span className={styles.listLabel}>Index</span>
            <ul className={styles.list}>
              {aboutList.map((item, i) => (
                <li key={item} className={styles.listRow}>
                  <span className={styles.listItem}>
                    <span className={styles.listIndex}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* status board */}
        <div className={styles.telemetry}>
          {telemetry.map((t) => (
            <div key={t.label} className={styles.tel}>
              <span className={styles.telMask}>
                <span className={styles.telValue}>{t.value}</span>
              </span>
              <span className={styles.telLabel}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.marquee} surface-accent`} aria-hidden="true">
        <div ref={track} className={styles.marqueeTrack}>
          {strip.map((item, i) => (
            <span key={`${item}-${i}`} className={styles.marqueeItem}>
              {item}
              <span className={styles.marqueeDot}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
