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

---

## PART 7 — CH.02, THE TOOLKIT (THE CRT)

The capabilities section is a photograph of a beige CRT micro, cut out of its
blue studio backdrop and dropped onto the paper.

**The whole machine is what animates — nothing scrolls inside the screen.**
The section pins. You arrive zoomed in close enough that the TV fills the view
and the full skill list is readable on the glass. Keep scrolling and the camera
pulls back: the machine shrinks, straightens and settles into its place on the
page, while the list on the glass fades down to the six area headings.

A first version got this backwards — the machine stood still and the list
rolled up inside the glass. That was a misreading of the brief, not a design
choice.

### Preparing the plate — `public/skills-crt.png`

The source is a warm object on a flat blue backdrop, which breaks the rule that
plates need a white ground. It is keyed instead of multiplied:

- The object is warm and the backdrop is blue, so `(b - r) > 14` separates them
  cleanly.
- The **cast shadow is also blue**, so keying it away would leave the machine
  floating. Its alpha is derived from how much darker each pixel is than the
  backdrop — `(base_lum - lum) / base_lum` — and painted as soft grey.
- The alpha needs a `MedianFilter(5)` before the blur, or the boundary where
  the shadow meets the machine speckles into a jagged bite out of the base.
- The object is desaturated and pushed to 1.35 contrast, because a cream
  machine on cream paper otherwise disappears.

### The glass

Screen corners measured off the photograph, in the cropped image's space:

```
TL 43.77% 14.39%   TR 82.40% 10.79%
BL 45.33% 49.82%   BR 82.09% 44.96%
```

`.glass` is the screen's own bounding box with the trapezoid applied as a
`clip-path` inside it. Everything on it is sized in `cqw` off `.machine`, so
the type scales with the photograph through the entire zoom.

### The zoom — `Stack.tsx`

The close-up is a transform on `.machine`, computed from **layout offsets**
(`offsetLeft/Top/Width/Height`), never from `getBoundingClientRect` — the
transform being tweened would otherwise feed back into its own measurement.

- `transform-origin` is set to the centre of the glass, so scale and rotation
  both pivot about the screen.
- Scale is `min(vw / glassW, vh / glassH) × 0.94` — the glass fits the view
  with a sliver of bezel showing, so it still reads as a television.
- Translation moves the glass centre to the viewport centre.
- Rotation starts at `+3.4deg` to level the screen, which sits that far off
  square in the photograph, and eases to `0`.
- All four are function values recomputed on `refreshInit`, so a resize
  re-fits the close-up.

The timeline holds on the close-up for the first ~13% of the pin so the list
can be read, pulls back with `power2.inOut`, fades the chapter marker and
footer in as it lands, then holds at rest. The section is `overflow: hidden`
so the 3.5× close-up cannot spill over the neighbouring chapters.

**The listing at close-up is three columns, and width is the binding
constraint**, not height: three copies of the longest line
(`> DAT DATA & PERSISTENCE`, 24ch) must fit side by side, which caps the size at
~0.74cqw. At `0.9cqw` lines ran into the next column and the right column
clipped. Height has room to spare, so the leading opens up instead.

### Phones and reduced motion

- **Phones:** the zoom still runs, but the glass only ever carries the headings
  and the full list is printed on the paper below in two columns (one under
  420px).
- **Reduced motion:** nothing pins and nothing transforms. The machine sits at
  rest with the headings on the glass and the list printed below in three
  columns.
- The on-screen list and the printed list are never displayed together. The
  headings layer is `aria-hidden`, since it only summarises the list.

### Verified

Sampled across the pin at 1265×900: at the start the glass centre sits at
`633, 450` — the exact viewport centre — at 3.47× and 3.4°; it eases through
3.32 → 2.02 → 1.06 and lands at 1× and 0°, holding at `top: 142`. The list is
gone by the midpoint and the headings are fully in by 70%. No line collides
with its neighbouring column or overflows the glass.

On a 375×812 phone the close-up centres the glass at `187, 406` and settles
from 2.65× to 1×, with all 48 lines printed below and no horizontal overflow.

### Measured after step 3

Desktop 99 / 100 / 100 / 100, CLS 0. Mobile performance **89** — three
photographic plates on one page, on top of the 1.7s client-render first paint.

---

## PART 8 — CH.03, AFTER HOURS (THE ABOUT POSTER)

Art-directed from a film poster reference. **Only the design language carries
over** — the reference's photograph is a film still of three actors, and its
title treatment and dialogue belong to the film, so none of them are used.
Every word on this poster comes from the bio in `src/data/site.ts`.

### The composition — `src/sections/About/`

- **Wordmark `H0URS`** in Anton, `34cqw` stretched `scaleY(1.95)`, running
  5%→95% across and ending 45% of the way down.
