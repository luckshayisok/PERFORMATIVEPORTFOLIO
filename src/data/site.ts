/* ============================================================
   SITE DATA
   Every indexed item carries a three-letter code and a numeric
   ID in the form  CODE MM-YY-NN.  These are part of the visual
   texture of the sheet, not decoration.
   ============================================================ */

export const profile = {
  name: 'Lakshya Maheshwari',
  role: 'Software Engineer',
  location: 'India',
  email: 'lakshyamaheshwari870@gmail.com',
  emailDisplay: 'LAKSHYAMAHESHWARI870@GMAIL.COM',
  phone: '+919354585287',
  phoneDisplay: '+91 93545 85287',
  github: 'https://github.com/luckshayisok',
  githubDisplay: 'github.com/luckshayisok',
  callUrl: 'https://cal.com/',
  greeting: 'Hey,',
  intro:
    'I build IT automation and conversational AI systems — Python endpoint scripts, Rasa bots, Django APIs and Electron desktop apps.',
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
    '/portrait-540.jpg 540w, /portrait-810.jpg 810w, /portrait-1080.jpg 1080w',
  portraitWebpSet:
    '/portrait-540.webp 540w, /portrait-810.webp 810w, /portrait-1080.webp 1080w',
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
    '/work-plate-650.jpg 650w, /work-plate.jpg 1300w, /work-plate-1950.jpg 1950w',
  plateWebpSet:
    '/work-plate-650.webp 650w, /work-plate.webp 1300w, /work-plate-1950.webp 1950w',
  plateSizes: '100vw',
  lineA: 'it works',
  lineB: ['on my', '— machine.'],
  note: 'because the only bug that counts is the one that reproduces on somebody else’s laptop',
  edition: '— 001/007',
  editionLabel: 'index',
  /* Each project is pinned to a face in the crowd. Coordinates are percentages
     of the plate, read off the artwork, and are the centre of the pin. Keep
     them clear of one another and off the red silhouette where possible. */
  pins: [
    { slug: 'zerofai-helpdesk-platform', x: 19, y: 4 },
    { slug: 'endpoint-automation', x: 51, y: 7 },
    { slug: 'rasa-nlu-retrieval', x: 74, y: 7 },
    { slug: 'alerts-health-pipeline', x: 33, y: 21 },
    { slug: 'zenkai', x: 63, y: 22 },
    { slug: 'kaizen', x: 8, y: 73 },
    { slug: 'code-copilot-rag', x: 50, y: 74 },
  ],
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
  link?: { label: string; href: string };
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
      'I work across all three surfaces — the desktop client the employee talks to, the API that brokers the request, and the NLU layer that decides what the request actually means.',
    ],
    highlights: [
      'Full-stack ownership across the Electron client, Django services and the Rasa dialogue layer.',
      'Fixed IPC, rendering and notification bugs across the Electron client.',
      'Debugged failures that only reproduce on real machines — Windows session boundaries, exec scoping, notification identifiers.',
    ],
    stack: ['Electron', 'Django', 'Rasa', 'Python', 'JavaScript', 'Windows'],
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
    code: 'ALR',
    id: 'ALR 08-25-04',
    slug: 'alerts-health-pipeline',
    label: 'CLIENT',
    name: 'Alerts & Health',
    tagline: 'A custom alert system and health notification pipeline.',
    year: '2025',
    role: 'Backend',
    tags: ['Django', 'DRF', 'PostgreSQL', 'Pipelines'],
    summary: [
      'Backend features on the Django side: a custom alert system, and the pipeline that turns raw system health signals from the endpoint into notifications a person can act on.',
      'Delivery is the hard part — the same alert must not fire twice, and a notification identifier that collides silently swallows the second one.',
    ],
    highlights: [
      'Built a custom alert system inside the Django backend.',
      'Built the system health notification pipeline end to end.',
      'Chased down duplicate and swallowed notifications caused by identifier collisions.',
    ],
    stack: ['Django', 'Django REST Framework', 'PostgreSQL', 'Python'],
  },
  {
    code: 'ZNK',
    id: 'ZNK 04-26-05',
    slug: 'zenkai',
    label: 'PERSONAL',
    name: 'Zenkai',
    tagline: 'Testing for Windows automation scripts.',
    year: '2026',
    role: 'Author',
    tags: ['Python', 'VM', 'Snapshots', 'Windows'],
    summary: [
      'A test harness for Windows automation scripts. It restores a VM to a clean snapshot before each test, runs the script, then asserts against real machine state afterwards.',
      'Built because I was tired of testing releases by hand — a script that passes on a dirty machine tells you almost nothing.',
    ],
    highlights: [
      'Restores a virtual machine to a known-clean snapshot before every test run.',
      'Asserts against real machine state — registry, filesystem, services — not mocks.',
      'Turns a manual pre-release checklist into a repeatable run.',
    ],
    stack: ['Python', 'PowerShell', 'Hypervisor snapshots', 'Windows'],
  },
  {
    code: 'KZN',
    id: 'KZN 06-26-06',
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
  },
  {
    code: 'RAG',
    id: 'RAG 07-26-07',
    slug: 'code-copilot-rag',
    label: 'PERSONAL',
    name: 'Code Copilot',
    tagline: 'Semantic search over codebases, chunked on the AST.',
    year: '2026',
    role: 'Author',
    tags: ['RAG', 'tree-sitter', 'Chroma', 'MiniLM'],
    summary: [
      'Semantic search over a codebase that uses a tree-sitter AST chunker instead of naive text splitting, so chunks land on function and class boundaries.',
      'A chunk that stops halfway through a function retrieves badly. Splitting on the syntax tree means every chunk is a thing that actually means something.',
    ],
    highlights: [
      'tree-sitter AST chunker — chunks align to function and class boundaries.',
      'MiniLM sentence-transformer embeddings stored in Chroma.',
      'Gemini Flash for answer synthesis over retrieved chunks.',
    ],
    stack: ['Python', 'tree-sitter', 'sentence-transformers', 'Chroma', 'Gemini Flash'],
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

export const aboutList = [
  'Python · Django · DRF',
  'Rasa · NLU · RAG',
  'PowerShell · Windows automation',
  'React · Next.js · TypeScript',
  'GSAP · Three.js · Tailwind',
  'PostgreSQL · Prisma · FAISS',
  'Electron · IPC · Packaging',
  'sentence-transformers · Chroma',
];

export const telemetry = [
  { value: '07', label: 'Indexed projects' },
  { value: '08', label: 'Apps automated' },
  { value: '03', label: 'Runtime surfaces' },
  { value: '01', label: 'Engineer' },
];

export const marquee = [
  'SILENT INSTALLERS',
  'SYSTEM CONTEXT',
  'DJANGO REST',
  'RASA NLU',
  'CASCADING RAG FALLBACK',
  'ELECTRON IPC',
  'VM SNAPSHOT TESTING',
  'AST CHUNKING',
  'SELF-HEALING FIXES',
  'EXIT CODE HANDLING',
  'SCROLLTRIGGER',
  'OPTIMISTIC UI',
];
