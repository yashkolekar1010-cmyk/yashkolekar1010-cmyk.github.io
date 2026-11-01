/**
 * SINGLE SOURCE OF TRUTH.
 *
 * Every word of portfolio copy lives here, taken from
 * `Yash _resume.pdf` (2026-11-01). Components import from this file and
 * hard-code no claims of their own, so "did we invent anything?" is
 * answerable by reviewing this one module against the PDF.
 *
 * Rules carried over from the résumé prompt that generated the PDF:
 *  - "2+ years", never "3+" (first role started Feb 2024).
 *  - No invented metrics. CGPA 9.02 is the only number allowed.
 *  - Skill tiers are load-bearing: `basic` / `familiar` must stay visible.
 *  - No certification carries a status tag like "(In Progress)".
 *  - GitHub links only where a repo actually has code in it.
 */

export type Tier = 'core' | 'strong' | 'working';

export const profile = {
  name: 'Yash Kolekar',
  initials: 'YASH.K',
  title: 'AI / ML Engineer',
  titleFull: 'AI/ML Engineer | Data Scientist | Generative AI, RAG & AI Agents',
  tagline:
    'Building intelligent systems that turn complex data into real-world solutions.',
  intro:
    'I build Generative AI applications, RAG systems, AI agents, and production-ready machine learning solutions using Python, LangChain, LangGraph, FastAPI, and AWS.',

  summary:
    'AI/ML Engineer and Data Scientist with 2+ years of experience building production Machine Learning, NLP and Generative AI systems: Retrieval-Augmented Generation (RAG) pipelines, AI agents and LLM applications, owned from data preparation to deployment with FastAPI, Docker and AWS.',

  availability: 'Immediate joiner · open to hybrid and remote',
  experienceYears: '2+ years',

  contact: {
    email: 'yash.kolekar1010@gmail.com',
    phone: '+91 88831 60707',
    phoneHref: '+918883160707',
    location: 'Pune, India',
    linkedin: 'https://www.linkedin.com/in/yash-kolekar-736164216',
    linkedinLabel: 'yash-kolekar-736164216',
    github: 'https://github.com/yashkolekar1010-cmyk',
    githubLabel: 'yashkolekar1010-cmyk',
  },

  resume: {
    file: 'Yash_Kolekar_Resume.pdf',
    label: 'Download Resume',
  },
} as const;

/* ─────────────────────────── EXPERIENCE ───────────────────────────
   Bullets are verbatim from the PDF. Infosys is present tense and has
   three bullets; the rest are past tense with five.                  */

export interface Role {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  start: string;
  current?: boolean;
  bullets: string[];
}

export const experience: Role[] = [
  {
    id: 'infosys',
    title: 'Data Scientist',
    company: 'Infosys',
    location: 'Bengaluru, India',
    period: 'Sep 2026 — Present',
    start: '2026-09',
    current: true,
    bullets: [
      'Builds and evaluates ML models: data preprocessing, feature engineering, model tuning',
      'Develops LLM chatbot and RAG retrieval components over enterprise operations data',
      'Partners with cross-functional client teams on solution design and production support',
    ],
  },
  {
    id: 'webcrypt',
    title: 'AI Engineer (6-month Contract)',
    company: 'Webcrypt Technology',
    location: 'Pune, India',
    period: 'Apr 2026 — Sep 2026',
    start: '2026-04',
    bullets: [
      'Developed GenAI applications: RAG systems, AI agents and LLM-powered chatbots',
      'Built agent workflows with tool calling using LangChain, LangGraph and CrewAI',
      'Optimized RAG pipelines: document chunking, embeddings, semantic search, context tuning',
      'Improved LLM accuracy via prompt engineering, retrieval tuning and LoRA fine-tuning',
      'Shipped FastAPI services for AI/ML models, containerized on Docker and deployed to AWS',
    ],
  },
  {
    id: 'hotelkey',
    title: 'ML Implementation Specialist',
    company: 'HotelKey Ind Pvt Ltd',
    location: 'Nagpur, India',
    period: 'Jan 2025 — Mar 2026',
    start: '2025-01',
    bullets: [
      'Implemented RAG chatbots and NLP applications over high-volume enterprise data',
      'Deployed FastAPI microservices serving Machine Learning models in production',
      'Designed SQL and ETL pipelines for extraction, transformation and model-ready datasets',
      'Automated build, test and release workflows with Jenkins, Docker and CI/CD pipelines',
      'Worked onsite with client teams on rollout, troubleshooting and PyTest reliability',
    ],
  },
  {
    id: 'starlite',
    title: 'Associate AI Engineer',
    company: 'Starlite Infotech',
    location: 'Pune, India',
    period: 'Feb 2024 — Dec 2024',
    start: '2024-02',
    bullets: [
      'Developed Python applications and scripts supporting internal AI/ML workflows',
      'Built and evaluated baseline ML models for classification and regression tasks',
      'Performed data cleaning, preprocessing and exploratory analysis for experimentation',
      'Worked on NLP text processing: tokenization, embeddings and search prototypes',
      'Wrote SQL extraction queries and integrated ML scripts with backend REST APIs',
    ],
  },
];

