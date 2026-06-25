/**
 * SHARED DATA LAYER — single source of truth (MIGUEL_UNIVERSE_SPEC §2.3).
 * Both the Fast Path and (later) Universe Mode read from this file.
 * Update content here once; it propagates everywhere.
 *
 * RULE (spec §10): No invented metrics. Any field marked `// TODO` must be
 * filled with real, verifiable info by Miguel before launch. Empty strings are
 * intentionally not rendered, so nothing fake ever shows.
 */

export type ProjectDomain = "ai-ml" | "data-automation" | "hackathon";

export interface Project {
  /** Stable id, also used later as the planet key in Universe Mode. */
  id: string;
  name: string;
  /** One-line result/impact. Keep it real — no invented numbers. */
  tagline: string;
  /** 2–4 sentences: the problem and what was built. Human-written. */
  description: string;
  /** Exact tools actually used (spec §10). */
  tech: string[];
  domain: ProjectDomain;
  /** Shown on Fast Path as a flagship card. */
  flagship: boolean;
  github?: string; // TODO: real repo URL
  demo?: string; // TODO: live demo / video URL if available
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  brand: string;
  role: string;
  valueProp: string;
  email: string;
  resumeUrl: string; // TODO: link a real resume PDF (e.g. /resume.pdf)
  socials: SocialLink[];
  education: {
    school: string;
    degree: string;
    expectedGraduation: string; // TODO
    gpa?: string; // TODO (optional)
    scholarship?: string; // TODO
  };
}

export const profile: Profile = {
  name: "Miguel Shema Ngabonziza",
  brand: "My Universe",
  role: "CS @ Grambling State · AI/ML + Full-Stack Engineer",
  valueProp:
    "I build AI/ML systems and full-stack products end to end — from model to interface.",
  email: "shemamiguel2023@gmail.com",
  resumeUrl: "", // TODO: add resume PDF and set path, e.g. "/Miguel-Shema-Resume.pdf"
  socials: [
    { label: "GitHub", href: "https://github.com/SNMiguel" },
    { label: "LinkedIn", href: "" }, // TODO: real LinkedIn URL
  ],
  education: {
    school: "Grambling State University",
    degree: "B.S. Computer Science",
    expectedGraduation: "", // TODO
    gpa: "", // TODO
    scholarship: "", // TODO
  },
};

/**
 * Flagship 4 (spec §2.1) are marked flagship: true and shown on the Fast Path.
 * The remaining projects appear later as planets in Universe Mode (spec §9).
 * Descriptions below are claim-free starting points derived from the spec's
 * own tech call-outs — Miguel: verify/replace each before launch.
 */
export const projects: Project[] = [
  {
    id: "vocalyx",
    name: "Vocalyx",
    tagline: "", // TODO: one-line real result
    description:
      "A voice/speaker recognition system using an ECAPA-TDNN model served through a FastAPI backend.", // TODO: verify
    tech: ["Python", "PyTorch", "ECAPA-TDNN", "FastAPI"],
    domain: "ai-ml",
    flagship: true,
  },
  {
    id: "plantguard-ai",
    name: "PlantGuard-AI",
    tagline: "", // TODO
    description:
      "A plant-disease detection system built around a ResNet18 image classifier.", // TODO: verify
    tech: ["Python", "PyTorch", "ResNet18"],
    domain: "ai-ml",
    flagship: true,
  },
  {
    id: "quantpilot",
    name: "QuantPilot",
    tagline: "", // TODO
    description: "", // TODO: real problem + what was built
    tech: [], // TODO: real stack
    domain: "data-automation",
    flagship: true,
  },
  {
    id: "autoapply",
    name: "AutoApply",
    tagline: "", // TODO
    description: "", // TODO: real problem + what was built
    tech: [], // TODO: real stack
    domain: "data-automation",
    flagship: true,
  },
  {
    id: "deliveryradar",
    name: "DeliveryRadar",
    tagline: "",
    description: "",
    tech: [],
    domain: "data-automation",
    flagship: false,
  },
  {
    id: "sign-language-bridge",
    name: "Sign Language Bridge",
    tagline: "",
    description: "",
    tech: [],
    domain: "hackathon",
    flagship: false,
  },
];

export const flagshipProjects = projects.filter((p) => p.flagship);

/** Palette accent per domain (spec §9 color-coding). */
export const domainAccent: Record<ProjectDomain, string> = {
  "ai-ml": "var(--electric-blue)",
  "data-automation": "var(--emerald)",
  hackathon: "var(--soft-gold)",
};
