import Link from "next/link";
import Starfield from "../components/Starfield";

/**
 * UNIVERSE MODE — placeholder shell (MIGUEL_UNIVERSE_SPEC §2.2).
 * The opt-in cinematic experience (Phases 3–5) will be built here: boot
 * sequence, illustrated intro, hyperspace dive, and the real-time Three.js
 * open universe. For now it's a stub that establishes the route and the
 * mandatory persistent "Exit to quick view" control so the two-mode structure
 * is real from the start. Nobody ever gets trapped here.
 */
export const metadata = {
  title: "My Universe — Universe Mode",
};

export default function UniverseMode() {
  return (
    <>
      <Starfield />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="font-mono text-sm tracking-widest text-[var(--electric-blue)]">
          UNIVERSE MODE
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Under construction
        </h1>
        <p className="max-w-xl text-white/60">
          The cinematic universe — planets, constellations, and the hands-forming-galaxy
          intro — is being built here (Phases 3–5). The fast, complete portfolio
          lives on the quick view.
        </p>
        <Link
          href="/"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[var(--soft-gold)] hover:text-white"
        >
          ← Exit to quick view
        </Link>
      </main>
    </>
  );
}
