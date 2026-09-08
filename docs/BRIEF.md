# Portfolio brief — source of truth

This file is the original brief for this site, kept verbatim so the project can
be rebuilt or handed over without losing the spec. Two parts: the **content**
(what the site says) and the **build spec** (how it looks and behaves).

Reference the site was art-directed against: `https://daveholloway.uk/` — the
technical-data-sheet layout, the three-letter codes, the row-based index and the
stacked hover labels come from that language.

---

## PART 1 — CONTENT

### Hero

**Lakshya Maheshwari**

Software engineer. I build IT automation and conversational AI systems — Python
endpoint scripts, Rasa bots, Django APIs, and Electron desktop apps.

### About

I work full-stack on an AI-powered IT helpdesk platform, mostly on the parts
users never see: silent installers, fixer scripts that run in SYSTEM context,
Django REST backends, and the NLU layer that decides what a request actually
means.

Most of what I do is debugging things that only break on real machines. Windows
session boundaries, exec scoping, installer exit codes, notification
identifiers. I like that category of problem.

Outside work I build small tools for my own annoyances, and I spend more time on
frontend animation than a backend engineer probably should.

### Work

**ZerofAI — Software Development Engineer**
An IT helpdesk chatbot deployed inside enterprises. Electron desktop client,
Django backend, Rasa for dialogue.

- Wrote endpoint automation scripts for silent software installs and
  self-healing fixes (Outlook, Teams, OneDrive, printers, SAP GUI, Office,
  Zscaler, JDK)
- Built Django backend features including a custom alert system and the system
  health notification pipeline
- Expanded Rasa NLU training data and built retrieval architectures for client
  bots, including a cascading KB + FAQ RAG fallback
- Fixed IPC, rendering, and notification bugs across the Electron client

### Projects

- **Zenkai** — Testing for Windows automation scripts. Restores a VM to a clean
  snapshot before each test, then asserts against real machine state afterwards.
  Built because I was tired of testing releases by hand.
- **Kaizen** — A daily productivity tracker. Next.js, Prisma, Postgres.
  Contribution heatmap, streaks, optimistic UI.
- **Code copilot (RAG)** — Semantic search over codebases using a tree-sitter
  AST chunker instead of naive text splitting, so chunks land on function and
  class boundaries. MiniLM embeddings, Chroma, Gemini Flash.

### Skills

Python · Django · Django REST Framework · Rasa · PowerShell · Windows automation
React · Next.js · JavaScript · Three.js · GSAP · Tailwind
PostgreSQL · Prisma · FAISS · sentence-transformers · Electron

### Contact

github.com/luckshayisok · LAKSHYAMAHESHWARI870@GMAIL.COM · 9354585287

---

## PART 2 — BUILD SPEC

Build a personal portfolio site. Stack: Vite + React + TypeScript, GSAP with
ScrollTrigger, Lenis for smooth scroll, plain CSS modules (no component
library). Single page with anchor sections, plus individual `/work/<slug>`
detail routes.

### Visual system

- Layout reads like a technical data sheet: everything on a visible baseline
  grid, hairline 1px rules between rows, generous whitespace, hard-edged (no
  rounded corners, no shadows).
- Two typefaces only. A monospace for labels, codes, tags, counters and
  metadata. A high-contrast display serif for headings and project names.
  Nothing else.
- Near-monochrome palette: off-black background, bone/off-white text, one accent
  color used sparingly for hover and active states only.
- Every item carries a three-letter code and a numeric ID (e.g. `ZNK 04-26-01`)
  set in mono. These codes are part of the visual texture, not decoration.

### Sections

1. **Sticky header** — logo mark left, anchor nav right (Work, Stack, About,
   Contact), plus a "Let's talk" CTA. Each nav link is two stacked copies of the
   label in a clipped container; on hover the stack translates on the Y axis so
   the second copy slides in. Header shrinks slightly and gains a bottom rule
   after scroll.

2. **Hero** — short greeting headline, then one paragraph of intro. Text reveals
   with a per-line clip-path mask on load, staggered. Nothing else on screen.

3. **Work index** — a vertical list of project rows, not cards. Each row shows
   the three-letter code, a label (CLIENT or PERSONAL), the project name in
   display type, and a row of tech tags. Each tag is preceded by a small
   triangle glyph that points up or down. On scroll, the triangles flip
   direction and the tags stagger in. A fixed counter in the corner reads
   `03/07` and updates via ScrollTrigger as each row enters the viewport.
   Hovering a row dims the others. Clicking opens the detail route.