- **A figure walking toward the reader**, crossing the bottom of the wordmark,
  with a long cast shadow leaning down-left.
- **Seven labels on hairline leader lines**, taken from the bio: session
  boundaries, system context, exit codes, exec scoping, notification ids,
  silent installers, small tools. Each is `side: 'left' | 'right' | 'mid'` in
  `aboutPoster.tags` — left lines run in from the page edge and the label ends
  where the line does; right lines run from the label out to the edge.
- **One sentence of the bio stepping down the page** in three fragments, with
  "real machines" underlined. Screen readers get the whole sentence once from
  an `sr-only` span; the three positioned fragments are `aria-hidden`, because
  whitespace between absolutely-positioned pieces is not reliably read.
- **A credits band**: the first bio paragraph as a justified block; a
  vertical よる (night) capsule beside Python / Django / ~~Sleep~~ / Rasa; a
  vertical あと (after) capsule with 仕事のあと (after work) over the "small
  tools" line; and checkboxes for つくる (build) and やすむ (rest). Japanese
  text carries `lang="ja"` and an English gloss for assistive tech.
- The capsules are the **one exception to the no-radius rule**, and need
  `border-radius: 999px !important` to beat the global `* { border-radius: 0
  !important }`.

### The figure is a stand-in

`aboutPoster.figure` currently points at the cover photograph. The intended
image is a photo of Lakshya **walking, full body, shot from above, on a plain
light floor**. To swap it:

1. Put the photo in `public/` and point `figure.src` / `srcSet` at it.
2. `python scripts/make_shadow.py public/<photo> public/about-shadow.png` —
   flood-fills the light backdrop in from the frame edges (so light areas
   *inside* the figure survive), and writes a soft black silhouette.
3. Re-run the collision check below; a slimmer figure will cast a slimmer,
   longer-reading shadow and may free up room.

The figure and its shadow are multiplied onto the paper **as one group** —
`mix-blend-mode` sits on `.walker`, not the `<img>`. The stand-in's bottom
edge is a hard frame cut, so the figure fades out over its last 18%.

### Collision rules

Checked with bounding boxes at 1265px wide:

- No label touches the figure.
- No two pieces of text overlap.
- The shadow's box ends at 79% and the sentence starts at 80.5% — the sentence
  was moved down and the figure lifted to 34%, rather than shortening the
  shadow to nothing.
- The 003/007 barcode block sits on the **right**, because the shadow leans
  left and its tail covers the left margin at that height.

### Below 960px

The absolute composition stops and the sheet stacks in flow: chapter,
wordmark (with `margin-bottom` reserving the space its stretch does not take),
figure, labels as a wrapped row, the sentence indented in steps, barcode,
credits. The `cqw` sizes are tuned for a 1200px sheet and all hit their floors
on a phone, so the dense blocks get a fixed 11px there — the bio block had
dropped to 8px.

### Known issue

In Anton the digit `0` is nearly indistinguishable from the letter `O`, so
the wordmark reads as HOURS and the clock-face trick is invisible.

### Also fixed while building this

`Stack.tsx`'s zoom measurement threw when the section was not rendered
(`offsetParent` is `null` under `display: none`), and a throw inside
ScrollTrigger's refresh takes down every scroll animation on the page. It now
returns the last good measurement instead.

### Measured after step 4

Desktop 100 / 100 / 100 / 100, CLS 0. Mobile performance 91.
`color-contrast`, `heading-order`, `valid-lang`, `image-alt` and `list` pass.

---

## PART 9 — END-TO-END POLISH PASS

A full review of the site: one design system, the portfolio rebuilt from the
real repositories, dead code removed, and a responsive/accessibility/perf pass.

### One design system

The site had split in two: the cover and chapters were on paper/red, while the
**header, contact, project detail pages and 404 were still on the original
ink/orange system**. Everything is now one ground.

- `:root` *is* the paper system — paper ground, ink type, `--accent: var(--red)`.
  Sections no longer opt into it.
- `.surface-bone` and `.surface-accent` are gone. The single remaining surface
  is `.surface-red` (red field, paper type), used by the header CTA, the
  contact CTA and a hovered work row.
- The route wipe is press red rather than a black curtain.
- **Rule that keeps biting: paper on red is 4.91:1, ink on red is 3.2:1.** A red
  field always takes paper type. The header CTA was ink-on-red and is fixed.

### Typography

Four faces, each with one job:

| Face | Used for |
|---|---|
| Anton | poster wordmarks only |
| Bodoni Moda | headlines and project names |
| JetBrains Mono | labels, codes, metadata, printed matter |
| **Inter** | running prose on the project detail pages |

