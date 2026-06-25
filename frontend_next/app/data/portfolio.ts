/**
 * SHARED DATA LAYER — single source of truth (MIGUEL_UNIVERSE_SPEC §2.3).
 * Both the Fast Path and (later) Universe Mode read from this file.
 *
 * Populated from Miguel's LinkedIn profile (verified, real). Spec rule (§10):
 * no invented metrics — every figure below is taken directly from the profile.
 * Fields still marked `// TODO` need Miguel's input (GitHub repo links, demo
 * links, and confirmation of which "spec" projects are real — see note below).
 *
 * NOTE — project mismatch: the spec names Vocalyx, PlantGuard-AI, QuantPilot,
 * AutoApply, DeliveryRadar, Sign Language Bridge. Only voice-biometric work
 * (One37 ID) maps to "Vocalyx". TaskFlow / Irecycler / Weather App are the
 * real, verifiable projects from the profile. Confirm the rest before adding.
 */

export type ProjectDomain = "ai-ml" | "data-automation" | "hackathon";

export interface Project {
  id: string;
  name: string;
  tagline: string; // one-line real result
  description: string; // 2–4 sentences, human-written
  tech: string[]; // exact tools actually used
  domain: ProjectDomain;
  flagship: boolean; // shown on Fast Path
  github?: string; // TODO: real repo URL
  demo?: string; // TODO: live demo / video URL
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ExperienceItem {
  org: string;
  role: string;
  start: string;
  end: string; // "Present" or a month/year
  location?: string;
  highlights: string[];
}

export interface EducationItem {
  school: string;
  detail: string;
  period: string;
}

export interface Profile {
  name: string;
  brand: string;
  role: string;
  valueProp: string;
  email: string;
  phone: string;
  resumeUrl: string; // TODO: add a resume PDF to /public and set its path
  socials: SocialLink[];
  languages: string[];
  certifications: string[];
  honors: string[];
}

export const profile: Profile = {
  name: "Miguel Ngabonziza",
  brand: "My Universe",
  role: "AI + Automation @ One37 ID · CS + Cybersecurity @ Grambling State",
  valueProp:
    "CS + Cybersecurity student building AI, machine learning, and automation systems — blending tech and creativity to ship innovative solutions.",
  email: "shemamiguel2023@gmail.com",
  phone: "+1 (318) 516-4769",
  resumeUrl: "", // TODO
  socials: [
    { label: "GitHub", href: "https://github.com/SNMiguel" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/migztech" },
  ],
  languages: [
    "French (Native / Bilingual)",
    "Kinyarwanda (Native / Bilingual)",
    "English (Professional Working)",
  ],
  certifications: [
    "CodePath — Intermediate Technical Interview Prep",
    "CodePath — Intro to Android Development",
    "Getting Started with Artificial Intelligence",
    "IBM Security — Zero Trust Principles",
    "Supervised Machine Learning: Regression and Classification",
  ],
  honors: ["New Seasons Youth Program Scholar", "President's List"],
};

/**
 * Real, verifiable projects from the profile. Flagship 4 show on the Fast Path.
 */
export const projects: Project[] = [
  {
    id: "vocalyx",
    name: "Vocalyx — Voice Biometric & Deepfake Detection",
    tagline: "Multilingual voice authentication and deepfake-voice detection.", // TODO: confirm "Vocalyx" is the real name
    description:
      "AI/ML systems for multilingual voice biometric authentication and deepfake-voice detection, built at One37 ID. Includes testing and benchmarking pipelines that validate model robustness across languages, devices, and acoustic environments.",
    tech: ["Python", "PyTorch", "AI/ML"], // TODO: confirm exact stack (e.g. ECAPA-TDNN, FastAPI)
    domain: "ai-ml",
    flagship: true,
  },
  {
    id: "taskflow",
    name: "TaskFlow",
    tagline: "AI task-planning hub — Notion Hackathon 1st runner-up.",
    description:
      "An AI-powered task planning hub that integrates with Notion databases. Uses AI to generate time-sensitive schedules and organize activities directly inside Notion. Placed 1st runner-up at the Grambling Notion Hackathon.",
    tech: ["AI", "Notion API", "Front-end"], // TODO: confirm exact stack
    domain: "hackathon",
    flagship: true,
  },
  {
    id: "weather-forecast-app",
    name: "Weather Forecast App",
    tagline: "Real-time forecasts serving 50+ users (Pinnacle Labs).",
    description:
      "A weather forecasting app built with the OpenWeather API delivering real-time data to 50+ users. Built during a Python development internship; collaborated with a team to optimize 1,000+ daily API calls and improve UI/UX.",
    tech: ["Python", "OpenWeather API"], // TODO: confirm stack / repo
    domain: "data-automation",
    flagship: true,
  },
  {
    id: "irecycler",
    name: "Irecycler",
    tagline: "Identifies trash types and locates disposal centers.",
    description:
      "A team-built app that identifies trash types and helps users locate nearby disposal centers, addressing everyday environmental challenges. Built at a Grambling State hackathon.",
    tech: ["App Development"], // TODO: confirm stack
    domain: "hackathon",
    flagship: true,
  },
  // TODO: confirm whether these spec projects are real, then fill them in:
  // PlantGuard-AI (ResNet18?), QuantPilot, AutoApply, DeliveryRadar, Sign Language Bridge
];

export const flagshipProjects = projects.filter((p) => p.flagship);

/** Experience — for Universe Mode "fleet" (spec §12). Real, from profile. */
export const experience: ExperienceItem[] = [
  {
    org: "One37 ID",
    role: "AI and Automation Trainee",
    start: "May 2026",
    end: "Present",
    location: "Laveen, Arizona",
    highlights: [
      "Building multilingual voice biometric authentication systems and deepfake voice detection models using AI/ML.",
      "Developing testing and benchmarking pipelines across languages, devices, and acoustic environments to validate model robustness.",
    ],
  },
  {
    org: "Grambling State University",
    role: "Residential Assistant",
    start: "July 2025",
    end: "Present",
    location: "Grambling, Louisiana",
    highlights: [
      "Lead a residential community of 30+ students with weekly check-ins and conflict resolution, achieving a 95% satisfaction rate.",
      "Plan and execute 5+ community-building events per semester, increasing resident participation by 60%.",
    ],
  },
  {
    org: "Propel2Excel",
    role: "Fellow",
    start: "September 2025",
    end: "Present",
    location: "Grambling, Louisiana",
    highlights: [
      "Selected for a competitive 6-month career-acceleration cohort with mentorship and exposure to industry leaders.",
    ],
  },
  {
    org: "HBCU First",
    role: "HBCU Day-One-Ready Academy Intern",
    start: "September 2025",
    end: "November 2025",
    location: "Grambling, Louisiana",
    highlights: [
      "Selected as 1 of 200 students nationwide for a competitive career-readiness internship.",
      "Engaged in 60+ workshops and employer meetups building leadership and networking skills.",
    ],
  },
  {
    org: "Extern (with PwC)",
    role: "Non-Profit Consulting Remote Externship",
    start: "May 2025",
    end: "July 2025",
    highlights: [
      "Analyzed a nonprofit's donor engagement strategy using communication data and Gen Z trends.",
      "Built and presented a data-visualization slide deck to Extern Inc. and PwC collaborators.",
    ],
  },
  {
    org: "Thurgood Marshall College Fund",
    role: "TMCF × Citi Scholar (2025 Citi HBCU Exploration Program)",
    start: "November 2024",
    end: "May 2025",
    highlights: [
      "Selected as 1 of 100 HBCU students nationwide for the TMCF-Citi Scholars Program.",
      "Completed a 5-day immersive bootcamp at Citi's NYC office.",
    ],
  },
  {
    org: "Pinnacle Labs",
    role: "Python Development Intern",
    start: "November 2024",
    end: "December 2024",
    location: "Grambling, Louisiana",
    highlights: [
      "Developed and deployed 2 applications, including a Weather Forecast App serving 50+ users.",
      "Optimized 1,000+ daily API calls and enhanced UI/UX with a 4-intern team.",
    ],
  },
  {
    org: "ColorStack",
    role: "Active Member",
    start: "September 2024",
    end: "Present",
    location: "Grambling, Louisiana",
    highlights: [
      "Part of a community increasing Black and Latinx representation in tech, through workshops and mentorship.",
    ],
  },
  {
    org: "The Lantern Network",
    role: "Student Ambassador",
    start: "November 2024",
    end: "Present",
    location: "Irvine, California",
    highlights: [],
  },
];

/** Education — for Universe Mode "home world" (spec §13). Real, from profile. */
export const education: EducationItem[] = [
  {
    school: "Grambling State University",
    detail:
      "B.S. Computer Science, minor in Cybersecurity. Full scholarship recipient.",
    period: "August 2024 – May 2028",
  },
  {
    school: "African Leadership University",
    detail: "Foundation Courses: Software / Computer Software Engineering.",
    period: "May 2024 – August 2024",
  },
  {
    school: "Saint Ignatius High School (Rwanda)",
    detail:
      "Advanced Level in Sciences: Mathematics, Physics, Computer Science.",
    period: "January 2020 – August 2023",
  },
];

/** Palette accent per domain (spec §9 color-coding). */
export const domainAccent: Record<ProjectDomain, string> = {
  "ai-ml": "var(--electric-blue)",
  "data-automation": "var(--emerald)",
  hackathon: "var(--soft-gold)",
};