4. **Stack section** — same row treatment, but for capability areas rather than
   projects. Each row has a code, a title, and two columns of tags — one column
   animating in from above, one from below. Below each row, a long horizontal
   arrow spans between two three-letter endpoints showing a spectrum (e.g.
   `SCR ——————> API`). The arrow draws itself on scroll using
   `stroke-dashoffset`.

5. **About** — bio in two short paragraphs on the left, a plain vertical list on
   the right. Below it, a telemetry panel styled like a status board — a few
   large monospace numerals with labels beneath them, sitting above an infinite
   horizontal marquee of short capability strings that scrolls continuously and
   reverses direction on scroll-up.

6. **Contact** — oversized headline, email and phone as large tappable links,
   plus a call booking link. Footer with copyright.

### Interaction rules

- Use `useGSAP` or a `gsap.context` cleanup in every effect. No leaked
  ScrollTriggers.
- Custom cursor: a small ring that scales up and inverts over interactive
  elements.
- Page transitions between the index and `/work` routes: cover wipe out, wipe
  in, scroll restored to top.
- Respect `prefers-reduced-motion`: disable Lenis, kill scroll-driven timelines,
  and reveal all content immediately.
- Mobile: nav collapses to a full-screen overlay, work rows stack, marquee
  slows, cursor effects disabled.

### Quality bar

- Skip-to-content link, real focus-visible styles, semantic landmarks, alt text.
- Lighthouse 95+ on performance and accessibility.
- No layout shift on font load. Preload both typefaces, use `font-display: swap`.
- Every animation driven by transform and opacity only.

---

## PART 3 — DECISIONS MADE WHILE BUILDING

Recorded so a rebuild lands in the same place.

**Typefaces.** Mono is **JetBrains Mono**, display serif is **Bodoni Moda**.
Both are self-hosted as latin-subset variable `woff2` files in `public/fonts/`
and preloaded from `index.html`, which is what makes the "no layout shift on
font load" requirement actually hold — a Google Fonts stylesheet link cannot be
preloaded the same way.

**Accent.** `#ff4d1c` on `#0b0b0b` with `#ece7de` text. Used only for hover
states, active states, the three-letter section codes and the arrow glyphs.

**Two deliberate deviations from the letter of the spec:**

1. The hero and paragraph reveals use an `overflow: hidden` line mask with a
   `translateY` on the inner span, rather than animating `clip-path` itself.
   Same visual, but it keeps the "transform and opacity only" rule intact —
   animating `clip-path` would break it.
2. The stack arrows animate `stroke-dashoffset`, which is neither transform nor
   opacity. The spec asks for that technique by name, so it stays; it is a paint
   -only property on an SVG line and does not trigger layout.

**Work items.** The résumé lists one employer and three personal projects. To
give the `NN/07` counter something to count, the ZerofAI work is split into the
four distinct pieces of work the résumé actually describes (platform, endpoint
automation, Rasa/retrieval, alerts pipeline), plus the three personal projects.
Seven rows, all of it drawn from the résumé — nothing invented.

**Telemetry numbers** are derived from the same content: seven indexed projects,
eight apps automated (the list in the résumé), three runtime surfaces
(desktop / backend / NLU), one engineer.

---

## PART 4 — VISUAL REVISION (BRIEF v2)

The first build followed Part 2 literally and read as bland. Diagnosis: the
spec describes a *quiet* system, and executed to the letter it gave a page
where almost everything sat at 10–11px in one of two greys, the accent only
appeared on hover, and every reveal was the same upward slide. The reference
site gets away with that restraint because a large illustration and a
saturated field carry the energy; this one had no equivalent anchor.

Four directions were chosen, with the palette staying near-monochrome:

**1. Extreme scale contrast.** The mono scale moved up a step across the board
(xs 11 / sm 12 / md 14 / lg 18). Three-letter codes became graphic elements at
26–40px rather than captions. Work project names run to 88px, stack titles to
74px, the hero headline to 172px, the contact headline to 168px, and the
telemetry numerals to 190px.

**2. Colour and inverted sections.** Two token sets, `.surface-bone` and
`.surface-accent`, flip `--bg`/`--fg` and the de-emphasised alphas rather than
restating colours, so every child re-colours automatically. The Stack section
is a full-bleed bone inversion, the About marquee is a full-bleed accent band,
the header CTA and the contact booking link are solid accent blocks, and each
work row wipes to an accent field on hover.

