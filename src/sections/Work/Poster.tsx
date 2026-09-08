import { useRef } from 'react';
import { chapters, work, workPoster } from '../../data/site';
import { gsap, useGSAP } from '../../lib/gsap';
import { Barcode } from '../../components/Cover/Barcode';
import { usePageTransition } from '../../components/Transition/Transition';
import styles from './Poster.module.css';

/**
 * The work chapter — the crowd *is* the index.
 *
 * The plate is the supplied artwork used whole, run the full width of the
 * screen and never cropped, so the block is exactly as tall as the viewport
 * is wide. Each project is pinned to a face in the crowd; clicking a face
 * opens that project's page.
 */
export function Poster({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const { go } = usePageTransition();

  useGSAP(
    () => {
      if (reduced) return;

      gsap
        .timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true },
        })
        .from(`.${styles.plate}`, { opacity: 0, scale: 1.03, duration: 1.1 })
        .from(
          `.${styles.typeLine}`,
          { yPercent: 110, duration: 1, stagger: 0.09 },
          0.25,
        )
        .from(
          `.${styles.fadeIn}`,
          { opacity: 0, y: 12, duration: 0.7, stagger: 0.06 },
          0.5,
        )
        .from(
          `.${styles.pin}`,
          { opacity: 0, scale: 0.72, duration: 0.55, stagger: 0.07 },
          0.7,
        );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div ref={scope} className={styles.poster}>
      <div className={styles.plate}>
        <picture>
          <source
            srcSet={workPoster.plateWebpSet}
            sizes={workPoster.plateSizes}
            type="image/webp"
          />
          <img
            className={styles.plateImg}
            src={workPoster.plate}
            srcSet={workPoster.plateSet}
            sizes={workPoster.plateSizes}
            alt=""
            width={1950}
            height={1950}
            loading="lazy"
            decoding="async"
          />
        </picture>

        <span className={`${styles.chapter} ${styles.fadeIn}`}>
          {chapters.work.no} / {chapters.work.title}
        </span>

        <p className={styles.type}>
          <span className={styles.typeA}>
            <span className={styles.typeMask}>
              <span className={styles.typeLine}>{workPoster.lineA}</span>
            </span>
          </span>
          <span className={styles.typeB}>
            {workPoster.lineB.map((line) => (
              <span key={line} className={styles.typeMask}>
                <span className={styles.typeLine}>{line}</span>
              </span>
            ))}
          </span>
        </p>

        {/* the crowd is the index — one face per project */}
        <ul className={styles.pins}>
          {workPoster.pins.map((pin) => {
            const item = work.find((w) => w.slug === pin.slug);
            if (!item) return null;
            return (
              <li key={pin.slug}>
                <a
                  className={styles.pin}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  href={`/work/${item.slug}`}
                  data-cursor="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    go(`/work/${item.slug}`);
                  }}
                >
                  <span className={styles.pinCode}>{item.code}</span>
                  <span className={styles.pinName}>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className={`${styles.note} ${styles.fadeIn}`}>{workPoster.note}</p>

        <div className={`${styles.edition} ${styles.fadeIn}`}>
          <Barcode
            seed={workPoster.edition}
            className={styles.barcode}
            bars={34}
          />
          <span className={styles.editionText}>
            <span>{workPoster.edition}</span>
            <span>{workPoster.editionLabel}</span>
          </span>
        </div>

        <svg
          className={`${styles.mark} ${styles.fadeIn}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 0c.6 6.4 5 10.8 12 12-7 1.2-11.4 5.6-12 12-.6-6.4-5-10.8-12-12C7 10.8 11.4 6.4 12 0z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
