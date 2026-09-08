import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Cursor } from './components/Cursor/Cursor';
import { TransitionProvider } from './components/Transition/Transition';
import { SmoothScrollProvider } from './lib/SmoothScroll';
import { useReducedMotion } from './lib/useReducedMotion';
import { ScrollTrigger } from './lib/gsap';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

/* the detail pages are never needed to render the cover, so they are split
   out of the first load */
const WorkDetail = lazy(() =>
  import('./pages/WorkDetail').then((m) => ({ default: m.WorkDetail })),
);

function usePrecisePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return fine;
}

function Shell({ reduced }: { reduced: boolean }) {
  const location = useLocation();
  const finePointer = usePrecisePointer();

  // layout changes on every route swap — let ScrollTrigger re-measure
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <TransitionProvider reduced={reduced}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="grid-overlay" aria-hidden="true">
        <div className="grid-overlay__inner">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      <Header reduced={reduced} />

      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home reduced={reduced} />} />
          <Route
            path="/work/:slug"
            element={<WorkDetail reduced={reduced} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Cursor enabled={finePointer && !reduced} />
    </TransitionProvider>
  );
}

export default function App() {
  const reduced = useReducedMotion();

  return (
    <SmoothScrollProvider disabled={reduced}>
      <Shell reduced={reduced} />
    </SmoothScrollProvider>
  );
}
