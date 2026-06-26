import UniverseClient from "./UniverseClient";
import {
  projects,
  experience,
  education,
  skills,
  profile,
} from "../data/portfolio";

/**
 * UNIVERSE MODE (MIGUEL_UNIVERSE_SPEC §2.2, Phase 3).
 * The opt-in real-time scene. Plain look for now — no hyperspace dive (Phase 5)
 * and no comic shader treatment (Phase 3.5). Reads everything from the shared
 * data layer; this server component just forwards it to the client scene.
 */
export const metadata = {
  title: "My Universe — Universe Mode",
};

export default function UniverseMode() {
  return (
    <UniverseClient
      projects={projects}
      experience={experience}
      education={education}
      skills={skills}
      profile={profile}
    />
  );
}
