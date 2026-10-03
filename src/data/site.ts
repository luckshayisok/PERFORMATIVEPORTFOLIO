/* ============================================================
   SITE DATA
   Every indexed item carries a three-letter code and a numeric
   ID in the form  CODE MM-YY-NN.  These are part of the visual
   texture of the sheet, not decoration.
   ============================================================ */

export const profile = {
  name: 'Lakshya Maheshwari',
  location: 'India',
  email: 'lakshyamaheshwari870@gmail.com',
  emailDisplay: 'LAKSHYAMAHESHWARI870@GMAIL.COM',
  phone: '+919354585287',
  phoneDisplay: '+91 93545 85287',
  github: 'https://github.com/luckshayisok',
  githubDisplay: 'github.com/luckshayisok',
  bio: [
    'I work full-stack on an AI-powered IT helpdesk platform, mostly on the parts users never see: silent installers, fixer scripts that run in SYSTEM context, Django REST backends, and the NLU layer that decides what a request actually means.',
    'Most of what I do is debugging things that only break on real machines. Windows session boundaries, exec scoping, installer exit codes, notification identifiers. I like that category of problem.',
  ],
  bioTail:
    'Outside work I build small tools for my own annoyances, and I spend more time on frontend animation than a backend engineer probably should.',
} as const;

/* ---- cover sheet ----
   Everything printed on the first screen. `coords` and `portrait` are the two
   fields most likely to need changing: set coords to your own city, and drop
   your own photo at the portrait path (a white background works best — the
   image is multiplied onto the paper, so the backdrop drops away and only
   the figure prints). */
export const cover = {
  wordmark: 'LAKSHYA',
  volume: 'VOL.01',
  year: 'MMXXVI',
  manifesto: ['Software is theory.', 'Machines are real.', 'Real is where it breaks.'],
  coords: ['28.6139° N', '77.2090° E'],
  issue: 'LKM 01-26',
  categories: 'Automation / Conversational AI / Interfaces',
  credit: 'Software engineer — Lakshya Maheshwari',
  /* three widths of each format; the browser picks one off `sizes` so a
     phone never pulls the 1080px plate */
  portrait: '/portrait-1080.jpg',
  portraitJpgSet:
    '/portrait-540.jpg 540w, /portrait-650.jpg 650w, /portrait-810.jpg 810w, /portrait-1080.jpg 1080w',
  portraitWebpSet:
    '/portrait-540.webp 540w, /portrait-650.webp 650w, /portrait-810.webp 810w, /portrait-1080.webp 1080w',
  portraitSizes: '(max-width: 900px) 78vw, 58vw',
  portraitAlt:
    'Lakshya Maheshwari at a computer, rendered as a red and black halftone print.',
} as const;

/* ---- chapter titles ----
   The site reads as a story: at work, the toolkit, after hours, sign off.
   Each section prints its chapter in the same place its code used to sit. */
export const chapters = {
  work: { no: 'CH.01', title: 'At work' },
  stack: { no: 'CH.02', title: 'The toolkit' },
  about: { no: 'CH.03', title: 'After hours' },
  contact: { no: 'CH.04', title: 'Off the clock' },
} as const;

/* ---- the work poster ----
   The plate is the supplied artwork used whole: the cinema crowd with the red
   silhouette already on it. It runs the full width of the screen and is never
   cropped, so the block is as tall as the viewport is wide. */
