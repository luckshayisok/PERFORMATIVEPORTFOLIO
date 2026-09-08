import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navLinks, profile } from '../../data/site';
import { useSmoothScroll } from '../../lib/SmoothScroll';
import { ScrollTrigger, useGSAP } from '../../lib/gsap';
import { useMagnetic } from '../../lib/useMagnetic';
import { usePageTransition } from '../Transition/Transition';
import styles from './Header.module.css';

function StackedLabel({ label }: { label: string }) {
  return (
    <span className={styles.stack} aria-hidden="true">
      <span className={styles.stackInner}>
        <span className={styles.stackCopy}>{label}</span>
        <span className={styles.stackCopy}>{label}</span>
      </span>
    </span>
  );
}

export function Header({ reduced }: { reduced: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollTo, stop, start } = useSmoothScroll();
  const { go } = usePageTransition();
  const location = useLocation();
  const firstOverlayLink = useRef<HTMLAnchorElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.2, reduced);

  const onHome = location.pathname === '/';

  // the cover is a printed page and takes no site chrome, so on the home
  // route the header only appears once it has been scrolled past
  const [pastCover, setPastCover] = useState(false);
  const topProbe = useRef<HTMLSpanElement>(null);
  const coverProbe = useRef<HTMLSpanElement>(null);

  /* Both states come from two 1px probes parked in the document rather than
     from a scroll listener. ScrollTrigger already owns the scroll position for
     the whole site and shares Lenis' clock, so reading these off it keeps the
     header in step with every other scroll-driven thing on the page. */
  useGSAP(() => {
    const watch = (el: HTMLElement | null, set: (v: boolean) => void) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        onEnter: () => set(true),
        onLeaveBack: () => set(false),
      });
    };
    watch(topProbe.current, setScrolled);
    watch(coverProbe.current, setPastCover);
  }, []);

  const hidden = onHome && !pastCover && !menuOpen;

  // lock scroll + trap escape while the mobile overlay is open
  useEffect(() => {
    if (menuOpen) {
      stop();
      document.body.style.overflow = 'hidden';
      firstOverlayLink.current?.focus();
    } else {
      start();
      document.body.style.overflow = '';
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, stop, start]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleAnchor = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (!onHome) {
      go(`/${href}`);
      return;
    }
    const el = document.querySelector(href);
    if (el instanceof HTMLElement) scrollTo(el, -1);
  };

  const handleHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onHome) {
      scrollTo(0);
      window.scrollTo(0, 0);
    } else {
      go('/');
    }
  };

  return (
    <>
      {/* scroll probes — see the IntersectionObserver note above */}
      <span ref={topProbe} className={styles.probeTop} aria-hidden="true" />
      <span ref={coverProbe} className={styles.probeCover} aria-hidden="true" />

      <header
        className={`${styles.header} ${scrolled ? styles.isScrolled : ''} ${
          hidden ? styles.isHidden : ''
        }`}
        data-scrolled={scrolled}
        inert={hidden}
      >
        <div className={`${styles.bar} shell`}>
          {/* the mark is decorative; the whole name lives in the sr-only span
              so the accessible name never disagrees with the visible text */}
          <a href="/" className={styles.logo} onClick={handleHome}>
            <span className="sr-only">{`${profile.name} — home`}</span>
            <svg
              viewBox="0 0 32 32"
              className={styles.logoMark}
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 4h5v19h12v5H4z" fill="currentColor" />
              <rect x="23" y="4" width="5" height="13" fill="var(--accent)" />
            </svg>
            <span className={styles.logoText} aria-hidden="true">
              <span>LKM</span>
              <span className={styles.logoId}>—01</span>
            </span>
          </a>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.navLink}
                    onClick={(e) => handleAnchor(e, link.href)}
                  >
                    <span className="sr-only">{link.label}</span>
                    <StackedLabel label={link.label} />
                  </a>
                </li>
              ))}
            </ul>

            <a
              ref={ctaRef}
              href={`mailto:${profile.email}`}
              className={styles.cta}
              data-cursor="hover"
            >
              <span className="sr-only">Let’s talk — email me</span>
              <StackedLabel label="Let’s talk" />
            </a>
          </nav>

          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">
              {menuOpen ? 'Close menu' : 'Open menu'}
            </span>
            <span aria-hidden="true">{menuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul className={styles.overlayList}>
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  ref={i === 0 ? firstOverlayLink : undefined}
                  href={link.href}
                  className={styles.overlayLink}
                  onClick={(e) => handleAnchor(e, link.href)}
                >
                  <span className={styles.overlayIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="display">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={`mailto:${profile.email}`} className={styles.overlayMail}>
          {profile.emailDisplay}
        </a>
      </div>
    </>
  );
}
