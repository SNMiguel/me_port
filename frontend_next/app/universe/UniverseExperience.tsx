"use client";

import { useState } from "react";
import IntroSequence from "./intro/IntroSequence";
import UniverseClient from "./UniverseClient";
import type {
  Project,
  ExperienceItem,
  EducationItem,
  Profile,
} from "../data/portfolio";

type SkillsData = {
  languages: string[];
  frameworks: string[];
  tools: string[];
  aiml: string[];
  spokenLanguages: string[];
};

interface Props {
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  profile: Profile;
}

/**
 * Universe Mode entry flow (spec §6): the intro scene plays first, then the
 * hyperspace dive hands off to the open universe. Once entered, we don't replay
 * the intro for the rest of the visit.
 */
export default function UniverseExperience(props: Props) {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <IntroSequence onEnter={() => setEntered(true)} />;
  }
  return <UniverseClient {...props} />;
}
