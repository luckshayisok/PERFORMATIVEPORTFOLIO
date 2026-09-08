import { usePageTransition } from '../components/Transition/Transition';
import styles from './NotFound.module.css';

export function NotFound() {
  const { go } = usePageTransition();

  return (
    <main id="main" className={styles.page}>
      <div className="shell">
        <span className={styles.code}>404 — NO ENTRY</span>
        <h1 className={`${styles.title} display`}>Not indexed.</h1>
        <a
          href="/"
          className={styles.back}
          onClick={(e) => {
            e.preventDefault();
            go('/');
          }}
        >
          <span aria-hidden="true">←</span> Back to index
        </a>
      </div>
    </main>
  );
}
