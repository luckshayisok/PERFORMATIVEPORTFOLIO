import { profile } from '../../data/site';
import { RevealText } from '../../components/RevealText';
import { ScrambleCode } from '../../components/ScrambleCode';
import { GlyphField } from '../../components/GlyphField/GlyphField';
import styles from './Hero.module.css';

export function Hero({ reduced }: { reduced: boolean }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`${styles.grid} shell`}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <ScrambleCode text="LKM 01-26-00" reduced={reduced} />
            <span className={styles.eyebrowDot} aria-hidden="true">
              ◆
            </span>
            <span>{profile.role}</span>
            <span className={styles.eyebrowDot} aria-hidden="true">
              ◆
            </span>
            <span>{profile.location}</span>
          </div>

          <RevealText
            as="h1"
            className={`${styles.title} display`}
            delay={0.15}
            stagger={0.09}
            immediate
            reduced={reduced}
          >
            {`${profile.greeting} I’m ${profile.name}.`}
          </RevealText>

          <RevealText
            as="p"
            className={styles.intro}
            delay={0.45}
            stagger={0.05}
            immediate
            reduced={reduced}
          >
            {profile.intro}
          </RevealText>
        </div>

        {/* live character field — the one thing on the page that moves on
            its own and answers the pointer */}
        <div className={styles.field}>
          <div className={styles.fieldHead}>
            <ScrambleCode text="FLD" reduced={reduced} delay={300} />
            <span>live</span>
          </div>
          <div className={styles.fieldCanvas}>
            <GlyphField reduced={reduced} />
          </div>
        </div>
      </div>

      <div className={styles.strip}>
        <div className={`${styles.stripInner} shell`}>
          <span>Available for work</span>
          <span className={styles.stripMid} aria-hidden="true">
            ↓ Scroll
          </span>
          <span>2026</span>
        </div>
      </div>
    </section>
  );
}
