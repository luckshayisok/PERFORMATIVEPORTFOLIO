import { useId, useMemo, useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import { drawPlate, type PlateFacts, type PlateKind } from '../../lib/plot';
import styles from './Plate.module.css';

type Props = {
  kind: PlateKind;
  /** stable key for the seed — the same key always draws the same plate */
  plotKey: string;
  facts: PlateFacts;
  reduced: boolean;
  /** show the line of numbers the drawing was plotted from */
  caption?: boolean;
  className?: string;
};

/**
 * A plotted plate.
 *
 * The drawing is masked by a rectangle that opens left to right while a
 * hairline rides its edge, so the plate looks like it is being drawn by a
 * pen rather than faded in. Under reduced motion the mask is simply not
 * applied and the finished drawing is there from the start.
 */
export function Plate({
  kind,
  plotKey,
  facts,
  reduced,
  caption = true,
  className = '',
}: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const wipe = useRef<SVGRectElement>(null);
  const pen = useRef<SVGLineElement>(null);
  const uid = useId().replace(/:/g, '');
  const maskId = `plate-${uid}`;

  // seeded and pure, so this runs once per plate and never on a re-render
  const plate = useMemo(
    () => drawPlate(kind, plotKey, facts),
    [kind, plotKey, facts],
  );

  useGSAP(
    () => {
      if (reduced || !wipe.current || !pen.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 82%',
          once: true,
        },
      });

      tl.fromTo(
        wipe.current,
        { attr: { width: 0 } },
        { attr: { width: plate.size }, duration: 1.15, ease: 'none' },
      )
        .fromTo(
          pen.current,
          { attr: { x1: 0, x2: 0 }, opacity: 1 },
          {
            attr: { x1: plate.size, x2: plate.size },
            duration: 1.15,
            ease: 'none',
          },
          0,
        )
        .to(pen.current, { opacity: 0, duration: 0.2 }, 1.05);

      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === scope.current)
          .forEach((t) => t.kill());
      };
    },
    { scope, dependencies: [reduced, plate] },
  );

  return (
    <div ref={scope} className={`${styles.plate} ${className}`}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${plate.size} ${plate.size}`}
        aria-hidden="true"
      >
        {!reduced && (
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <rect
                ref={wipe}
                x="0"
                y="0"
                width="0"
                height={plate.size}
                fill="#fff"
              />
            </mask>
          </defs>
        )}
        <g
          mask={reduced ? undefined : `url(#${maskId})`}
          dangerouslySetInnerHTML={{ __html: plate.markup }}
        />
        {!reduced && (
          <line
            ref={pen}
            x1="0"
            y1="0"
            x2="0"
            y2={plate.size}
            stroke="#b83a22"
            strokeWidth="1.2"
            opacity="0"
          />
        )}
      </svg>
      {caption && <span className={styles.caption}>{plate.caption}</span>}
    </div>
  );
}