Contrast constraint worth remembering: **bone on accent is only 2.69:1**, so
accent fields always take ink text, and the accent can never be used as text on
the bone ground — that is why the Stack section's `STK` code is a filled chip
instead of coloured type.

**3. A visual centrepiece.** `GlyphField` — a canvas character field in the
hero that ripples away from the pointer while a slow scan wave travels through
it. One composited layer rather than hundreds of DOM nodes, capped at 30fps,
stops rendering when scrolled out of view, and paints a single static frame
under reduced motion. It reads its two colours from resolved `color` and
`outline-color`, because reading the custom properties directly returns the
literal string `var(--bone)` rather than an rgb value.

**4. Bolder motion.** Text scramble on every three-letter code (on scroll-in,
and again on row hover), magnetic pull on the header CTA and the booking link,
and the pointer-reactive hero field.

**Not adopted:** the horizontal-scroll work section floated as an option. The
vertical row list stayed, because the `NN/07` counter and the row-dimming
behaviour in Part 2 are both built on it.

**Deviation from Part 2:** the hero is no longer "nothing else on screen" — it
now carries an eyebrow line, the glyph field panel and a bottom status strip.
That was the deliberate cost of adding a centrepiece.

---

## PART 5 — THE COVER SHEET (STEP 1 OF THE MAGAZINE DIRECTION)

The site is being rebuilt section by section as a printed magazine, and the
whole thing is meant to read as a **story**: work → came home → build projects →
chill. Each section gets its own art-directed reference.

### Reference

A magazine cover: cropped red masthead bleeding off the top edge, a figure
multiplied onto warm paper stock, printed matter running down the left margin
(manifesto, coordinates, a halftone plate, an issue code, a barcode), volume and
date top right, colophon along the bottom, press grain over everything.

### What was built — `src/components/Cover/`

- **Masthead** — `LAKSHYA` in Anton, sized off both axes
  (`min(24.5vw, 34vh)`) and stretched `scaleY(1.75)`, because a landscape
  viewport cannot give the reference's width fraction and height fraction at
  once. The figure sits above it in z-order so it crosses the letters.
- **Figure** — the supplied halftone photograph, `mix-blend-mode: multiply` on
  the *container* (on the `<img>` it would only blend within its own stacking
  context). Its whites were clipped to pure white during processing, otherwise
  the photo prints as a visibly lighter rectangle on the paper.
- **Halftone plate** — an eye drawn to an offscreen canvas and re-printed as a
  dot screen. Deferred to an idle callback; it is decoration and costs real
  Total Blocking Time on a phone.
- **Barcode** — deterministic bar widths hashed from the issue code. Decorative,
  aria-hidden, encodes nothing.
- **Grain and ink erosion** — two inline `feTurbulence` SVGs held in
  `--grain` (multiplied over the sheet) and `--erode` (masking the masthead).

### Palette rules for the paper ground

- `--red: #c1121f` measures **4.91:1** on `--paper` and is the only red safe
  for small print.
- `--red-ink: #f02726` matches the red in the photograph but only reaches
  **3.3:1**, so it is reserved for the masthead, where the 3:1 large-text
  threshold applies.

### Three bugs worth remembering

1. **CLS from a canvas** — `.halftoneCanvas` at `width/height: 100%` inside an
   `aspect-ratio` parent fed its own intrinsic size back into layout, and the
   ResizeObserver grew it on every pass. Fixed by taking the canvas out of flow
   (`position: absolute; inset: 0`).
2. **The header cannot use a scroll listener** — it is now driven by two 1px
   probes and `ScrollTrigger`, which shares Lenis' clock. It hides itself over
   the cover on the home route and is `inert` while hidden.
3. **`<picture>` is inline** — an `<img>` inside it with `height: 100%` has
   nothing to resolve against until the `<picture>` is made a block.

### Mobile

A portrait screen cannot carry the landscape composition — the figure covers
the bottom-left corner where the printed matter lives. Below 900px the sheet
stacks instead: masthead, a cropped band of the figure, then the printed matter
on clear paper.

### Measured

Desktop 100 / 100 / 100 / 100 with CLS 0. Mobile performance **94** (LCP 2.9s),
which is under the 95 bar in Part 2. The cap is First Contentful Paint at 1.7s:
the page is entirely client-rendered, so nothing paints until the React and GSAP
bundle has run. Getting past it needs prerendering, not more tuning.

---

