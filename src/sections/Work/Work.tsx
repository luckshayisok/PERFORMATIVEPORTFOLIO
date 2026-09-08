import { chapters } from '../../data/site';
import { Poster } from './Poster';
import styles from './Work.module.css';

/**
 * The work chapter is the poster and nothing else — the crowd carries the
 * index, with one project pinned to each face. There is no list underneath.
 */
export function Work({ reduced }: { reduced: boolean }) {
  return (
    <section
      id="work"
      className={`${styles.section} surface-paper`}
      aria-labelledby="work-title"
    >
      <h2 id="work-title" className="sr-only">
        {`Selected work — ${chapters.work.no}, ${chapters.work.title}`}
      </h2>

      <Poster reduced={reduced} />
    </section>
  );
}
