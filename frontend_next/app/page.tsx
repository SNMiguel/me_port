import Link from "next/link";
import Starfield from "./components/Starfield";
import {
  profile,
  flagshipProjects,
  domainAccent,
  type Project,
} from "./data/portfolio";

/**
 * FAST PATH (MIGUEL_UNIVERSE_SPEC §2.1).
 * Default entry. Loads fast, no animation gate, works on locked-down laptops.
 * Name + role + value prop, all contact links visible without scrolling,
 * grid of flagship projects, restrained starfield, one "Enter the Universe"
 * entry point. NO shader treatment here (spec §5.1).
 */
export default function FastPath() {
  const socials = profile.socials.filter((s) => s.href);

  return (
    <>
      <Starfield />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-12 sm:py-16">
        {/* Header — name, role, value prop, contact above the fold */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <AfroMark />
            <span className="font-mono text-sm tracking-widest text-[var(--electric-blue)]">
              MY UNIVERSE
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              {profile.name}
            </h1>
            <p className="text-lg text-[var(--soft-gold)] sm:text-xl">
              {profile.role}
            </p>
            <p className="max-w-2xl text-base text-white/70 sm:text-lg">
              {profile.valueProp}
            </p>
          </div>

          {/* Contact row — visible without scrolling */}
          <nav className="flex flex-wrap items-center gap-3" aria-label="Contact">
            {profile.resumeUrl && (
              <PrimaryLink href={profile.resumeUrl}>Resume</PrimaryLink>
            )}
            {socials.map((s) => (
              <SecondaryLink key={s.label} href={s.href}>
                {s.label}
              </SecondaryLink>
            ))}
            <SecondaryLink href={`mailto:${profile.email}`}>Email</SecondaryLink>
          </nav>
        </header>

        {/* Flagship projects grid */}
        <section className="flex flex-col gap-6" aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="text-sm font-medium uppercase tracking-widest text-white/50"
          >
            Flagship Projects
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {flagshipProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>

        {/* The single opt-in entry point to Universe Mode (spec §2.1) */}
        <section className="flex flex-col items-start gap-3 border-t border-white/10 pt-10">
          <p className="text-sm text-white/50">
            Want the full experience? It&apos;s a cinematic, interactive
            universe — entirely optional.
          </p>
          <Link
            href="/universe"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--soft-gold)]/60 px-5 py-2.5 text-sm font-medium text-[var(--soft-gold)] transition-colors hover:bg-[var(--soft-gold)] hover:text-[var(--deep-space)]"
          >
            Enter the Universe →
          </Link>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 pb-10 text-xs text-white/30">
        © {new Date().getFullYear()} {profile.name}. Built by hand.
      </footer>
    </>
  );
}

/* ---------- presentational pieces ---------- */

function ProjectCard({ project }: { project: Project }) {
  const accent = domainAccent[project.domain];
  return (
    <article
      className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-[var(--deep-space-2)] p-6 transition-colors hover:border-[var(--soft-gold)]/40"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-6 h-8 w-1 rounded-full"
        style={{ background: accent }}
      />
      <h3 className="text-xl font-semibold">{project.name}</h3>
      {project.tagline && (
        <p className="text-sm font-medium text-[var(--soft-gold)]">
          {project.tagline}
        </p>
      )}
      {project.description && (
        <p className="text-sm leading-relaxed text-white/70">
          {project.description}
        </p>
      )}
      {project.tech.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/60"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex gap-4 pt-2 text-sm">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--electric-blue)] hover:underline"
          >
            GitHub
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--electric-blue)] hover:underline"
          >
            Demo
          </a>
        )}
      </div>
    </article>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-full bg-[var(--soft-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--deep-space)] transition-opacity hover:opacity-90"
    >
      {children}
    </a>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[var(--electric-blue)] hover:text-white"
    >
      {children}
    </a>
  );
}

/** Afro-silhouette logo mark (spec §4). Placeholder geometric mark until the
 * commissioned/AI-generated brand asset exists; intentionally simple, on-palette. */
function AfroMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="16" cy="13" r="9" fill="var(--purple-nebula)" opacity="0.9" />
      <circle cx="16" cy="20" r="5" fill="var(--deep-space-2)" />
      <circle cx="16" cy="19" r="3.2" fill="var(--electric-blue)" />
    </svg>
  );
}
