/**
 * SHARED DATA LAYER — single source of truth (MIGUEL_UNIVERSE_SPEC §2.3).
 * Both the Fast Path and (later) Universe Mode read from this file.
 *
 * Source: Miguel's structured profile (ResumeForge/profile.json) — the
 * authoritative record. All metrics here are real (spec §10: no invented data).
 *
 * Flagship 4 (spec §2.1, shown on Fast Path): Vocalyx, PlantGuard-AI,
 * QuantPilot, AutoApply. Remaining projects become planets in Universe Mode.
 */

export type ProjectDomain = "ai-ml" | "data-automation" | "hackathon";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  domain: ProjectDomain;
  flagship: boolean;
  github?: string;
  demo?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ExperienceItem {
  org: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  highlights: string[];
}

export interface EducationItem {
  school: string;
  detail: string;
  period: string;
  honors?: string[];
  coursework?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface LeadershipItem {
  role: string;
  org: string;
  period: string;
  description: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface Profile {
  name: string;
  brand: string;
  role: string;
  valueProp: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string; // TODO: drop a PDF in /public and set the path
  socials: SocialLink[];
}

export const profile: Profile = {
  name: "Miguel Shema Ngabonziza",
  brand: "My Universe",
  role: "AI + Automation @ One37 Solutions · CS + Cybersecurity @ Grambling State",
  valueProp:
    "I build AI/ML and automation systems end to end, from voice-biometric models and reasoning agents to autonomous daemons and full-stack apps.",
  // Primary contact: durable Gmail (won't expire after graduation). School
  // email on file is smiguel@gsumail.gram.edu.
  email: "shemamiguel2023@gmail.com",
  phone: "(318) 516-4769",
  location: "Grambling, LA",
  resumeUrl: "/Miguel-Ngabonziza-Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/SNMiguel" },
    { label: "LinkedIn", href: "https://linkedin.com/in/migztech" },
  ],
};

