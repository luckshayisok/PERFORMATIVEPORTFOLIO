/**
 * Splits an element's text into visual lines and wraps each one in a clipping
 * mask, so the line can be revealed with a transform alone.
 *
 * Returns the created line inners plus a `revert()` that puts the original
 * markup back (used on resize and on GSAP context cleanup).
 */
export type SplitResult = {
  lines: HTMLElement[];
  revert: () => void;
};

export function splitLines(el: HTMLElement): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  const words = text.split(/\s+/).filter(Boolean);

  if (!words.length) {
    return { lines: [], revert: () => {} };
  }

  // 1. lay every word out as its own inline-block so we can measure line tops
  el.innerHTML = '';
  const wordEls: HTMLElement[] = words.map((word, i) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return span;
  });

  // 2. group words by their vertical offset
  const groups: HTMLElement[][] = [];
  let lastTop: number | null = null;
  wordEls.forEach((w) => {
    const top = w.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      groups.push([w]);
      lastTop = top;
    } else {
      groups[groups.length - 1].push(w);
    }
  });

  // 3. rebuild as mask > inner, one pair per line
  el.innerHTML = '';
  const lines: HTMLElement[] = [];
  groups.forEach((group) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';
    const inner = document.createElement('span');
    inner.textContent = group.map((w) => w.textContent).join(' ');
    mask.appendChild(inner);
    el.appendChild(mask);
    lines.push(inner);
  });

  return {
    lines,
    revert: () => {
      el.innerHTML = original;
    },
  };
}
