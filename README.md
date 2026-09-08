# lakshya-portfolio-2026

Personal portfolio for Lakshya Maheshwari. Laid out like a technical data sheet:
a visible column grid, hairline rules, three-letter codes on every indexed item,
and nothing rounded or shadowed anywhere — but played loud, with display type up
to 190px, full-bleed inverted sections, and a live character field in the hero.

The full brief — content, visual system, section-by-section spec, and the
decisions taken while building — lives in [`docs/BRIEF.md`](docs/BRIEF.md).
Read that first if anything here needs rebuilding.

## Stack

| | |
|---|---|
| Build | Vite 8 + React 19 + TypeScript |
| Motion | GSAP + ScrollTrigger, driven through `useGSAP` |
| Scroll | Lenis, running off the GSAP ticker |
| Routing | React Router (`/` plus `/work/:slug`) |
| Styles | Plain CSS Modules + one global token sheet. No component library. |
| Type | JetBrains Mono (mono) + Bodoni Moda (display serif), self-hosted |

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

`npm run lint` runs ESLint; `npx tsc --noEmit` typechecks without emitting.

## Layout of the source

```
public/fonts/          both woff2 subsets, preloaded from index.html
src/
  data/site.ts         all copy, codes, IDs, tags — edit content here only
  styles/global.css    tokens, reset, baseline grid, a11y, reduced motion
  lib/
    gsap.ts            single registration point for GSAP + plugins
    SmoothScroll.tsx   Lenis provider, disabled under reduced motion
    splitLines.ts      wraps text into per-line clipping masks
    useReducedMotion.ts
  components/
    Header/            sticky header, stacked hover labels, mobile overlay
    Cursor/            ring cursor, fine-pointer only
    Transition/        cover-wipe route transition
    RevealText.tsx     per-line masked reveal
  sections/            Hero, Work, Stack, About, Contact
  pages/               Home, WorkDetail, NotFound
```

**All copy lives in `src/data/site.ts`.** Adding a project means adding one
object to the `work` array — the row, the counter total, the detail route at
`/work/<slug>` and the next-entry link all follow from it.

## Surfaces and the accent

The page runs three grounds. The default is ink (`#0b0b0b`) with bone type; the
Stack section is a full-bleed `.surface-bone` inversion; the About marquee, the
header CTA, the contact booking link and a hovered work row are
`.surface-accent`. Both utility classes flip the whole token set — `--bg`,
`--fg` and the de-emphasised alphas — rather than restating individual colours,
so every child re-colours on its own.

One rule to remember when adding anything: **bone on accent is 2.69:1**, so
accent fields always take ink text, and the accent must never be used as text
colour on the bone ground. The Stack section's `STK` code is a filled chip for
exactly that reason.

## The hero field

`src/components/GlyphField` draws a monospace character field to a single
canvas. It ripples away from the pointer, runs a slow scan wave, caps at 30fps,
stops rendering when scrolled out of view, and paints one static frame under
reduced motion. It reads its colours from the resolved `color` and
`outline-color` of the canvas — reading `--fg` directly returns the literal
string `var(--bone)`, which is not a valid `fillStyle`.

## How the motion is wired

- Every timeline is created inside `useGSAP` with a `scope`, so ScrollTriggers
  are reverted when the section unmounts. Navigating between `/` and a `/work`
  route repeatedly holds steady at 28 triggers on the index and 4 on a detail
  page — nothing accumulates.
- Lenis is driven from `gsap.ticker` and taps `ScrollTrigger.update` on scroll,
  so smooth scroll and scroll triggers share one clock. No `scrollerProxy` is
  needed: Lenis drives the native window scroll.
- Reveals animate `transform` and `opacity` only. The one exception is the
  spectrum arrows in the Stack section, which draw via `stroke-dashoffset`
  because the brief asks for that technique by name.
- Work rows wipe to their accent field with a `scaleY` pseudo-element rather
  than a background transition, so the hover stays on transform too.
- The three-letter codes resolve out of random glyphs (`src/lib/scramble.ts`).
  Length is fixed, so nothing reflows. The header CTA and the booking link have
  a magnetic pull (`src/lib/useMagnetic.ts`), attached only on fine pointers.

## Reduced motion

With `prefers-reduced-motion: reduce`, Lenis is never constructed, every
scroll-driven timeline is skipped, the glyph field paints one static frame and
never starts its loop, the scramble and magnetic effects are skipped, and all
content is set to its final state on first paint. `data-reduced-motion` is mirrored onto `<html>` so CSS can respond
too.

## Accessibility

Skip-to-content link, semantic landmarks, real `:focus-visible` rings on the
accent colour, `aria-expanded` / `aria-controls` on the mobile menu with Escape
to close and scroll locked while open, `sr-only` text behind the stacked hover
labels so each link still reads as a single accessible name, and a cursor that
only mounts on fine pointers.

## Deploying

The `/work/:slug` routes need an SPA fallback so a hard refresh does not 404.
`vercel.json` and `public/_redirects` (Netlify) are both included. On any other
static host, rewrite unknown paths to `/index.html`.
