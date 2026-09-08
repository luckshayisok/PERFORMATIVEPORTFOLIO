import { cover } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import { useRef } from 'react';
import { Barcode } from './Barcode';
import { HalftonePanel } from './HalftonePanel';
import styles from './Cover.module.css';

function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 0c.6 6.4 5 10.8 12 12-7 1.2-11.4 5.6-12 12-.6-6.4-5-10.8-12-12C7 10.8 11.4 6.4 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The cover sheet. A printed magazine front page: cropped wordmark, a figure
 * multiplied onto the paper stock, a halftone plate, a barcode, and press
 * grain over the whole thing.
 */
export function Cover({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from(`.${styles.wordLetter}`, {
        yPercent: 118,
        duration: 1.15,
        stagger: 0.07,
      })
        .from(
          `.${styles.figure}`,
          { opacity: 0, scale: 1.04, duration: 1.4 },
          0.15,
        )
        .from(
          `.${styles.printItem}`,
          { opacity: 0, y: 14, duration: 0.8, stagger: 0.07 },
          0.5,
        );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      ref={scope}
      className={`${styles.cover} surface-paper`}
      aria-labelledby="cover-title"
    >
      {/* ---- the figure, multiplied onto the stock ---- */}
      <div className={styles.figure}>
        <picture>
          <source
            srcSet={cover.portraitWebpSet}
            sizes={cover.portraitSizes}
            type="image/webp"
          />
          <img
            className={styles.figureImg}
            src={cover.portrait}
            srcSet={cover.portraitJpgSet}
            sizes={cover.portraitSizes}
            alt={cover.portraitAlt}
            width={1080}
            height={1200}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      {/* ---- masthead ---- */}
      <h1 id="cover-title" className={styles.wordmark}>
        <span className="sr-only">{cover.credit}</span>
        <span className={styles.wordInner} aria-hidden="true">
          {cover.wordmark.split('').map((ch, i) => (
            <span key={i} className={styles.wordLetterMask}>
              <span className={styles.wordLetter}>{ch}</span>
            </span>
          ))}
        </span>
      </h1>

      <div className={`${styles.volume} ${styles.printItem}`}>
        <span>{cover.volume}</span>
        <span>{cover.year}</span>
        <Star className={styles.volumeStar} />
      </div>

      {/* ---- left column of printed matter ---- */}
      <div className={styles.column}>
        <p className={`${styles.manifesto} ${styles.printItem}`}>
          {cover.manifesto.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        <p className={`${styles.coords} ${styles.printItem}`}>
          {cover.coords.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>

        <div className={`${styles.halftone} ${styles.printItem}`}>
          <HalftonePanel />
          <Star className={styles.halftoneStar} />
        </div>

        <div className={`${styles.issue} ${styles.printItem}`}>
          <span>{cover.issue}</span>
          <Barcode seed={cover.issue} className={styles.barcode} />
        </div>
      </div>

      {/* ---- footer matter ---- */}
      <div className={`${styles.colophon} ${styles.printItem}`}>
        <span>{cover.categories}</span>
        <span>{cover.credit}</span>
      </div>

      <div className={styles.grain} aria-hidden="true" />
    </section>
  );
}
