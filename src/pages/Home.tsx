import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Cover } from '../components/Cover/Cover';
import { Work } from '../sections/Work/Work';
import { Stack } from '../sections/Stack/Stack';
import { About } from '../sections/About/About';
import { Contact } from '../sections/Contact/Contact';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { ScrollTrigger } from '../lib/gsap';

export function Home({ reduced }: { reduced: boolean }) {
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
      <Cover reduced={reduced} />
      <Work reduced={reduced} />
      <Stack reduced={reduced} />
      <About reduced={reduced} />
      <Contact reduced={reduced} />
    </main>
  );
}