export const workPoster = {
  plate: '/work-plate.jpg',
  plateSet:
    '/work-plate-650.jpg 650w, /work-plate-1000.jpg 1000w, /work-plate.jpg 1300w, /work-plate-1950.jpg 1950w',
  plateWebpSet:
    '/work-plate-650.webp 650w, /work-plate-1000.webp 1000w, /work-plate.webp 1300w, /work-plate-1950.webp 1950w',
  plateSizes: '100vw',
  lineA: 'it works',
  lineB: ['on my', '— machine.'],
  note: 'because the only bug that counts is the one that reproduces on somebody else’s laptop',
  edition: '— 001/009',
  editionLabel: 'index',
  /* Each project is pinned to a face in the crowd. Coordinates are percentages
     of the plate and mark the centre of the pin. They have to stay clear of
     one another AND of the display type, the note, the chapter marker and the
     edition block — see docs/BRIEF.md for those zones. */
  pins: [
    { slug: 'zerofai-helpdesk-platform', x: 30, y: 3 },
    { slug: 'endpoint-automation', x: 51, y: 6 },
    { slug: 'rasa-nlu-retrieval', x: 74, y: 6 },
    { slug: 'zenkai', x: 33, y: 21 },
    { slug: 'prepify', x: 63, y: 22 },
    { slug: 'medassist', x: 95, y: 34 },
    { slug: 'geonix', x: 7, y: 73 },
    { slug: 'job-monitor', x: 50, y: 74 },
    { slug: 'kaizen', x: 90, y: 78 },
  ],
} as const;

/* ---- the about poster (CH.03 / After hours) ----
   A red wordmark, a figure with a long cast shadow, labels on hairline leader
   lines, a sentence stepping down the page, and a dense credits band along
   the bottom. All positions are percentages of the poster block.

   `figure` is a STAND-IN: the cover photo, until a photo of Lakshya walking,
   shot from above on a plain light floor, replaces it. Make its shadow with
   `python scripts/make_shadow.py <photo> public/about-shadow.png`. */
export const aboutPoster = {
  wordmark: 'H0URS',
  figure: {
    src: '/portrait-1080.jpg',
    srcSet: '/portrait-540.jpg 540w, /portrait-650.jpg 650w, /portrait-810.jpg 810w, /portrait-1080.jpg 1080w',
    webpSet:
      '/portrait-540.webp 540w, /portrait-650.webp 650w, /portrait-810.webp 810w, /portrait-1080.webp 1080w',
    shadow: '/about-shadow.png',
    width: 1080,
    height: 1200,
    standIn: true,
  },
  /* side 'left': the line runs in from the left edge and the label ends where
     the line does. 'right': it starts at x and runs out to the right edge.
     'mid': a short line of `len` starting at x. */
  tags: [
    { text: 'Session boundaries', side: 'mid', x: 14, y: 49.6, len: 15 },
    { text: 'System context', side: 'left', x: 17, y: 54.6 },
    { text: 'Exit codes', side: 'left', x: 23, y: 60.2 },
    { text: 'Exec scoping', side: 'right', x: 74, y: 49.2 },
    { text: 'Notification ids', side: 'right', x: 78, y: 55.4 },
    { text: 'Silent installers', side: 'right', x: 80, y: 61 },
    { text: 'Small tools', side: 'right', x: 70, y: 66.4 },
  ],
  /* one sentence from the bio, set as three steps down the page */
  steps: [
    { text: 'Most of what I do is debugging', x: 16.8, y: 80.5 },
    { text: 'things that only break', x: 45.7, y: 83.5 },
    { text: 'on', mark: 'real machines', after: '.', x: 62.7, y: 86.5 },
  ],
  credits: {
    label: 'よる',
    labelGloss: 'night',
    names: ['Python', 'Django', 'Sleep', 'Rasa'],
    struck: 'Sleep',
  },
  aside: {
    label: 'あと',
    labelGloss: 'after',
    headline: '仕事のあと',
    headlineGloss: 'After work',
  },
  checks: [
    { text: 'つくる。', gloss: 'Build.' },
    { text: 'やすむ。', gloss: 'Rest.' },
  ],
  edition: '— 003/007',
  editionLabel: 'after hours',
} as const;

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export type WorkLabel = 'CLIENT' | 'PERSONAL';

export type WorkItem = {
  code: string;
  id: string;
  slug: string;
  label: WorkLabel;
  name: string;
  tagline: string;
  year: string;
  role: string;
  tags: string[];
  summary: string[];
  highlights: string[];
  stack: string[];
  /** Real links only. Client work has none — it is not mine to publish. */
  repo?: string;
  demo?: string;
};

