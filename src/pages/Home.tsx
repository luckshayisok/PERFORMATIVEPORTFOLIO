import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../sections/Hero/Hero';
import { Work } from '../sections/Work/Work';
import { Stack } from '../sections/Stack/Stack';
import { About } from '../sections/About/About';
import { Contact } from '../sections/Contact/Contact';
import { Resume } from '../components/Resume/Resume';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { ScrollTrigger } from '../lib/gsap';

export function Home({ reduced }: { reduced: boolean }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const location = useLocation();
  const { scrollTo } = useSmoothScroll();

  // arriving from a detail page with /#work etc.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash;
    const t = window.setTimeout(() => {
      const el = document.querySelector(id);
      if (el instanceof HTMLElement) scrollTo(el, -1);
    }, 120);
    return () => window.clearTimeout(t);
  }, [location.hash, scrollTo]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <main id="main">
      <Hero reduced={reduced} onOpenResume={openResume} />
      <Work reduced={reduced} />
      <Stack reduced={reduced} />
      <About reduced={reduced} />
      <Contact reduced={reduced} onOpenResume={openResume} />

      <Resume open={resumeOpen} onClose={closeResume} />
    </main>
  );
}