Inter was added in this pass. Detail-page body copy was uppercase monospace,
which is fine for a label and hard work for a paragraph. It is deliberately
**not** used on the home page, which is printed matter end to end.

### The portfolio is now real

`lakshya0099` 404s — every repository lives under `luckshayisok`. Nine projects:
three client (ZerofAI, endpoint automation, Rasa/retrieval — no links, the
source is not mine to publish) and six personal, each carrying only links that
were already in the repository metadata:

| Project | Repo | Demo |
|---|---|---|
| Zenkai | yes | — |
| Prepify | yes | prepify-chi.vercel.app |
| MedAssist | yes | — |
| Geonix | yes | geonix-beta.vercel.app |
| Job Monitor | yes | — |
| Kaizen | yes | kaizen-theta-five.vercel.app |

Every link returns 200. Descriptions are written from each repository's README,
not invented. Detail pages render a red **Live demo** and an outlined **Source**
button only when the project actually has them; client work gets a note instead,
so a card never looks like it is missing a broken link.

**Code Copilot (RAG) was dropped** — it is on the résumé but has no repository,
so nothing could be linked or verified. Say the word and it goes back as a
link-less entry.

### Bugs found and fixed

1. **Pins collided with the display type** at 768px (ZRF under the chapter chip,
   which is a fixed pixel size and so covers a larger share of a smaller plate)
   and badly at 375px, where the mobile type sits in completely different places.
2. **Nine chips on a 375px plate** were unreadable and poor tap targets. Pins are
   now a desktop device; phones get a proper index list under the plate. Only one
   of the two is ever in the tree.
3. **Text below the legible minimum** — 11px covered 45% of the text on a phone.
   The mono scale steps up below 700px, the About poster's hard-coded 11px
   overrides went to 12px, and the CRT glass (too narrow for full titles at a
   legible size) shows only the three-letter codes there.
4. **417 KiB of oversized images.** The CRT was a 403 KB PNG; as WebP with alpha
   it is 84 KB. Added 1000w plate and 650w portrait steps so a phone stops
   rounding up to the largest file.
5. The booking CTA pointed at `cal.com`'s own home page. It is a mailto until a
   real booking link exists.

### Dead code removed

`src/sections/Hero/` and `src/components/GlyphField/` (replaced by the cover),
the `aboutList`, `telemetry` and `marquee` exports, and the unused `profile`
fields `role`, `greeting` and `intro`.

### Measured

| | perf | a11y | best practices | SEO | CLS |
|---|---|---|---|---|---|
| Home, desktop | 100 | 100 | 100 | 100 | 0 |
| Home, mobile | 89 | 100 | 100 | 100 | 0 |
| Detail, desktop | 100 | 100 | 100 | 100 | 0 |

No console errors. No horizontal scroll at 1440, 1280, 1024, 768, 412 or 375.
Nine routes plus the SPA fallback resolve. Mobile performance is capped by a
1.7s first paint — the page is client-rendered, so nothing paints until the
bundle runs. Prerendering is the fix, and it is its own piece of work.

---

## Part 10 — The ink redesign (2026-10-03)

The magazine build was scrapped. The new direction is **ink on paper**: one
drawing language for the whole site, after a reference of a heavy black
wordmark with crosshatched characters climbing the letters.

### The engine

`src/lib/ink.ts` is the whole house style in one file. Shapes go in as plain
point lists; it resamples every edge at a fixed step and nudges each sample
off the true line, so a straight edge reads as drawn rather than printed.
Shading is real cross-hatch — parallel strokes at an angle, emitted as one
path and clipped to the shape — never a texture image.

Everything is seeded (`makeRng`, xorshift32), so a drawing is identical on
every render and between reloads. Nothing ever jumps.

`src/lib/plot.ts` uses the same engine with a finer pen for the plates:
`weave`, `orbits`, `strata` and `graph`. Each one is driven by numbers that
are actually true of the thing it draws — commits in the repository (read
from the GitHub API on 2026-10-03), tools in the stack, things the project
does. Change the data and the drawing changes.

### The hero

`sections/Hero` draws the name and the machines in **one** SVG coordinate
space, so they can never drift apart at any width — the stage scales as a
single object. Four constants are the contract between the type and the
drawings: `L1_BASE`, `L1_CAP`, `L2_BASE`, `GROUND`.

Two rules learned by getting them wrong first:

- **Big objects never cover a whole letter.** They stand on the ground and
  cover the letters' feet. An earlier pass put the CRT in front of "MA" and
  the name read "HESHWARI".
- **Small objects stand on top of the first line**, which needs headroom in
  the viewBox (`y = -46`) or the bot's aerial and the mug's steam are cropped.

### The work

