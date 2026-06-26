import type {
  Project,
  ExperienceItem,
  EducationItem,
} from "../data/portfolio";
import { domainAccent } from "../data/portfolio";

/**
 * Pure layout: turns the shared data into positioned 3D nodes for the scene.
 * Keeping this separate from rendering makes the universe's structure easy to
 * reason about and tweak (spec §9 mapping: planets / fleet / home world /
 * constellations / beacon).
 */

export type NodeKind =
  | "project"
  | "education"
  | "experience"
  | "skills"
  | "contact";

export type Vec3 = [number, number, number];

export interface SceneNode {
  id: string;
  kind: NodeKind;
  label: string;
  position: Vec3;
  /** Visual radius of the body. */
  size: number;
  /** CSS var() accent for this node. */
  accent: string;
  /** Index back into the source data array (for the detail panel). */
  index: number;
}

const EDUCATION_ACCENT = "var(--white)";
const EXPERIENCE_ACCENT = "var(--purple-nebula)";
const SKILLS_ACCENT = "var(--electric-blue)";
const CONTACT_ACCENT = "var(--soft-gold)";

export function buildScene(
  projects: Project[],
  experience: ExperienceItem[],
  education: EducationItem[],
  skillGroups: { key: string; label: string }[]
): SceneNode[] {
  const nodes: SceneNode[] = [];

  // Home world — the planet the camera starts nearest to (spec §13).
  nodes.push({
    id: "home-world",
    kind: "education",
    label: education[0]?.school ?? "Home World",
    position: [0, 0, 0],
    size: 2.4,
    accent: EDUCATION_ACCENT,
    index: 0,
  });

  // Project planets — a ring around the home world (spec §9).
  const pr = 18;
  projects.forEach((p, i) => {
    const a = (i / projects.length) * Math.PI * 2;
    const y = (i % 2 === 0 ? 1 : -1) * (1.5 + (i % 3));
    nodes.push({
      id: p.id,
      kind: "project",
      label: p.name,
      position: [Math.cos(a) * pr, y, Math.sin(a) * pr],
      size: p.flagship ? 1.9 : 1.4,
      accent: domainAccent[p.domain],
      index: i,
    });
  });

  // Fleet — experience as small craft along a wider, lower orbit (spec §12).
  const fr = 30;
  experience.forEach((e, i) => {
    const a = (i / experience.length) * Math.PI * 2 + 0.3;
    nodes.push({
      id: `exp-${i}`,
      kind: "experience",
      label: e.org,
      position: [Math.cos(a) * fr, -6 + (i % 2), Math.sin(a) * fr],
      size: 0.9,
      accent: EXPERIENCE_ACCENT,
      index: i,
    });
  });

  // Constellations — skills grouped, clustered high above (spec §11).
  skillGroups.forEach((g, i) => {
    const a = (i / skillGroups.length) * Math.PI * 2;
    nodes.push({
      id: `skills-${g.key}`,
      kind: "skills",
      label: g.label,
      position: [Math.cos(a) * 14, 12 + (i % 2) * 2, Math.sin(a) * 14],
      size: 1.1,
      accent: SKILLS_ACCENT,
      index: i,
    });
  });

  // Beacon — contact, visually separate from the planets (spec §14).
  nodes.push({
    id: "beacon",
    kind: "contact",
    label: "Contact Beacon",
    position: [0, 16, -6],
    size: 1.6,
    accent: CONTACT_ACCENT,
    index: 0,
  });

  return nodes;
}