/* ───────────────────────────── SKILLS ─────────────────────────────
   Categories follow the PDF's eight lines. Items marked `soft` render
   with their qualifier shown — these must never be presented as core. */

export interface SkillGroup {
  id: string;
  name: string;
  note: string;
  tier: Tier;
  items: { label: string; soft?: boolean }[];
}

export const skills: SkillGroup[] = [
  {
    id: 'core',
    name: 'Programming & Data',
    note: 'Everything starts here',
    tier: 'core',
    items: [
      { label: 'Python' }, { label: 'SQL' }, { label: 'pandas' }, { label: 'NumPy' },
      { label: 'Git' }, { label: 'MySQL' }, { label: 'PostgreSQL' },
      { label: 'MongoDB' }, { label: 'ETL' }, { label: 'Data preprocessing' },
    ],
  },
  {
    id: 'genai',
    name: 'GenAI & Large Language Models',
    note: 'Applied, not theoretical',
    tier: 'core',
    items: [
      { label: 'LangChain' }, { label: 'LangGraph' }, { label: 'CrewAI' },
      { label: 'Prompt engineering' }, { label: 'LoRA / PEFT fine-tuning' },
    ],
  },
  {
    id: 'agents',
    name: 'AI Agents & Retrieval',
    note: 'Where RAG is won or lost',
    tier: 'core',
    items: [
      { label: 'AI agents' }, { label: 'Tool / function calling' }, { label: 'RAG' },
      { label: 'Embeddings' }, { label: 'Semantic search' }, { label: 'Pinecone' },
      { label: 'FAISS' },
    ],
  },
  {
    id: 'ml',
    name: 'ML, Deep Learning & NLP',
    note: 'The classical half',
    tier: 'strong',
    items: [
      { label: 'Scikit-learn' }, { label: 'PyTorch' }, { label: 'TensorFlow' },
      { label: 'XGBoost' }, { label: 'HuggingFace Transformers' }, { label: 'NLP' },
      { label: 'Forecasting' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & APIs',
    note: 'Prototype → production',
    tier: 'core',
    items: [
      { label: 'FastAPI' }, { label: 'RESTful APIs' }, { label: 'Microservices' },
      { label: 'PyTest' },
      { label: 'Flask (basic)', soft: true }, { label: 'Node.js (basic)', soft: true },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud, DevOps & MLOps',
    note: 'AWS is the primary',
    tier: 'strong',
    items: [
      { label: 'AWS' }, { label: 'Docker' }, { label: 'Jenkins' }, { label: 'CI/CD' },
      { label: 'Model monitoring' },
      { label: 'MLflow (basic)', soft: true }, { label: 'Kubernetes (basic)', soft: true },
    ],
  },
  {
    id: 'ds',
    name: 'Data Science',
    note: 'Analysis and evaluation',
    tier: 'strong',
    items: [
      { label: 'Feature engineering' }, { label: 'Model evaluation' }, { label: 'EDA' },
      { label: 'Statistical analysis' }, { label: 'A/B style experimentation' },
    ],
  },
  {
    id: 'practice',
    name: 'Methods & Practices',
    note: 'How the work gets shipped',
    tier: 'core',
    items: [
      { label: 'Agile / Scrum' }, { label: 'Solution design' }, { label: 'Code reviews' },
      { label: 'Unit testing' }, { label: 'Documentation' }, { label: 'Client support' },
    ],
  },
];

/* ──────────────────────────── PROJECTS ────────────────────────────
   `repo` is set only where the repository actually contains code.
   -quant-scanner-pro and AI-agent- are both empty, so those cards
   deliberately carry no GitHub button.                               */

export interface Project {
  id: number;
  kind: string;
  title: string;
  blurb: string;
  detail: string[];
  stack: string[];
  repo?: string;
  demoNote?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    kind: 'Retrieval + agents',
    title: 'Enterprise RAG & AI Agent Platform',
    blurb:
      'A retrieval platform over private knowledge bases — document Q&A, semantic search and summarisation — with an agent layer that plans multi-step work and calls tools instead of answering from memory.',
    detail: [
      'Production-style RAG and multi-agent platform with retrieval, tool calling and APIs.',
      'Chunking, embedding and context strategy tuned per corpus.',
      'Answers stream back through FastAPI services running on AWS.',
    ],
    stack: ['LangChain', 'LangGraph', 'OpenAI', 'Pinecone', 'FastAPI', 'AWS'],
  },
  {
    id: 2,
    kind: 'Predictive analytics',
    title: 'QuantScan PRO — Scoring Engine',
    blurb:
      'An end-to-end analytics pipeline with data ingestion, cleaning, feature engineering, scoring logic, FastAPI services and a React dashboard.',
    detail: [
      'Predictive scoring engine with feature engineering and model-driven ranking.',
      'Owned from prototype through deployment — data layer, scoring logic, API and containerised release.',
    ],
    stack: ['Python', 'Scikit-learn', 'FastAPI', 'MySQL', 'React', 'Docker'],
  },
  {
    id: 3,
    kind: 'Agent · tool calling',
    title: 'Student Enrollment Assistant Agent',
    blurb:
      'A conversational university admissions agent that answers on programs, deadlines and application status through real tool calls rather than model memory.',
    detail: [
      'Three custom tools — get_program_info, check_application_status, get_deadlines — with structured inputs and outputs; the agent reasons about which to call.',
      'Multi-turn session memory carries the applicant ID across the conversation.',
      'Out-of-scope questions escalate to a human counsellor instead of being guessed at.',
    ],
    stack: ['Python', 'Tool calling', 'Agent loop', 'Session memory'],
    demoNote:
      'Demo project — the three tools are backed by mock data, not a live admissions database.',
  },
  {
    id: 4,
    kind: 'Agent · LangGraph · code on GitHub',
    title: 'Travel Reimbursement Approval Agent',
    blurb:
      'Reviews an employee travel claim against policy, receipts, limits and approval rules, then returns a structured decision — Approve, Partially Approve, Reject or Manual Review.',
    detail: [
      'A LangGraph state machine: intake → retrieve → run_tools → reason → validate.',
      'Deterministic tools own the numbers, so the arithmetic stays correct and auditable, while the LLM owns judgement and explanation.',
      'Six tools cover policy lookup (RAG over chunked policy), receipt completeness, per-item limits, duplicate detection, approval bands and output validation.',
      'Anything missing, duplicated, over the band or low-confidence routes to a human instead of being guessed at.',
      'Runs with zero API keys — with no LLM configured a transparent rule engine returns the same schema, so the demo never fails shut.',
    ],
    stack: ['Python', 'LangGraph', 'LangChain', 'FastAPI', 'RAG', 'PyTest', 'Streamlit'],
    repo: 'https://github.com/yashkolekar1010-cmyk/travel-reimbursement-agent',
    demoNote: 'Case-study prototype — policy and claim data are mock.',
  },
];

/* ─────────────────────── ROLE TRACKS ───────────────────────
   One control retargets the page. Project order follows the same
   family rules used when tailoring the résumé PDF.              */

export interface Track {
  id: string;
  label: string;
  role: string;
  note: string;
  order: number[];
  lead: string[];
}

export const tracks: Track[] = [
  {
    id: 'ai-engineer',
    label: 'AI / GenAI Engineer',
    role: 'AI / GenAI Engineer',
    note: 'Generative AI in production — RAG pipelines, AI agents and LLM services built on Python, FastAPI, LangChain and LangGraph, shipped on AWS.',
    order: [1, 3, 4, 2],
    lead: ['genai', 'agents', 'backend'],
  },
  {
    id: 'agentic',
    label: 'Agentic AI Engineer',
    role: 'Agentic AI Engineer',
    note: 'Agent loops that call real tools — LangGraph and CrewAI orchestration, function calling, multi-turn memory, and escalation to a human instead of a guess.',
    order: [4, 3, 1, 2],
    lead: ['agents', 'genai'],
  },
  {
    id: 'data-scientist',
    label: 'Data Scientist',
    role: 'Data Scientist',
    note: 'Modelling and analysis — classification, regression and forecasting with Scikit-learn and PyTorch, on top of SQL, ETL, pandas and NumPy.',
    order: [2, 1, 3, 4],
    lead: ['ml', 'ds', 'core'],
  },
  {
    id: 'ml-engineer',
    label: 'AI / ML Engineer',
    role: 'AI / ML Engineer',
    note: 'Models trained, served and watched — classical ML and GenAI side by side, behind FastAPI services in Docker on AWS, with CI/CD and monitoring.',
    order: [1, 3, 4, 2],
    lead: ['ml', 'cloud', 'backend'],
  },
];

/* ─────────────────────── HOW I WORK ─────────────────────── */

export const howIWork = [
  {
    n: '01',
    title: 'Prototype Through Production',
    body: 'A notebook that works is the start, not the deliverable. I take the same piece of work through API design, tests, containers and deployment.',
  },
  {
    n: '02',
    title: 'Retrieval Before Fine-Tuning',
    body: 'Most "the model is wrong" problems are retrieval problems. I fix chunking, embeddings and context first, and fine-tune when that genuinely runs out.',
  },
  {
    n: '03',
    title: 'Honest Scope',
    body: 'I say what a system can’t do. Agents escalate instead of inventing answers, and I mark a skill "basic" rather than padding a list.',
  },
  {
    n: '04',
    title: 'Written Down',
    body: 'Code reviews, documentation and tests are part of the work. Someone else has to run this after I hand it over.',
  },
];

/* ─────────────────── EDUCATION & CERTIFICATIONS ─────────────────── */

export const education = {
  degree: 'Bachelor of Technology (B.Tech) in Computer Science Engineering',
  school: 'Solapur University',
  period: '2020 — 2024',
  cgpa: '9.02',
};

/* No status tags — the résumé rules forbid "(In Progress)" anywhere. */
export const certifications = [
  'AWS Certified Cloud Practitioner (CLF-C02)',
  'GenAI with LangChain & HuggingFace',
  'ML Specialization, Coursera',
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
