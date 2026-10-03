import { useEffect, useRef } from 'react';
import { profile } from '../../data/site';
import { useSmoothScroll } from '../../lib/SmoothScroll';
import styles from './Resume.module.css';

/**
 * The résumé, read on the page first.
 *
 * Downloading a file is a commitment; looking at one is not. So the
 * buttons open this, and the download sits inside it for anyone who
 * wants the file.
 *
 * The PDF is shown in an iframe, which every desktop browser renders
 * natively. Mobile browsers often refuse to, so the frame always comes
 * with a visible "open in a new tab" link rather than a blank panel.
 */
export function Resume({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;

    stop();
    document.body.style.overflow = 'hidden';
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      // keep the keyboard inside the dialog while it is open
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button, iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      start();
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose, stop, start]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
      >
        <header className={styles.bar}>
          <span id="resume-title" className={styles.title}>
            {profile.name} — résumé
          </span>

          <span className={styles.tools}>
            <a
              className={styles.tool}
              href={profile.resume}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open in a tab <span aria-hidden="true">&#8599;</span>
            </a>
            <a
              className={`${styles.tool} ${styles.solid}`}
              href={profile.resume}
              download={profile.resumeName}
            >
              Download <span aria-hidden="true">&#8595;</span>
            </a>
            <button
              ref={closeBtn}
              type="button"
              className={styles.close}
              onClick={onClose}
            >
              <span className="sr-only">Close the résumé</span>
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </header>

        <div className={styles.frame}>
          <iframe
            className={styles.pdf}
            src={`${profile.resume}#view=FitH`}
            title={`${profile.name} — résumé`}
          />
        </div>
      </div>
    </div>
  );
}
