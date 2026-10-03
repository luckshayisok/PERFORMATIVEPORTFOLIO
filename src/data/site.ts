/* ============================================================
   SITE DATA
   Every indexed item carries a three-letter code and a numeric
   ID in the form  CODE MM-YY-NN.  These are part of the visual
   texture of the sheet, not decoration.
   ============================================================ */

export const profile = {
  name: 'Lakshya Maheshwari',
  location: 'Delhi, India',
  email: 'lakshyamaheshwari870@gmail.com',
  emailDisplay: 'LAKSHYAMAHESHWARI870@GMAIL.COM',
  phone: '+919354585287',
  phoneDisplay: '+91 93545 85287',
  github: 'https://github.com/luckshayisok',
  /** served from /public; replace the file to update the download */
  resume: '/Lakshya-Maheshwari-Resume.pdf',
  resumeName: 'Lakshya-Maheshwari-Resume.pdf',
  githubDisplay: 'github.com/luckshayisok',
  bio: [
    'I work full-stack on an AI-powered IT helpdesk platform, mostly on the parts users never see: silent installers, fixer scripts that run in SYSTEM context, Django REST backends, and the NLU layer that decides what a request actually means.',
    'Most of what I do is debugging things that only break on real machines. Windows session boundaries, exec scoping, installer exit codes, notification identifiers. I like that category of problem.',
  ],
  bioTail:
    'Outside work I build small tools for my own annoyances, and I spend more time on frontend animation than a backend engineer probably should.',
} as const;

/* ---- the hero ----
   The name is set inside the drawing's own coordinate space (see
   sections/Hero), so only the copy and the floating marks live here.
   `text` is injected into SVG markup, so it is pre-escaped. */
export const hero = {
  role: 'Software engineer',
  tagline: 'I build the parts users never see.',
  marks: [
    { text: '{ }', x: 112, y: 46, size: 30, rot: -12 },
    { text: '0x1', x: 962, y: 6, size: 22, rot: 9 },
    { text: '&gt;_', x: 352, y: 626, size: 24, rot: -5 },
    { text: 'exit 3010', x: 772, y: 622, size: 17, rot: -2 },
  ],
} as const;

/* ---- chapter titles ----
   The site reads as a story: at work, the toolkit, after hours, sign off.
   Each section prints its chapter in the same place its code used to sit. */
export const chapters = {
  work: { no: 'Plate 01', title: 'The work' },
  stack: { no: 'Plate 02', title: 'The toolkit' },
  about: { no: 'Plate 03', title: 'After hours' },
  contact: { no: 'Plate 04', title: 'Off the clock' },
} as const;

/* ---- the about plate ----
   The annotations printed around the figure drawing. These are the
   things that actually go wrong on a managed Windows endpoint, which is
   the point: the labels are the job, not decoration. */
export const about = {
  tags: [
    'Session boundaries',
    'System context',
    'Exit codes',
    'Exec scoping',
    'Notification ids',
    'Silent installers',
    'Small tools',
  ],
} as const;

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Toolkit', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

import type { PlateKind } from '../lib/plot';

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
  /** A real screenshot of the running project. Where there is no public
      build to photograph, the card falls back to the plate below. */
  shot?: {
    src: string;
    srcSet: string;
    webpSet: string;
    width: number;
    height: number;
    alt: string;
  };
  /** Which generator draws this project's plate when there is no shot, and
      the one number that cannot be counted from this file: commits in its
      public repository, read from the GitHub API on 2026-10-03. */
  plate: PlateKind;
  commits?: number;
};

