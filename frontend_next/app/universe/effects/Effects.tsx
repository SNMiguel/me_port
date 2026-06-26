"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, wrapEffect } from "@react-three/postprocessing";
import { Vector3 } from "three";
import { ComicEffectImpl } from "./ComicEffect";

const ComicEffect = wrapEffect(ComicEffectImpl);

/**
 * Post-processing composer (spec §17 + §5.1).
 *
 * The comic effect is a *convolution* effect (it samples neighbouring pixels),
 * and postprocessing forbids merging a convolution effect with others in a
 * single pass — and drei's EffectComposer merges all its children. So we don't
 * mix Bloom and the comic layer in one composer:
 *   - comic ON  → the comic pass (edges + halftone + motion color-separation).
 *                 In-scene halo meshes already provide the glow.
 *   - comic OFF → a subtle bloom pass only (plain look, §17).
 *
 * Color separation is driven by camera speed, so it only appears during motion
 * and sits at 0 at rest (a constant offset would read as a rendering bug).
 */
export default function Effects({
  comic,
  reduceMotion,
}: {
  comic: boolean;
  reduceMotion: boolean;
}) {
  const ref = useRef<ComicEffectImpl | null>(null);
  const { camera } = useThree();
  const prev = useRef(new Vector3());

  useFrame(() => {
    const eff = ref.current;
    if (!eff) return;
    const speed = camera.position.distanceTo(prev.current);
    prev.current.copy(camera.position);
    const u = eff.uniforms.get("uColorSep");
    if (u) {
      const target = reduceMotion ? 0 : Math.min(speed * 9, 1);
      u.value += (target - (u.value as number)) * 0.25;
    }
  });

  if (!comic) {
    return (
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer>
      <ComicEffect
        ref={ref}
        halftone={0.32}
        inkLine={0.8}
        colorSep={0}
        dotSize={4}
        deepSpace="#060812"
      />
    </EffectComposer>
  );
}
