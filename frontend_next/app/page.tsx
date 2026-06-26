"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GraduationCap,
  MapPin,
  BookOpen,
  Briefcase,
  Lightbulb,
  Wrench,
  Award,
  Users,
  Mail,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import {
  profile,
  projects,
  experience,
  education,
  skills,
  certifications,
  leadership,
  type Project,
} from "./data/portfolio";

/**
 * Single-page portfolio. Conventional, recruiter-friendly layout adapted from
 * the reference design (hebaalazzeh.github.io): sticky nav, hero, about,
 * experience timeline, projects grid, skills, education, leadership,
 * certifications, contact. All content from the shared data layer.
 */

const NAV = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Skills", "skills"],
  ["Education", "education"],
  ["Contact", "contact"],
] as const;

const SKILL_GROUPS: { label: string; key: keyof typeof skills }[] = [
  { label: "AI / ML", key: "aiml" },
  { label: "Languages", key: "languages" },
  { label: "Frameworks", key: "frameworks" },
  { label: "Tools", key: "tools" },
  { label: "Spoken", key: "spokenLanguages" },
];

export default function Home() {
  return (
    <div className="font-sans">
      <Nav />
      <Hero />
      <About />
      <WebDivider />
      <Experience />
      <WebDivider />
      <Projects />
      <WebDivider />
      <Skills />
      <WebDivider />
      <Education />
      <WebDivider />
      <Leadership />
      <WebDivider />
      <Certifications />
      <WebDivider />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------- shared ---------- */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Minimal Miles-style spider emblem. */
/** Faint Spider-Verse web spun from a corner. */
function WebCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      {/* radial strands */}
      <path d="M0 0 L120 20 M0 0 L100 50 M0 0 L75 75 M0 0 L50 100 M0 0 L20 120" />
      {/* concentric web rings */}
      <path d="M28 4 Q22 22 4 28" />
      <path d="M55 8 Q42 42 8 55" />
      <path d="M85 14 Q64 64 14 85" />
      <path d="M112 22 Q86 86 22 112" />
    </svg>
  );
}

/** Ornamental flourish — a line that fades to a small diamond (mirrorable). */
function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`hidden items-center gap-1.5 sm:flex ${
        flip ? "flex-row-reverse" : ""
      }`}
    >
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
      <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
      <span className="h-1 w-1 rotate-45 bg-accent/60" />
    </span>
  );
}

function SectionTitle({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  const [glitch, setGlitch] = useState(false);
  return (
    <motion.div
      onViewportEnter={() => setGlitch(true)}
      viewport={{ once: true, margin: "-80px" }}
      className="mb-12 flex flex-col items-center gap-3 text-center"
    >
      <div className="flex items-center gap-4">
        <Flourish />
        <h2
          onAnimationEnd={() => setGlitch(false)}
          className={`spider-glitch flex cursor-default items-center gap-2.5 font-serif text-3xl font-bold sm:text-4xl ${
            glitch ? "glitch-in" : ""
          }`}
        >
          <Icon className="h-7 w-7 text-primary" />
          {title}
        </h2>
        <Flourish flip />
      </div>
      <span className="h-0.5 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
    </motion.div>
  );
}

/** Spider-web divider that draws itself in on scroll (spec: animated webbing). */
const drawWeb = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" as const },
  },
};

