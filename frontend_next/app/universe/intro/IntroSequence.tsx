"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Intro Scene + Hyperspace dive (MIGUEL_UNIVERSE_SPEC §7–§8).
 * Boot text → live particle galaxy forming → title → click to dive in.
 * The "hands forming a galaxy" hero moment is built entirely from a live
 * particle system (no character rigging). The afro logo mark stands in for the
 * illustrated character until the real art asset exists (spec §5 — TODO).
 *
 * Calls onEnter() once the dive completes (or immediately on skip / reduced
 * motion). Nobody is ever trapped — a Skip control is always visible.
 */

type Phase = "boot" | "form" | "idle" | "diving";

const BOOT_LINES = [
  "Initializing Universe...",
  "Generating Stars...",
  "Rendering Miguel...",
  "Ready.",
];

export default function IntroSequence({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [bootLine, setBootLine] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(rm);
  }, []);

  // Boot text reveal, then advance to the forming galaxy.
  useEffect(() => {
    if (phase !== "boot") return;
    if (bootLine < BOOT_LINES.length) {
      const t = setTimeout(() => setBootLine((n) => n + 1), reduceMotion ? 120 : 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("form"), reduceMotion ? 100 : 500);
    return () => clearTimeout(t);
  }, [phase, bootLine, reduceMotion]);

  // Forming → idle (invitation).
  useEffect(() => {
    if (phase !== "form") return;
    const t = setTimeout(() => setPhase("idle"), reduceMotion ? 100 : 4200);
    return () => clearTimeout(t);
  }, [phase, reduceMotion]);

  const beginDive = () => {
    if (phase === "diving") return;
    if (reduceMotion) {
      onEnter();
      return;
    }
    setPhase("diving");
  };

  return (
    <div className="fixed inset-0 bg-[var(--deep-space)]">
      <Canvas camera={{ position: [0, 0, 11], fov: 55 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <Stars radius={80} depth={50} count={2500} factor={3} fade speed={0.3} />
        <Galaxy
          phase={phase}
          reduceMotion={reduceMotion}
          onClick={beginDive}
          onDiveDone={onEnter}
        />
      </Canvas>

      {/* ---- DOM overlay ---- */}
      {/* Boot terminal text */}
      {phase === "boot" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <pre className="font-mono text-sm leading-relaxed text-[var(--electric-blue)]">
            {BOOT_LINES.slice(0, bootLine).map((l, i) => (
              <div key={i}>
                {l}
                {i === bootLine - 1 && (
                  <span className="text-[var(--soft-gold)]"> ▍</span>
                )}
              </div>
            ))}
          </pre>
        </div>
      )}

      {/* Placeholder character mark (real illustrated asset is a TODO, spec §5) */}
      {(phase === "form" || phase === "idle") && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[12%] flex justify-center opacity-80">
          <AfroMark />
        </div>
      )}

      {/* Title + invitation */}
      {phase === "idle" && (
        <div className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center gap-3 px-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Welcome to My Universe
          </h1>
          <p className="max-w-xl text-sm text-white/60 sm:text-base">
            Every engineer builds software. I built a universe.
          </p>
          <button
            onClick={beginDive}
            className="pointer-events-auto mt-3 animate-pulse rounded-full border border-[var(--soft-gold)]/60 px-5 py-2.5 text-sm font-medium text-[var(--soft-gold)] transition-colors hover:bg-[var(--soft-gold)] hover:text-[var(--deep-space)]"
          >
            Click the galaxy to enter →
          </button>
        </div>
      )}

      {/* Always-available skip (never trap the visitor, spec §2.2) */}
      {phase !== "diving" && (
        <button
          onClick={onEnter}
          className="absolute bottom-5 right-5 rounded-full border border-white/15 bg-[var(--deep-space)]/70 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
        >
          Skip intro →
        </button>
      )}
    </div>
  );
}

function Galaxy({
  phase,
  reduceMotion,
  onClick,
  onDiveDone,
}: {
  phase: Phase;
  reduceMotion: boolean;
  onClick: () => void;
  onDiveDone: () => void;
}) {
  const points = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const formT = useRef(0);
  const diveT = useRef(0);
  const COUNT = 1800;

  // Precompute scattered start + spiral-galaxy target positions.
  const { starts, targets, colors } = useMemo(() => {
    const starts = new Float32Array(COUNT * 3);
    const targets = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const palette = [
      new THREE.Color("#4f8cff"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#f5c451"),
      new THREE.Color("#ffffff"),
    ];
    const arms = 3;
    for (let i = 0; i < COUNT; i++) {
      // start: random sphere shell
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      const r0 = 6 + Math.random() * 4;
      starts.set([dir.x * r0, dir.y * r0, dir.z * r0], i * 3);

      // target: spiral galaxy
      const t = i / COUNT;
      const radius = Math.pow(t, 0.5) * 4.2;
      const arm = (i % arms) / arms;
      const angle = radius * 1.6 + arm * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * 0.5;
      targets.set(
        [
          Math.cos(angle) * radius + jitter,
          (Math.random() - 0.5) * 0.6 * (1 - t),
          Math.sin(angle) * radius + jitter,
        ],
        i * 3
      );

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { starts, targets, colors };
  }, []);

  // Live position buffer we mutate each frame.
  const positions = useMemo(() => Float32Array.from(starts), [starts]);

  useFrame((_, dt) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array as Float32Array;

    if (phase === "form" || phase === "idle") {
      formT.current = Math.min(1, formT.current + dt / (reduceMotion ? 0.001 : 4));
      const e = easeOutCubic(formT.current);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = starts[i] + (targets[i] - starts[i]) * e;
      }
      geo.attributes.position.needsUpdate = true;
      if (points.current) points.current.rotation.y += dt * 0.05;
    }

    if (phase === "diving") {
      diveT.current = Math.min(1, diveT.current + dt / 1.8);
      const d = diveT.current;
      // Camera dives through the galaxy core.
      camera.position.z = 11 - d * 13;
      // Stretch particles outward (star-streak feel).
      for (let i = 0; i < COUNT; i++) {
        const k = 1 + d * 6;
        arr[i * 3] = targets[i * 3] * k;
        arr[i * 3 + 1] = targets[i * 3 + 1] * k;
        arr[i * 3 + 2] = targets[i * 3 + 2] + d * 4;
      }
      geo.attributes.position.needsUpdate = true;
      if (points.current) points.current.rotation.y += dt * 0.6;
      if (d >= 1) onDiveDone();
    }
  });

  return (
    <points
      ref={points}
      onClick={(e) => {
        e.stopPropagation();
        if (phase === "idle") onClick();
      }}
      onPointerOver={() => {
        if (phase === "idle") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function AfroMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="13" r="9" fill="var(--purple-nebula)" opacity="0.9" />
      <circle cx="16" cy="20" r="5" fill="var(--deep-space-2)" />
      <circle cx="16" cy="19" r="3.2" fill="var(--electric-blue)" />
    </svg>
  );
}