export const work: WorkItem[] = [
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
    shot: {
      src: '/work/prepify-1600.jpg',
      srcSet: '/work/prepify-800.jpg 800w, /work/prepify-1600.jpg 1600w',
      webpSet: '/work/prepify-800.webp 800w, /work/prepify-1600.webp 1600w',
      width: 1600,
      height: 1000,
      alt: "Prepify's landing page: “Practice interviews until they feel easy.”",
    },
    plate: 'orbits',
    commits: 25,
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
    plate: 'strata',
    commits: 12,
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
    tags: ['React', 'TypeScript', 'Django REST', 'PostgreSQL'],
    summary: [
      'An employee attendance and geofencing system: a React dashboard for the web, with shared types, services and utilities factored out for a React Native client.',
      'Attendance is bound to location, so a check-in only counts inside the boundary it belongs to.',
    ],
    highlights: [
      'React + Vite dashboard for administering sites and attendance.',
      'Shared types and services split out so web and mobile stay in step.',
      'Geofenced check-in rather than honour-system attendance.',
    ],
    stack: ['React (Vite)', 'TypeScript', 'Redux Toolkit', 'Django REST', 'PostgreSQL'],
    repo: 'https://github.com/luckshayisok/GEONIX',
    demo: 'https://geonix-beta.vercel.app',
    shot: {
      src: '/work/geonix-1600.jpg',
      srcSet: '/work/geonix-800.jpg 800w, /work/geonix-1600.jpg 1600w',
      webpSet: '/work/geonix-800.webp 800w, /work/geonix-1600.webp 1600w',
      width: 1600,
      height: 1000,
      alt: "The Geonix sign-in screen, with the geofencing globe beside it.",
    },
    plate: 'graph',
    commits: 13,
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
    plate: 'weave',
    commits: 1,
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
    shot: {
      src: '/work/kaizen-1600.jpg',
      srcSet: '/work/kaizen-800.jpg 800w, /work/kaizen-1600.jpg 1600w',
      webpSet: '/work/kaizen-800.webp 800w, /work/kaizen-1600.webp 1600w',
      width: 1600,
      height: 1000,
      alt: "Kaizen's sign-in screen.",
    },
    plate: 'orbits',
    commits: 7,
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
    code: 'LNG',
    id: 'LNG 01-26-01',
    title: 'Languages',
    colA: ['Python', 'JavaScript'],
    colB: ['Java', 'Windows Batch Scripting'],
    from: 'SRC',
    to: 'RUN',
  },
  {
    code: 'FRM',
    id: 'FRM 02-26-02',
    title: 'Frameworks & Libraries',
    colA: [
      'React.js',
      'Node.js',
      'Django',
      'Express.js',
      'Redux Toolkit',
      'RTK Query',
      'Electron.js',
    ],
    colB: [
      'Rasa (NLU)',
      'LangChain',
      'Sentence-Transformers',
      'NumPy',
      'Pandas',
      'Matplotlib',
    ],
    from: 'API',
    to: 'APP',
  },
  {
    code: 'DAT',
    id: 'DAT 03-26-03',
    title: 'Databases',
    colA: ['PostgreSQL', 'SQL'],
    colB: ['MongoDB', 'FAISS (Vector DB)'],
    from: 'ROW',
    to: 'IDX',
  },
  {
    code: 'RAG',
    id: 'RAG 04-26-04',
    title: 'AI / ML & RAG',
    colA: [
      'Retrieval-Augmented Generation',
      'LLM integration (Gemini API)',
      'Semantic search',
    ],
    colB: ['Vector embeddings', 'Cosine similarity', 'Prompt engineering'],
    from: 'ASK',
    to: 'ANS',
  },
  {
    code: 'DEV',
    id: 'DEV 05-26-05',
    title: 'Dev Tools & Platforms',
    colA: ['Git', 'GitHub', 'VS Code'],
    colB: ['Postman', 'Windows Services', 'CI/CD basics'],
    from: 'DIF',
    to: 'SHP',
  },
  {
    code: 'CRS',
    id: 'CRS 06-26-06',
    title: 'Coursework',
    colA: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS'],
    colB: ['Computer Networks', 'OOP'],
    from: 'THY',
    to: 'USE',
  },
];