## PART 6 — CHAPTERS, AND THE WORK POSTER (STEP 2)

The site reads as a story — **work → came home → build → chill** — and each
section now prints its place in it. The chapters live in `chapters` in
`src/data/site.ts`:

| | |
|---|---|
| CH.01 | At work — the project index |
| CH.02 | The toolkit — capabilities |
| CH.03 | After hours — about |
| CH.04 | Off the clock — contact |

Sections were **not** restructured around the arc; they keep their content and
carry a chapter marker where their code used to sit.

### The work chapter opener — `src/sections/Work/Poster.tsx`

A 1950s cinema crowd in 3D glasses with a flat red silhouette rising out of it,
and one line of type split across the frame.

**The plate is the supplied artwork used whole — `work-plate.*`, uncropped.**

The first attempt at this section used a *different* file, one that had display
type, a body note, a barcode and a signature burned into the photograph. Two
routes were tried and both were wrong:

1. Reconstructing the plate underneath. Every inpaint left the lettering
   readable as a ghost, because the thick letter strokes survive any
   morphological opening wide enough to keep the silhouette — measured, the
   "silhouette" mask spanned `x 94..555` on the lettering rows, i.e. it had
   swallowed the letters.
2. Cropping to the one clean band above the artwork. This worked technically
   and threw away the composition, which was the whole reason for the
   reference. **Don't do this** — ask for a clean plate instead.

The clean plate solved it in one step: crowd and silhouette together, no type.
Verified before use — a connected-component pass over its red pixels returns a
single 71,009px blob and nothing else.

**It runs the full width of the screen and is never cropped**, so the block is
exactly as tall as the viewport is wide. A 3px dot screen over the top reads as
newsprint.

### The crowd is the index

There is **no row list and no counter** under the poster. Each of the seven
projects is pinned to a face in the crowd: a small paper chip carrying the
three-letter code, sitting on that person's 3D glasses. Hovering one turns it
red, slides the project name open beside it and dims the other six; clicking it
opens that project's page through the usual cover-wipe transition.

Pin coordinates live in `workPoster.pins` as percentages of the plate. Two
rules when moving them:

- **Keep them off the display type.** The first placement put two pins behind
  `it works` and `on my — machine.`. The type occupies roughly `x 3–42%,
  y 33–44%` and `x 40–97%, y 45–68%`, and the note sits at `x 3–47%,
  y 56–66%`.
- **Keep the chip at least 44px square.** `.pinCode` carries a `min-width` and
  padding for exactly this; at the smallest plate size the pin is still a
  comfortable tap target, which `target-size` is audited for.

The faces were located by rendering the plate with a percentage grid over it
and reading the coordinates off, after automatic detection of the 3D glasses
proved unreliable below the top third of the frame.

Two things to know about the plate box:

- `container-type: inline-size` on it lets the display type size in `cqw`, so
  the composition holds at any width — but it also makes the plate a stacking
  context, which means the image's `mix-blend-mode: multiply` has nothing to
  blend against. The plate carries an explicit `background: var(--paper)` for
  exactly that reason.
- The reveal masks clip descenders at tight line-heights. The lines run at
  `line-height: 1` with `padding-bottom: 0.1em`, and the tight setting is
  restored with a negative margin between masks.

Copy: `it works` / `on my — machine.`, with the note *"because the only bug
that counts is the one that reproduces on somebody else's laptop"*.

### Rules this section established

- **Small type never sits straight on a photograph.** The chapter marker, the
  note and the edition block all get a paper knockout behind them. Only the
  display type is large enough to hold its own over the crowd.
- **Ink on `--red` is 3.2:1.** The work rows used to flip to ink on the orange
  accent field; on the paper ground that field is red, so every level of type
  in a hovered row now goes solid `--paper`, which reaches 4.9:1.
- **`--fg-dim` on paper had to go up.** `rgba(19,19,19,0.6)` measured 4.46:1 —
  just under. It is now `0.66`, which gives 5.2:1.
- **`--accent` is not redefined on `.surface-bone`**, so it is still the orange
  there and only makes 2.69:1. Anything using it on that ground has to be a
  filled chip with ink type, not coloured text.

### Measured after step 2

Desktop 100 / 100 / 100 / 100, CLS 0. Mobile performance **93** — still capped
by a 1.7s First Contentful Paint from client-side rendering, with the cover
photograph and the work plate loading behind it. `color-contrast`, `link-name`,
`target-size` and `heading-order` all pass.