export const projects: Project[] = [
  {
    id: "vocalyx",
    name: "Vocalyx",
    tagline: "Voice biometric auth + anti-spoofing MVP, shipped live in 11 days.",
    description:
      "A full-stack voice biometric authentication and anti-spoofing system. Built a multi-stage inference pipeline fusing ECAPA-TDNN speaker verification, a Wav2Vec2 deepfake classifier, a custom spectral replay detector, and Whisper-powered challenge-response liveness into a single adaptive decision layer. Shipped as a deployed MVP, with a React frontend on Vercel and a FastAPI backend via Cloudflare Tunnel.",
    tech: [
      "Python",
      "FastAPI",
      "PyTorch",
      "React",
      "SpeechBrain",
      "ECAPA-TDNN",
      "Wav2Vec2",
      "Whisper",
    ],
    domain: "ai-ml",
    flagship: true,
    github: "https://github.com/SNMiguel/Vocalyx",
  },
  {
    id: "plantguard-ai",
    name: "PlantGuard-AI",
    tagline: "Crop-leaf photo → cited diagnosis + action plan (95.02% accuracy).",
    description:
      "A reasoning agent that turns a single crop-leaf photo into a grounded, cited action plan: diagnosis, differential reasoning, treatment, and economic impact. A 95.02%-accurate ResNet18 vision model (38 classes / 14 crops, 54K+ images) feeds a multi-step agent that runs differential diagnosis, grounds every recommendation in cited agronomy knowledge via Microsoft Foundry IQ, and computes a deterministic $-at-risk estimate. Built for the Microsoft Agents League @ AISF 2026 (Reasoning Agents track); degrades gracefully to an offline cited knowledge base.",
    tech: [
      "Python",
      "PyTorch",
      "ResNet18",
      "Microsoft Foundry IQ",
      "Azure AI Search",
      "FastAPI",
      "OpenCV",
    ],
    domain: "ai-ml",
    flagship: true,
    github: "https://github.com/SNMiguel/PlantGuard-AI",
    demo: "https://www.youtube.com/watch?v=alXvoNP0Eg4",
  },
  {
    id: "quantpilot",
    name: "QuantPilot",
    tagline: "Multi-model time-series forecasting pipeline for stock prices.",
    description:
      "An end-to-end ML pipeline for stock price forecasting. Engineers 18 technical indicators from raw OHLCV data with chronological train/test splitting to prevent time-series leakage, then trains and benchmarks 4 model architectures (Linear Regression, Random Forest, SVR, and a deep neural network) across scikit-learn and Keras.",
    tech: [
      "Python",
      "scikit-learn",
      "Keras",
      "TensorFlow",
      "pandas",
      "yfinance",
    ],
    domain: "data-automation",
    flagship: true,
    github: "https://github.com/SNMiguel/QuantPilot",
  },
  {
    id: "autoapply",
    name: "AutoApply",
    tagline: "Autonomous internship-application daemon (agentic, Claude API).",
    description:
      "An autonomous daemon that scrapes the SimplifyJobs internship repository, filters listings against personal preferences, generates tailored application documents via the Claude API, and submits applications through browser automation. Maintains a per-application archive with cover letters, resumes, form Q&A logs, screenshots, and manifests across 7 implementation phases.",
    tech: [
      "Python",
      "Playwright",
      "APScheduler",
      "SQLite",
      "Claude API",
      "Discord Webhooks",
    ],
    domain: "data-automation",
    flagship: true,
    github: "https://github.com/SNMiguel/autoapply",
  },
  {
    id: "deliveryradar",
    name: "DeliveryRadar",
    tagline: "Self-hosted Go daemon for multi-carrier delivery tracking.",
    description:
      "A self-hosted Go daemon that polls Gmail via OAuth2 every 5 minutes, parses multi-carrier tracking numbers (UPS, FedEx, USPS, DHL) with a 3-tier regex extraction strategy, and pushes real-time notifications to Discord. Backed by a SQLite persistence layer with WAL-mode concurrency, deduplication, exponential-backoff error handling, and 45 unit tests.",
    tech: ["Go", "SQLite", "Gmail API", "Google OAuth2", "Discord Webhooks"],
    domain: "data-automation",
    flagship: false,
    github: "https://github.com/SNMiguel/deliveryradar",
  },
  {
    id: "r-crypto-trading-bot",
    name: "R Cryptocurrency Trading Bot",
    tagline: "End-to-end algorithmic trading system in R (~4,200 lines, 5 weeks).",
    description:
      "An end-to-end algorithmic trading system built from scratch in R, covering data acquisition, technical analysis, strategy execution, backtesting, risk management, and paper trading (~4,200 lines across 18 files). Implements 10+ technical indicators (RSI, MACD, SMA/EMA, Bollinger Bands, volume) and multiple strategies (Moving Average Crossover, RSI Mean Reversion) on an extensible base-strategy template.",
    tech: ["R", "tidyverse", "TTR", "ggplot2", "CryptoCompare API"],
    domain: "data-automation",
    flagship: false,
    github: "https://github.com/SNMiguel/R-Cryptocurrency-Trading-Bot",
  },
  {
    id: "sign-language-bridge",
    name: "Sign Language Bridge",
    tagline: "Real-time ASL → speech platform (Amazon Nova Hackathon).",
    description:
      "A real-time ASL-to-speech communication platform built at the Amazon Nova Hackathon. Combines a React/TypeScript + WebRTC frontend with AWS serverless infrastructure (API Gateway, Lambda, DynamoDB, S3), integrating Amazon Nova multimodal models, Polly, and Transcribe with a MediaPipe/OpenCV gesture pipeline for accessibility-first sign interpretation and voice synthesis.",
    tech: [
      "React",
      "TypeScript",
      "WebRTC",
      "AWS",
      "Amazon Nova",
      "Bedrock",
      "MediaPipe",
      "OpenCV",
    ],
    domain: "hackathon",
    flagship: false,
    github: "https://github.com/Savoir-Tech/sign-language-bridge",
  },
  {
    id: "task-flow",
    name: "Task-Flow",
    tagline: "AI task-planning hub synced with Notion (Hackathon 2nd place).",
    description:
      "An AI-powered task planning hub that helps users plan schedules around deadlines and sync their tasks with Notion for progress tracking. Built with a team at the Notion x Grambling Hackathon, where it placed 2nd (1st runner-up); I built the GUI to deliver a smooth user experience.",
    tech: ["JavaScript", "Notion API", "AI", "OAuth 2.0"],
    domain: "hackathon",
    flagship: false,
  },
];

export const flagshipProjects = projects.filter((p) => p.flagship);

