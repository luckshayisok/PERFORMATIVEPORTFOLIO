/**
 * A decorative barcode. The bar widths are derived from the seed string so the
 * same issue code always prints the same pattern — it encodes nothing, it is
 * printed matter, and it is hidden from assistive tech.
 */
export function Barcode({
  seed,
  className,
  bars = 64,
}: {
  seed: string;
  className?: string;
  bars?: number;
}) {
  // xorshift so the pattern is stable without pulling in a PRNG dependency
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const next = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return Math.abs(h % 1000) / 1000;
  };

  const rects: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < bars; i++) {
    const w = 0.6 + next() * 2.2;
    const gap = 0.6 + next() * 1.6;
    rects.push({ x, w });
    x += w + gap;
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${x} 30`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y="0" width={r.w} height="30" fill="currentColor" />
      ))}
    </svg>
  );
}
