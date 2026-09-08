const GLYPHS = '#$%&/\\<>[]{}=+*01XZ';

/**
 * Cycles an element's text through random glyphs before settling on the
 * final string. Used on the three-letter codes and the work counter — it
 * only ever writes textContent, so nothing reflows around it as long as the
 * target is monospace and the length is fixed.
 *
 * Returns a stop() so callers can cancel on unmount.
 */
export function scrambleTo(
  el: HTMLElement,
  finalText: string,
  { duration = 520, delay = 0 }: { duration?: number; delay?: number } = {},
): () => void {
  const chars = finalText.split('');
  let raf = 0;
  let timer = 0;
  let start = 0;

  const frame = (now: number) => {
    if (!start) start = now;
    const t = Math.min(1, (now - start) / duration);
    // characters lock in left to right
    const locked = Math.floor(t * chars.length * 1.35);
    el.textContent = chars
      .map((c, i) => {
        if (c === ' ' || i < locked) return c;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join('');
    if (t < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      el.textContent = finalText;
    }
  };

  timer = window.setTimeout(() => {
    raf = requestAnimationFrame(frame);
  }, delay);

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(raf);
    el.textContent = finalText;
  };
}