Five projects, down from nine: the three client entries and Zenkai were cut
on request. Each card carries a **real screenshot** of the running project,
captured from its own deployment, plus its live and source links. Where a
project has no public build to photograph, the card falls back to a plotted
plate. The card's title link is stretched over the whole card and the two
buttons sit above it, so no anchor is ever nested inside another.

### Still needed from Lakshya

- `public/work/medassist.*` and `public/work/job-monitor.*` — no public build
  exists to photograph, so these two fall back to plates.
- Better `public/work/geonix.*` and `public/work/kaizen.*`: both deployments
  redirect to a sign-in screen, so the captures show the login, not the
  product. Signing in is not mine to do.
- Images are referenced from `shot` in `src/data/site.ts`; drop in a `.jpg`
  and `.webp` at the same paths and update `width`/`height`.

### Part 10b — résumé and the real toolkit (2026-10-03)

- `public/Lakshya-Maheshwari-Resume.pdf` is the download behind the hero's
  second button and the Résumé row in Contact. Replace the file in place to
  update it; the path is `profile.resume` in `src/data/site.ts`.
- `stack` is now taken verbatim from the résumé's Technical Skills —
  Languages, Frameworks & Libraries, Databases, AI/ML & RAG, Dev Tools &
  Platforms, Coursework. 56 tools, which is what the toolkit plate now draws.
- Geonix gained the backend the site was missing (Django REST, PostgreSQL,
  Redux Toolkit) — the résumé lists it, the old entry did not.
- Location is Delhi, India, per the résumé.

**Screenshots are captured with headless Chrome, not the preview pane**, which
only paints a 645×460 region and produced soft, upscaled images:

```
chrome --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 --force-device-scale-factor=2 \
  --virtual-time-budget=12000 --screenshot=out.png <url>
```

That gives 2880×1800; `public/work/<slug>-{800,1600}.{jpg,webp}` are resized
from it and referenced through `srcSet`/`sizes`, so a 2× display gets the
1600 and a phone never downloads it.

### Part 10c — the stage, rebalanced, and the résumé read in place

The first cut of the hero had the two lines of the name touching: the M of
MAHESHWARI collided with the LA above it, which reads as a mistake rather
than a decision. The lines now have 64px of air between them (`L1_BASE` 300,
`L2_CAP` 364) and only the drawings cross the gap.

The ground band was also a hole — two machines at the edges and nothing
between them. It now reads left to right: screen, lamp, plant, keyboard,
floppy, tower, with a cable running under all of it and contact shadows
where each object meets the ground. Three rules held while placing them:

- an object may cover a letter's feet, never a whole letter — the tower was
  swallowing the final I and had to move right and down;
- anything standing on the first line needs headroom in the viewBox
  (`y = -62`), or the bot's aerial and the mug's steam crop;
- nothing floats: every object gets a shadow, and the cable runs off the
  frame rather than ending in a plug under the ground line.

**The résumé opens in a panel** (`components/Resume`) rather than downloading
on click — looking at a file is not a commitment, downloading one is. The
panel carries the download, an open-in-a-tab link for mobile browsers that
will not render a PDF in an iframe, Escape to close, a focus trap, and it
returns focus to whichever button opened it.

### Part 11 — the machine in 3D (Blender)

The CRT from the hero also exists as geometry. `scripts/crt_turntable.py`
builds it in code — there is no .blend file to lose — and renders it turning,
40 frames, 9° apart:

```
"C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" \
    --background --python scripts/crt_turntable.py
```

It is rendered with **Freestyle**, so what comes out is line art, not a
shaded render: black outlines with a Perlin modifier so the line wobbles the
way the browser's own ink does, flat paper surfaces, and a transparent film
so the frames drop straight onto the page. The faces turned away from the key
direction are filled with hard diagonal bands — the same cross-hatch the 2D
machines carry — via a Wave texture masked by the normal's dot product.

Three things that cost time, for next time:

- the engine enum is `BLENDER_EEVEE` in Blender 5.x, not `BLENDER_EEVEE_NEXT`;
- `PERLIN_NOISE_1D` takes `frequency`, not `scale`;
- **node colours are linear, not sRGB.** Passing `#121110` straight in
  rendered as mid grey. `srgb()` in the script does the conversion, and that
  single fix is what made the lines read as ink.

The PNGs land in `scripts/_turntable/` (gitignored, ~13MB). What ships is
`public/turntable/*.webp` — 40 frames, 700px, 773KB in total, about 19KB
each. `components/Turntable` decodes them once and scrubs them on a canvas
driven by ScrollTrigger; swapping forty `<img>` elements thrashes layout,
and a canvas lands the scrub on a frame that is already decoded. Under
reduced motion it simply holds frame 0.