function WebDivider() {
  return (
    <div className="mx-auto max-w-5xl px-6" aria-hidden="true">
      <motion.svg
        viewBox="0 0 1000 60"
        className="h-10 w-full text-primary/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        <motion.path d="M0 30 H420" variants={drawWeb} />
        <motion.path d="M580 30 H1000" variants={drawWeb} />
        {/* radial strands from the center node */}
        <motion.path
          d="M500 30 L455 12 M500 30 L545 12 M500 30 L455 48 M500 30 L545 48 M500 30 L448 30 M500 30 L552 30"
          variants={drawWeb}
        />
        {/* web rings */}
        <motion.path
          d="M470 20 Q500 28 530 20 M470 40 Q500 32 530 40"
          variants={drawWeb}
        />
        <circle cx="500" cy="30" r="2.5" fill="currentColor" />
      </motion.svg>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
      {children}
    </span>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-16 sm:px-6 sm:py-20 ${className}`}
    >
      {children}
    </section>
  );
}

/* ---------- nav ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Miles Morales theme is dark by default; toggle switches to the light variant.
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 font-serif text-xl font-bold text-primary"
        >
          <span
            aria-hidden="true"
            className="h-7 w-7 bg-primary"
            style={{
              WebkitMaskImage: "url(/spider-symbol.svg)",
              maskImage: "url(/spider-symbol.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          M.N.
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLight((v) => !v)}
            aria-label="Toggle light mode"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {light ? "Dark" : "Light"}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full border border-border px-3 py-1.5 text-xs md:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-20"
    >
      {/* Spider-Verse hero background. Add the image at
          frontend_next/public/hero-spiderverse.jpg — until then this layer is
          simply invisible and the gradient/page background shows through. */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-spiderverse.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark scrim so text stays readable over the photo in both themes,
          fading into the page background at the bottom */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/45 to-background"
        aria-hidden="true"
      />

      {/* Spider-Verse web corners */}
      <WebCorner className="absolute left-0 top-0 -z-10 h-40 w-40 text-primary/25" />
      <WebCorner className="absolute bottom-0 right-0 -z-10 h-40 w-40 rotate-180 text-accent/25" />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative grid place-items-center">
            {/* soft glow halo (no hard background) */}
            <div className="absolute h-24 w-24 rounded-full bg-primary/25 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mask.svg?v=3"
              alt="Spider-Man mask"
              className="relative h-20 w-20 drop-shadow-[0_0_16px_hsl(var(--primary)/0.7)]"
            />
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-sm uppercase tracking-[0.3em] text-primary sm:text-base"
        >
          AI/ML &amp; Full-Stack Engineer
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="spider-glitch cursor-default font-serif text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          Miguel Ngabonziza
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl text-base text-white/80 sm:text-lg"
        >
          {profile.valueProp}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/85"
        >
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-accent" />
            CS + Cybersecurity @ Grambling State
          </span>
          <span className="hidden h-4 w-px bg-white/30 sm:block" />
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-accent" />
            {profile.location}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {["One37 Solutions", "TMCF × Citi", "PwC", "Grambling State"].map(
            (c) => (
              <span
                key={c}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"
              >
                {c}
              </span>
            )
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Star className="h-4 w-4" />
            Explore My Work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:border-accent"
          >
            Get in Touch
          </a>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:border-accent"
            >
              Resume
            </a>
          )}
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary"
      >
        <ChevronDown className="animate-bounce-down h-6 w-6" />
      </a>
    </section>
  );
}

/* ---------- about ---------- */

const ORGANIZATIONS = [
  "One37 Solutions",
  "Grambling State University",
  "Thurgood Marshall College Fund",
  "Citi",
  "PwC",
  "Pinnacle Labs",
  "HBCU First",
  "ColorStack",
  "NSBE",
  "Propel2Excel",
  "The Lantern Network",
];

function About() {
  return (
    <Section id="about">
      <SectionTitle icon={BookOpen} title="About Me" />
      <Reveal>
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center">
          {/* Profile photo with glowing ring (add /public/profile.jpg) */}
          <div className="relative shrink-0">
            <div className="animate-spider-sense absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/40 to-accent/40 blur-xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile.jpg"
              alt={profile.name}
              className="relative h-44 w-44 rounded-full border-2 border-primary/60 object-cover"
            />
          </div>
          <p className="text-center text-lg leading-relaxed text-muted-foreground sm:text-left">
            Hi, I&apos;m Miguel, a Computer Science + Cybersecurity student at
            Grambling State University (GPA 4.00) and an AI &amp; Automation
            trainee at One37 Solutions. I build AI/ML systems and full-stack
            products end to end, from voice-biometric models and reasoning
            agents to autonomous daemons and trading pipelines. Originally from
            Rwanda, I speak four languages and care about shipping real,
            working software.
          </p>
        </div>
      </Reveal>

      {/* Organizations & companies marquee */}
      <div className="mt-14 flex flex-col gap-5">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Organizations &amp; Companies
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...ORGANIZATIONS, ...ORGANIZATIONS].map((o, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-serif text-lg font-semibold text-muted-foreground/70"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- experience ---------- */

function Experience() {
  return (
    <Section id="experience">
      <SectionTitle icon={Briefcase} title="Experience" />
      <div className="relative mx-auto max-w-4xl">
        {/* Center timeline line (desktop) / left rail (mobile) */}
        <span className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-primary/60 via-border to-accent/50 md:left-1/2 md:block md:-translate-x-1/2" />
        <span className="absolute left-5 top-0 h-full w-px bg-border md:hidden" />

        <div className="flex flex-col gap-8 md:gap-12">
          {experience.map((x, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={`${x.org}-${i}`}
                className="relative pl-14 md:grid md:grid-cols-2 md:gap-10 md:pl-0"
              >
                {/* Node on the line */}
                <span className="absolute left-5 top-4 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-accent bg-background font-mono text-sm text-accent md:left-1/2">
                  &lt;/&gt;
                </span>

                <motion.div
                  initial={{ opacity: 0, x: left ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={
                    left
                      ? "md:col-start-1 md:pr-10"
                      : "md:col-start-2 md:pl-10"
                  }
                >
                  <div className="comic-card rounded-lg border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold">{x.org}</h3>
                      <span className="text-xs text-muted-foreground">
                        {x.start} – {x.end}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary">{x.role}</p>
                    {x.location && (
                      <p className="text-xs text-muted-foreground">
                        {x.location}
                      </p>
                    )}
                    <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      {x.highlights.map((h, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------- projects ---------- */

function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? projects : projects.slice(0, 6);
  return (
    <Section id="projects">
      <SectionTitle icon={Lightbulb} title="Projects" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.08}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
      {projects.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary"
          >
            {showAll ? "Show less" : `View all ${projects.length} projects`}
          </button>
        </div>
      )}
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="comic-card group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5">
      {/* THWIP! comic accent + spiderweb on hover */}
      <span className="pointer-events-none absolute -right-2 -top-3 z-10 flex items-center gap-1 rotate-6 rounded-md border-2 border-white bg-primary px-2 py-0.5 font-serif text-xs font-extrabold italic text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 [transform:scale(0.4)] group-hover:[transform:scale(1)_rotate(6deg)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/spider-symbol.svg"
          alt=""
          className="h-3.5 w-3.5 [filter:brightness(0)_invert(1)]"
        />
        THWIP!
      </span>
      <h3 className="font-serif text-lg font-bold">{project.name}</h3>
      {project.tagline && (
        <p className="text-sm font-medium text-primary">{project.tagline}</p>
      )}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      {project.tech.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tech.slice(0, 6).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
      <div className="flex gap-4 pt-1 text-sm">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            GitHub →
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Demo →
          </a>
        )}
      </div>
    </article>
  );
}

/* ---------- skills ---------- */

function Skills() {
  return (
    <Section id="skills">
      <SectionTitle icon={Wrench} title="Skills" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal key={g.key} delay={(i % 3) * 0.08}>
            <div className="comic-card flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5">
              <h3 className="font-serif text-base font-bold text-primary">
                {g.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills[g.key].map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- education ---------- */

function Education() {
  return (
    <Section id="education">
      <SectionTitle icon={GraduationCap} title="Education" />
      <div className="flex flex-col gap-4">
        {education.map((e, i) => (
          <Reveal key={e.school} delay={i * 0.08}>
            <div className="comic-card rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-lg font-bold">{e.school}</h3>
                <span className="text-xs text-muted-foreground">
                  {e.period}
                </span>
              </div>
              <p className="text-sm text-primary">{e.detail}</p>
              {e.honors && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.honors.map((h) => (
                    <Tag key={h}>{h}</Tag>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}

        {/* Dedicated Relevant Coursework card */}
        {education[0]?.coursework && (
          <Reveal delay={0.16}>
            <div className="comic-card rounded-lg border border-border bg-card p-5">
              <p className="mb-3 flex items-center gap-2 font-serif text-base font-bold">
                <BookOpen className="h-5 w-5 text-primary" />
                Relevant Coursework
              </p>
              <div className="flex flex-wrap gap-1.5">
                {education[0].coursework.map((c) => (
                  <Tag key={c}>{c}</Tag>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

/* ---------- leadership ---------- */

function Leadership() {
  return (
    <Section id="leadership">
      <SectionTitle icon={Users} title="Leadership" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leadership.map((l, i) => (
          <Reveal key={l.org} delay={(i % 3) * 0.06}>
            <div className="comic-card flex h-full flex-col gap-1 rounded-lg border border-border bg-card p-4">
              <h3 className="font-serif text-sm font-bold">{l.role}</h3>
              <p className="text-xs text-primary">{l.org}</p>
              <p className="text-xs text-muted-foreground">{l.period}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- certifications ---------- */

function Certifications() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? certifications : certifications.slice(0, 6);
  return (
    <Section id="certifications">
      <SectionTitle icon={Award} title="Certifications" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c, i) => (
          <Reveal key={c.name} delay={(i % 3) * 0.06}>
            <div className="comic-card flex h-full flex-col gap-1 rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium">{c.name}</h3>
              <p className="text-xs">
                <span className="text-primary">{c.issuer}</span>
                <span className="text-muted-foreground"> · {c.date}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      {certifications.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary"
          >
            {showAll ? "Show less" : `View all ${certifications.length}`}
          </button>
        </div>
      )}
    </Section>
  );
}

/* ---------- contact ---------- */

function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionTitle icon={Mail} title="Get in Touch" />
          <p className="max-w-xl text-muted-foreground">
            I&apos;m open to internships and collaboration. The fastest way to
            reach me is below.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Email Me
            </a>
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} {profile.name}. Built from scratch.
    </footer>
  );
}
