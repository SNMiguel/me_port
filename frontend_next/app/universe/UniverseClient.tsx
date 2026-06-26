"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import Effects from "./effects/Effects";
import type {
  Project,
  ExperienceItem,
  EducationItem,
  Profile,
} from "../data/portfolio";
import { buildScene, type SceneNode } from "./layout3d";

/** Resolve the locked CSS palette to hex for Three.js materials (spec §4). */
const PALETTE: Record<string, string> = {
  "var(--deep-space)": "#060812",
  "var(--electric-blue)": "#4f8cff",
  "var(--purple-nebula)": "#a855f7",
  "var(--emerald)": "#10b981",
  "var(--soft-gold)": "#f5c451",
  "var(--white)": "#ffffff",
};
const hex = (v: string) => PALETTE[v] ?? "#ffffff";

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

// TEMP debug flag — set false to render the scene without postprocessing.
const ENABLE_EFFECTS = false;

const SKILL_GROUPS = [
  { key: "aiml", label: "AI / ML" },
  { key: "frameworks", label: "Full-Stack" },
  { key: "tools", label: "Systems & Tools" },
  { key: "languages", label: "Languages" },
] as const;

export default function UniverseClient(props: Props) {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<SceneNode | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [comic, setComic] = useState(true);

  useEffect(() => {
    // WebGL capability check — graceful fallback if unsupported (spec §19).
    try {
      const c = document.createElement("canvas");
      const gl =
        c.getContext("webgl2") || c.getContext("webgl");
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    // Performance heuristic (spec §19): default the comic layer ON only on
    // capable hardware; weaker devices start plain and can opt in via toggle.
    const cores = navigator.hardwareConcurrency ?? 4;
    setComic(cores >= 8);
  }, []);

  const nodes = useMemo(
    () =>
      buildScene(
        props.projects,
        props.experience,
        props.education,
        SKILL_GROUPS.map((g) => ({ key: g.key, label: g.label }))
      ),
    [props.projects, props.experience, props.education]
  );

  if (webglOk === false) {
    return <Fallback />;
  }

  return (
    <div className="fixed inset-0 bg-[var(--deep-space)]">
      {webglOk && (
        <Canvas
          camera={{ position: [0, 10, 42], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <SceneContents
            nodes={nodes}
            selected={selected}
            onSelect={setSelected}
            reduceMotion={reduceMotion}
            comic={comic}
          />
        </Canvas>
      )}

      {/* ---- 2D overlay UI ---- */}
      <TopBar />
      {webglOk && ENABLE_EFFECTS && (
        <button
          onClick={() => setComic((v) => !v)}
          className="absolute bottom-5 right-5 z-10 rounded-full border border-white/15 bg-[var(--deep-space)]/70 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:border-[var(--soft-gold)] hover:text-white"
          title="Toggle the comic shader treatment (spec §5.1)"
        >
          Comic mode: {comic ? "On" : "Off"}
        </button>
      )}
      {!selected && <Legend />}
      {selected && (
        <DetailPanel
          node={selected}
          data={props}
          onClose={() => setSelected(null)}
        />
      )}

      {webglOk === null && (
        <div className="absolute inset-0 grid place-items-center text-white/50">
          Initializing universe…
        </div>
      )}
    </div>
  );
}

/* ---------------- 3D scene ---------------- */

function SceneContents({
  nodes,
  selected,
  onSelect,
  reduceMotion,
  comic,
}: {
  nodes: SceneNode[];
  selected: SceneNode | null;
  onSelect: (n: SceneNode | null) => void;
  reduceMotion: boolean;
  comic: boolean;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <>
      {/* Palette-colored lighting (spec §17): purple-leaning ambient,
          electric-blue key, soft-gold accent. */}
      <ambientLight color={hex("var(--purple-nebula)")} intensity={0.5} />
      <pointLight
        position={[0, 0, 0]}
        color={hex("var(--electric-blue)")}
        intensity={120}
        distance={120}
      />
      <directionalLight
        position={[20, 30, 20]}
        color={hex("var(--soft-gold)")}
        intensity={0.6}
      />

      <Stars
        radius={120}
        depth={60}
        count={4000}
        factor={4}
        fade
        speed={reduceMotion ? 0 : 0.4}
      />

      {nodes.map((n) => (
        <Node
          key={n.id}
          node={n}
          active={selected?.id === n.id}
          dimmed={!!selected && selected.id !== n.id}
          reduceMotion={reduceMotion}
          onClick={() => onSelect(n)}
        />
      ))}

      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={6}
        maxDistance={90}
        autoRotate={!reduceMotion && !selected}
        autoRotateSpeed={0.25}
      />

      <CameraRig
        controls={controls}
        selected={selected}
        reduceMotion={reduceMotion}
      />

      {/* TEMP: ENABLE_EFFECTS=false isolates whether postprocessing crashes */}
      {ENABLE_EFFECTS && <Effects comic={comic} reduceMotion={reduceMotion} />}
    </>
  );
}

function Node({
  node,
  active,
  dimmed,
  reduceMotion,
  onClick,
}: {
  node: SceneNode;
  active: boolean;
  dimmed: boolean;
  reduceMotion: boolean;
  onClick: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = hex(node.accent);

  useFrame((_, dt) => {
    if (mesh.current && !reduceMotion) {
      mesh.current.rotation.y += dt * 0.15;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const isBeacon = node.kind === "contact";

  return (
    <group position={node.position}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.12 : 1}
      >
        {isBeacon ? (
          <octahedronGeometry args={[node.size, 0]} />
        ) : (
          <sphereGeometry args={[node.size, 32, 32]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.1 : hovered ? 0.8 : 0.45}
          roughness={0.5}
          metalness={0.1}
          transparent
          opacity={dimmed ? 0.35 : 1}
        />
      </mesh>

      {/* Soft halo */}
      <mesh scale={1.4}>
        {isBeacon ? (
          <octahedronGeometry args={[node.size, 0]} />
        ) : (
          <sphereGeometry args={[node.size, 16, 16]} />
        )}
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.03 : hovered || active ? 0.12 : 0.06}
          depthWrite={false}
        />
      </mesh>

      {(hovered || active) && (
        <Html
          center
          distanceFactor={node.size > 1.5 ? 24 : 18}
          position={[0, node.size + 1.2, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span className="whitespace-nowrap rounded-full border border-white/15 bg-[var(--deep-space)]/85 px-3 py-1 text-xs font-medium text-white">
            {node.label}
          </span>
        </Html>
      )}
    </group>
  );
}

function CameraRig({
  controls,
  selected,
  reduceMotion,
}: {
  controls: React.RefObject<React.ComponentRef<typeof OrbitControls> | null>;
  selected: SceneNode | null;
  reduceMotion: boolean;
}) {
  const { camera } = useThree();
  const desiredPos = useRef(new THREE.Vector3(0, 10, 42));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0));
  const flying = useRef(false);

  useEffect(() => {
    if (selected) {
      const p = new THREE.Vector3(...selected.position);
      const dir =
        p.lengthSq() < 0.01 ? new THREE.Vector3(0, 0.4, 1) : p.clone().normalize();
      desiredTarget.current.copy(p);
      desiredPos.current
        .copy(p)
        .add(dir.multiplyScalar(selected.size * 4 + 7))
        .add(new THREE.Vector3(0, selected.size * 1.5 + 1.5, 0));
    } else {
      desiredTarget.current.set(0, 0, 0);
      desiredPos.current.set(0, 10, 42);
    }
    flying.current = true;
    if (controls.current) controls.current.enabled = false;
  }, [selected, controls]);

  useFrame(() => {
    const c = controls.current;
    if (!flying.current || !c) return;

    if (reduceMotion) {
      camera.position.copy(desiredPos.current);
      c.target.copy(desiredTarget.current);
    } else {
      camera.position.lerp(desiredPos.current, 0.06);
      c.target.lerp(desiredTarget.current, 0.06);
    }
    c.update();

    if (
      camera.position.distanceTo(desiredPos.current) < 0.4 ||
      reduceMotion
    ) {
      flying.current = false;
      c.enabled = true;
    }
  });

  return null;
}

/* ---------------- 2D overlay ---------------- */

function TopBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5">
      <span className="font-mono text-sm tracking-widest text-[var(--electric-blue)]">
        MY UNIVERSE
      </span>
      <Link
        href="/"
        className="pointer-events-auto rounded-full border border-white/15 bg-[var(--deep-space)]/70 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:border-[var(--soft-gold)] hover:text-white"
      >
        Exit to quick view
      </Link>
    </div>
  );
}

function Legend() {
  const items = [
    { c: "var(--electric-blue)", t: "AI / ML projects" },
    { c: "var(--emerald)", t: "Data & automation" },
    { c: "var(--soft-gold)", t: "Hackathons · Beacon (contact)" },
    { c: "var(--purple-nebula)", t: "Fleet (experience)" },
    { c: "var(--white)", t: "Home world (education)" },
  ];
  return (
    <div className="pointer-events-none absolute bottom-5 left-5 flex flex-col gap-2 rounded-xl border border-white/10 bg-[var(--deep-space)]/70 p-4 text-xs text-white/70 backdrop-blur">
      <p className="mb-1 font-medium text-white/90">Click any body to explore</p>
      {items.map((i) => (
        <div key={i.t} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: `var(${i.c.slice(4, -1)})` }}
          />
          {i.t}
        </div>
      ))}
      <p className="mt-1 text-white/40">Drag to orbit · scroll to zoom</p>
    </div>
  );
}

function DetailPanel({
  node,
  data,
  onClose,
}: {
  node: SceneNode;
  data: Props;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-[var(--deep-space)]/85 p-7 backdrop-blur-xl">
      <button
        onClick={onClose}
        className="mb-6 self-start rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/80 transition-colors hover:border-[var(--soft-gold)] hover:text-white"
      >
        ← Return to orbit
      </button>
      <PanelBody node={node} data={data} />
    </div>
  );
}

function PanelBody({ node, data }: { node: SceneNode; data: Props }) {
  if (node.kind === "project") {
    const p = data.projects[node.index];
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{p.name}</h2>
        {p.tagline && (
          <p className="text-sm font-medium text-[var(--soft-gold)]">
            {p.tagline}
          </p>
        )}
        <p className="text-sm leading-relaxed text-white/70">{p.description}</p>
        {p.tech.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/60"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-4 pt-1 text-sm">
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--electric-blue)] hover:underline"
            >
              GitHub →
            </a>
          )}
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--electric-blue)] hover:underline"
            >
              Demo →
            </a>
          )}
        </div>
      </div>
    );
  }

  if (node.kind === "education") {
    const e = data.education[node.index];
    return (
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs tracking-widest text-white/50">
          HOME WORLD
        </p>
        <h2 className="text-2xl font-semibold">{e.school}</h2>
        <p className="text-sm text-white/70">{e.detail}</p>
        <p className="text-sm text-white/50">{e.period}</p>
        {e.honors && (
          <Section title="Honors" items={e.honors} />
        )}
        {e.coursework && (
          <Section title="Coursework" items={e.coursework} />
        )}
      </div>
    );
  }

  if (node.kind === "experience") {
    const x = data.experience[node.index];
    return (
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-widest text-white/50">
          FLEET · MISSION LOG
        </p>
        <h2 className="text-2xl font-semibold">{x.org}</h2>
        <p className="text-sm font-medium text-[var(--soft-gold)]">{x.role}</p>
        <p className="text-sm text-white/50">
          {x.start} – {x.end}
          {x.location ? ` · ${x.location}` : ""}
        </p>
        <ul className="mt-1 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-white/70">
          {x.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (node.kind === "skills") {
    const group = SKILL_GROUPS[node.index];
    const items = data.skills[group.key as keyof SkillsData];
    return (
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs tracking-widest text-white/50">
          CONSTELLATION
        </p>
        <h2 className="text-2xl font-semibold">{group.label}</h2>
        <ul className="flex flex-wrap gap-2">
          {items.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/70"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // contact beacon
  const pf = data.profile;
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs tracking-widest text-white/50">BEACON</p>
      <h2 className="text-2xl font-semibold">Get in touch</h2>
      <p className="text-sm text-white/60">
        No form — just the fastest way to reach me.
      </p>
      <div className="flex flex-col gap-2 text-sm">
        <a
          href={`mailto:${pf.email}`}
          className="text-[var(--soft-gold)] hover:underline"
        >
          {pf.email}
        </a>
        {pf.socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--electric-blue)] hover:underline"
          >
            {s.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-widest text-white/40">
        {title}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((t) => (
          <li
            key={t}
            className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/70"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fallback() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-[var(--deep-space)] p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Universe Mode needs WebGL</h1>
        <p className="text-white/60">
          Your browser or device can&apos;t render the real-time 3D scene. The
          full portfolio is available on the fast quick view.
        </p>
        <Link
          href="/"
          className="rounded-full bg-[var(--soft-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--deep-space)]"
        >
          Go to quick view
        </Link>
      </div>
    </div>
  );
}