export const work: WorkItem[] = [
  {
    code: 'ZRF',
    id: 'ZRF 01-25-01',
    slug: 'zerofai-helpdesk-platform',
    label: 'CLIENT',
    name: 'ZerofAI Helpdesk',
    tagline: 'An IT helpdesk chatbot deployed inside enterprises.',
    year: '2025',
    role: 'Software Development Engineer',
    tags: ['Electron', 'Django', 'Rasa', 'Python', 'IPC'],
    summary: [
      'An IT helpdesk chatbot deployed inside enterprises: an Electron desktop client on the endpoint, a Django backend, and Rasa driving dialogue.',
      'I work across all three surfaces — the desktop client the employee talks to, the API that brokers the request, and the alert and health pipeline that turns raw endpoint signals into something a person can act on.',
    ],
    highlights: [
      'Full-stack ownership across the Electron client, Django services and the Rasa dialogue layer.',
      'Built a custom alert system and the system health notification pipeline end to end.',
      'Fixed IPC, rendering and notification bugs, including duplicates caused by identifier collisions.',
      'Debugged failures that only reproduce on real machines — Windows session boundaries, exec scoping.',
    ],
    stack: ['Electron', 'Django', 'Rasa', 'Python', 'PostgreSQL', 'Windows'],
  },
  {
    code: 'EPA',
    id: 'EPA 03-25-02',
    slug: 'endpoint-automation',
    label: 'CLIENT',
    name: 'Endpoint Automation',
    tagline: 'Silent installers and self-healing fixer scripts.',
    year: '2025',
    role: 'Automation Engineer',
    tags: ['PowerShell', 'Python', 'SYSTEM', 'MSI/EXE'],
    summary: [
      'Endpoint automation scripts for silent software installs and self-healing fixes, executed on managed machines without any user interaction.',
      'The scripts run in SYSTEM context, which means no user session, no mapped drives and no assumptions — every path, exit code and registry hive has to be handled explicitly.',
    ],
    highlights: [
      'Silent install and repair coverage for Outlook, Teams, OneDrive, printers, SAP GUI, Office, Zscaler and JDK.',
      'Fixer scripts that run in SYSTEM context and recover the endpoint without an admin visit.',
      'Installer exit-code handling and session-boundary work so results report back accurately.',
    ],
    stack: ['PowerShell', 'Python', 'Windows Registry', 'MSI', 'Task Scheduler'],
  },
  {
    code: 'RSA',
    id: 'RSA 05-25-03',
    slug: 'rasa-nlu-retrieval',
    label: 'CLIENT',
    name: 'Rasa NLU & Retrieval',
    tagline: 'Training data, retrieval architecture, RAG fallback.',
    year: '2025',
    role: 'NLU / Retrieval',
    tags: ['Rasa', 'NLU', 'RAG', 'Retrieval'],
    summary: [
      'Expanded the Rasa NLU training data and built retrieval architectures for client bots, so the assistant answers from the customer’s own material rather than guessing.',
      'The core of it is a cascading fallback: knowledge base first, FAQ second, RAG last — each stage only runs when the one above it has nothing confident to say.',
    ],
    highlights: [
      'Expanded Rasa NLU training data across client intents.',
      'Built retrieval architectures per client bot.',
      'Designed a cascading KB + FAQ RAG fallback chain.',
    ],
    stack: ['Rasa', 'Python', 'RAG', 'Vector search', 'Django'],
  },
  {
    code: 'ZNK',
    id: 'ZNK 04-26-04',
    slug: 'zenkai',
    label: 'PERSONAL',
    name: 'Zenkai',
    tagline: 'pytest against a real Windows VM.',
    year: '2026',
    role: 'Author',
    tags: ['Python', 'pytest', 'VM', 'Windows'],
    summary: [
      'A pytest plugin that reverts a Windows VM to a named snapshot before every test, so each test starts on a machine byte-for-byte identical to the one the last test started on.',
      'Built for the thing I do at work: PowerShell scripts, installers and endpoint tooling. A script that passes on a dirty machine tells you almost nothing.',
    ],
    highlights: [
      'Restores the VM to a known-clean snapshot before every test function runs.',
      'Asserts against real machine state — services, registry, filesystem — not mocks.',
      'Turns a manual pre-release checklist into a repeatable run.',
    ],
    stack: ['Python', 'pytest', 'PowerShell', 'Hypervisor snapshots', 'Windows'],
    repo: 'https://github.com/luckshayisok/zenkai',
  },
  {
    code: 'PRP',
    id: 'PRP 09-26-05',
    slug: 'prepify',
    label: 'PERSONAL',
    name: 'Prepify',
    tagline: 'An AI interview coach that talks back.',
    year: '2026',
    role: 'Author',
    tags: ['Next.js', 'TypeScript', 'Voice AI', 'Monaco'],
    summary: [
      'An interview coach with three rounds: timed MCQs generated for any topic and difficulty, a spoken voice interview, and a coding round in a Monaco editor.',
      'Answers are scored server-side with explanations and a per-topic weak-area breakdown. Voice transcripts are graded on communication, technical accuracy, STAR structure, confidence and filler words.',
    ],
    highlights: [
      'Three interview modes — MCQ, voice and coding — with questions personalised from your résumé.',
      'A Vapi voice agent runs technical, behavioural or mixed interviews and grades the transcript.',
      'Progress dashboard with XP, levels, streaks, badges and a leaderboard.',
    ],
    stack: ['Next.js', 'TypeScript', 'Vapi', 'Monaco Editor', 'Auth'],
    repo: 'https://github.com/luckshayisok/prepify',
    demo: 'https://prepify-chi.vercel.app',
  },
  {
    code: 'MED',
    id: 'MED 09-26-06',
    slug: 'medassist',
    label: 'PERSONAL',
    name: 'MedAssist',
    tagline: 'Medication adherence for older adults.',
    year: '2026',
    role: 'Author',
    tags: ['Expo', 'React Native', 'Express', 'Prisma'],
    summary: [
      'A medication-adherence app aimed at older adults: an Expo / React Native app on the phone, an Express and PostgreSQL API on the server.',
      'The backend runs in an in-memory mode as well, so the whole thing can be brought up without provisioning a database first.',
    ],
    highlights: [
      'Expo Router app built with React Native Reusables and NativeWind.',
      'Express 5 + Prisma 7 API over PostgreSQL, with a no-database development mode.',
      'Architecture, schema and release plan documented in the repository.',
    ],
    stack: ['Expo', 'React Native', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
    repo: 'https://github.com/luckshayisok/medassist',
  },
  {
    code: 'GNX',
    id: 'GNX 04-26-07',
    slug: 'geonix',
    label: 'PERSONAL',
    name: 'Geonix',
    tagline: 'Attendance and geofencing for a workforce.',
    year: '2026',
    role: 'Author',
    tags: ['React', 'Vite', 'TypeScript', 'Geofencing'],
    summary: [
      'An employee attendance and geofencing system: a React dashboard for the web, with shared types, services and utilities factored out for a React Native client.',
      'Attendance is bound to location, so a check-in only counts inside the boundary it belongs to.',
    ],
    highlights: [
      'React + Vite dashboard for administering sites and attendance.',
      'Shared types and services split out so web and mobile stay in step.',
      'Geofenced check-in rather than honour-system attendance.',
    ],
    stack: ['React', 'Vite', 'TypeScript', 'Geofencing'],
    repo: 'https://github.com/luckshayisok/GEONIX',
    demo: 'https://geonix-beta.vercel.app',
  },
  {
    code: 'JOB',
    id: 'JOB 07-26-08',
    slug: 'job-monitor',
    label: 'PERSONAL',
    name: 'Job Monitor',
    tagline: 'Watches Naukri, then applies from WhatsApp.',
    year: '2026',
    role: 'Author',
    tags: ['Python', 'Automation', 'SQLite', 'WhatsApp'],
    summary: [
      'Scrapes Naukri search results through a logged-in browser session, filters by skills, experience, location, remote or hybrid, blacklist, whitelist and recency, then pushes what survives to Telegram, Discord, email or WhatsApp.',
      'Every result is deduped against a local SQLite database, so the same job never arrives twice. Replying “apply 3” on WhatsApp submits a one-click application.',
    ],
    highlights: [
      'Session-based scraping — no password is ever stored.',
      'SQLite dedupe so a listing is only ever delivered once.',
      'Reply-to-apply over WhatsApp, driving the one-click application flow.',
    ],
    stack: ['Python', 'Browser automation', 'SQLite', 'Telegram', 'WhatsApp'],
    repo: 'https://github.com/luckshayisok/job_automation',
  },
  {
    code: 'KZN',
    id: 'KZN 08-26-09',
    slug: 'kaizen',
    label: 'PERSONAL',
    name: 'Kaizen',
    tagline: 'A daily productivity tracker.',
    year: '2026',
    role: 'Author',
    tags: ['Next.js', 'Prisma', 'Postgres', 'React'],
    summary: [
      'A daily productivity tracker built on Next.js, Prisma and Postgres.',
      'Contribution heatmap, streaks, and optimistic UI so a tick registers the instant you press it rather than after the round trip.',
    ],
    highlights: [
      'Contribution heatmap over daily activity.',
      'Streak tracking across habits.',
      'Optimistic UI on every mutation.',
    ],
    stack: ['Next.js', 'React', 'Prisma', 'PostgreSQL', 'TypeScript'],
    repo: 'https://github.com/luckshayisok/kaizen',
    demo: 'https://kaizen-theta-five.vercel.app',
  },
];

export type StackRow = {
  code: string;
  id: string;
  title: string;
  colA: string[];
  colB: string[];
  from: string;
  to: string;
};

export const stack: StackRow[] = [
  {
    code: 'BCK',
    id: 'BCK 02-26-01',
    title: 'Backend & APIs',
    colA: ['Python', 'Django', 'Django REST Framework'],
    colB: ['PostgreSQL', 'Auth', 'Alert systems'],
    from: 'SCR',
    to: 'API',
  },
  {
    code: 'AUT',
    id: 'AUT 03-26-02',
    title: 'Windows Automation',
    colA: ['PowerShell', 'Silent installers', 'SYSTEM context'],
    colB: ['Exit codes', 'Registry', 'Self-healing fixes'],
    from: 'EXE',
    to: 'FIX',
  },
  {
    code: 'CAI',
    id: 'CAI 04-26-03',
    title: 'Conversational AI',
    colA: ['Rasa', 'NLU training data', 'Intent design'],
    colB: ['RAG', 'FAISS', 'sentence-transformers'],
    from: 'NLU',
    to: 'ANS',
  },
  {
    code: 'DSK',
    id: 'DSK 05-26-04',
    title: 'Desktop & IPC',
    colA: ['Electron', 'IPC channels', 'Renderer'],
    colB: ['Notifications', 'Packaging', 'Updates'],
    from: 'IPC',
    to: 'APP',
  },
  {
    code: 'FRO',
    id: 'FRO 06-26-05',
    title: 'Frontend & Motion',
    colA: ['React', 'Next.js', 'TypeScript'],
    colB: ['GSAP', 'Three.js', 'Tailwind'],
    from: 'DOM',
    to: 'FPS',
  },
  {
    code: 'DAT',
    id: 'DAT 07-26-06',
    title: 'Data & Persistence',
    colA: ['PostgreSQL', 'Prisma', 'Migrations'],
    colB: ['FAISS', 'Chroma', 'Embeddings'],
    from: 'ROW',
    to: 'IDX',
  },
];