export const experience: ExperienceItem[] = [
  {
    org: "One37 Solutions Inc.",
    role: "AI and Automation Trainee",
    start: "May 2026",
    end: "Present",
    location: "Remote",
    highlights: [
      "Building multilingual voice biometric authentication systems and deepfake voice detection models using AI/ML.",
      "Developing testing and benchmarking pipelines across languages, devices, and acoustic environments to validate model robustness.",
    ],
  },
  {
    org: "HBCU First",
    role: "Day-One-Ready Academy Intern",
    start: "Sep 2025",
    end: "Nov 2025",
    location: "Grambling, LA",
    highlights: [
      "Selected as 1 of 200 students nationwide; completed 60+ hours of workshops and employer meetups.",
      "Co-created engagement solutions weekly with peers and mentors.",
    ],
  },
  {
    org: "Extern (PwC Collaboration)",
    role: "Non-Profit Consulting Extern",
    start: "May 2025",
    end: "Jul 2025",
    location: "Remote",
    highlights: [
      "Analyzed donor engagement strategy using communication data and Gen Z trends; recommendations projected a 40% outreach lift.",
      "Presented a data-driven deck to Extern Inc. and PwC collaborators, recognized for exceeding program standards.",
    ],
  },
  {
    org: "Pinnacle Labs",
    role: "Python Development Intern",
    start: "Nov 2024",
    end: "Dec 2024",
    location: "Remote",
    highlights: [
      "Built two AI-driven solutions: a stock-price predictor (R² 0.79) and the PlantGuard-AI classifier (95% accuracy over 54K+ images) via transfer learning with scikit-learn, TensorFlow, and PyTorch.",
      "Designed ML pipelines with 18 technical indicators, reducing RMSE to $2.01 while processing 1,000+ daily API calls.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    school: "Grambling State University",
    detail: "B.S. Computer Science, Minor in Cybersecurity · GPA 4.00/4.00",
    period: "Aug 2024 – May 2028",
    honors: ["Presidential Scholarship", "2× Dean's List", "Alpha Lambda Delta Honors"],
    coursework: [
      "Data Structures & Algorithms",
      "Discrete Structures",
      "Software Engineering",
      "Computer Organization & Architecture",
      "Computer Science I & II",
      "Foundations of Cybersecurity",
      "Information Assurance & Security",
      "Social, Legal & Ethical Issues in Computing",
      "Probability & Statistics I",
      "Calculus I & II",
      "General Physics I & II",
      "Intro to Technical Writing",
    ],
  },
];

export const skills = {
  languages: [
    "Python",
    "Go",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "R",
    "SQL",
    "Kotlin",
    "HTML/CSS",
  ],
  frameworks: [
    "React",
    "Next.js",
    "Node.js",
    "FastAPI",
    "Vite",
    "PyTorch",
    "TensorFlow",
    "Keras",
  ],
  libraries: [
    "scikit-learn",
    "Hugging Face Transformers",
    "SpeechBrain",
    "NumPy",
    "Pandas",
    "Matplotlib",
    "OpenCV",
    "tidyverse",
    "ggplot2",
    "TTR",
    "yfinance",
  ],
  aiml: [
    "Deep Learning",
    "Computer Vision",
    "Transfer Learning",
    "LLM Integration",
    "RAG",
    "Agentic AI",
    "Prompt Engineering",
    "Voice Biometrics",
    "Speaker Verification",
    "Anti-Spoofing / Deepfake Detection",
  ],
  tools: [
    "Git",
    "GitHub",
    "Docker",
    "Linux",
    "VS Code",
    "Jupyter",
    "Android Studio",
    "Playwright",
    "AWS",
    "Vercel",
    "Cloudflare Tunnel",
    "RStudio",
  ],
  databases: ["SQLite", "DynamoDB"],
  spokenLanguages: [
    "English (fluent)",
    "French (fluent)",
    "Kiswahili (intermediate)",
    "Kinyarwanda (native)",
  ],
};

export const certifications: Certification[] = [
  { name: "Google AI Essentials Specialization", issuer: "Google (Coursera)", date: "May 2026" },
  { name: "Introducing Generative AI with AWS", issuer: "Udacity", date: "Jul 2025" },
  { name: "AWS Educate Machine Learning Foundations", issuer: "AWS", date: "Aug 2025" },
  { name: "Intermediate Cybersecurity", issuer: "CodePath", date: "May 2025" },
  { name: "Supervised Machine Learning: Regression and Classification", issuer: "DeepLearning.AI / Stanford (Coursera)", date: "Oct 2024" },
  { name: "Software Engineer Intern Certificate", issuer: "HackerRank", date: "Jan 2025" },
  { name: "Intermediate Technical Interview Prep", issuer: "CodePath", date: "Aug 2025" },
  { name: "Intro to Android Development", issuer: "CodePath", date: "2025" },
  { name: "IBM Security Zero Trust Principles", issuer: "IBM", date: "2025" },
];

export const leadership: LeadershipItem[] = [
  {
    role: "SWE Summer Academy Fellow",
    org: "LinkedinorLeftout (LILO)",
    period: "Jun 2026 – Aug 2026",
    description:
      "Accepted into LILO's competitive 12-week SWE Summer Academy focused on data structures, algorithms, and technical interview preparation, building full-stack projects and preparing for fall software-engineering internship recruiting alongside the cohort.",
  },
  {
    role: "Fellow",
    org: "Propel2Excel",
    period: "Sep 2025 – Present",
    description:
      "Selected for a competitive career-development fellowship with mentorship from industry leaders, building a professional network across tech, finance, and consulting through structured workshops and speaker sessions.",
  },
  {
    role: "Residential Assistant",
    org: "Grambling State University",
    period: "Jul 2025 – Present",
    description:
      "Lead a residential community of 30+ students with weekly check-ins, conflict resolution, and 5+ events per semester, increasing participation by 60%. Serve as the primary liaison between housing administration and a diverse student population.",
  },
  {
    role: "Apprentice (Region 4)",
    org: "HBCU 20x20 | The Application",
    period: "Jun 2025",
    description:
      "Selected for the Apprenticeship Universe (Region 4) program by HBCU 20x20 | The Application, gaining insight into apprenticeship opportunities, building new skills, and connecting with professionals and fellow students to expand career pathways.",
  },
  {
    role: "CLRM Roundtable Mentee",
    org: "The Lantern Network",
    period: "Apr 2025",
    description:
      "Selected as a mentee to attend the CLRM Roundtable Conference in Denver, representing Grambling State University. Engaged with construction-finance leaders on risk management and regulatory strategy through the lens of technology, cybersecurity, and innovation, with side workshops in AI and Quantum Computing.",
  },
  {
    role: "Member",
    org: "Alpha Lambda Delta Honors Society",
    period: "Mar 2025 – Present",
    description:
      "Member of the national honor society recognizing outstanding academic achievement among first-year college students.",
  },
  {
    role: "Louisiana Student Ambassador",
    org: "The Lantern Network",
    period: "Jan 2025 – Present",
    description:
      "Represent The Lantern Network as a student ambassador, connecting peers with mentorship and professional opportunities and promoting the network across Louisiana campuses.",
  },
  {
    role: "Active Member",
    org: "National Society of Black Engineers (NSBE)",
    period: "Nov 2024 – Present",
    description:
      "Member of NSBE, participating in technical development, networking, and initiatives that support the academic and professional success of Black engineers and STEM students.",
  },
  {
    role: "TMCF x Citi Scholar",
    org: "Thurgood Marshall College Fund",
    period: "Nov 2024 – May 2025",
    description:
      "Selected as 1 of 100 HBCU students nationwide for the competitive TMCF-Citi Scholars Program. Completed a 5-day immersive bootcamp at Citi's NYC office with 10+ Citi professionals, gaining corporate exposure and finance industry insight.",
  },
  {
    role: "Active Member",
    org: "ColorStack",
    period: "Sep 2024 – Present",
    description:
      "Part of a national community advancing Black and Latinx representation in tech, engaging in professional-development workshops, mentorship programs, and networking with industry leaders.",
  },
];

export const achievements: Achievement[] = [
  { title: "Notion Hackathon: 1st Runner-Up", description: "Built TaskFlow, an AI-powered task planning hub integrating Notion databases.", date: "Nov 2024" },
  { title: "Amazon Nova Hackathon Participant", description: "Built Sign Language Bridge, a real-time ASL communication platform.", date: "Feb 2026" },
  { title: "Presidential Scholarship", description: "Full merit-based scholarship to Grambling State University.", date: "Aug 2024" },
];

/** Palette accent per domain (spec §9 color-coding). */
export const domainAccent: Record<ProjectDomain, string> = {
  "ai-ml": "var(--electric-blue)",
  "data-automation": "var(--emerald)",
  hackathon: "var(--soft-gold)",
};
