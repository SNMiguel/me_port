"use client";

import { useEffect, useRef } from "react";

/**
 * Restrained animated starfield (MIGUEL_UNIVERSE_SPEC §2.1).
 * A small brand touch only — cheap canvas, no WebGL, no shaders. The cinematic
 * particle systems belong to Universe Mode, not here. Honors reduced-motion by
 * rendering a single static frame instead of animating.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let stars: { x: number; y: number; r: number; tw: number; ph: number }[] =
      [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area but stays modest — this is background, not hero.
      const count = Math.min(160, Math.round((width * height) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        tw: Math.random() * 0.5 + 0.5,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const alpha = reduceMotion
          ? s.tw
          : 0.4 + 0.6 * Math.abs(Math.sin(t / 1600 + s.ph)) * s.tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    seed();
    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      seed();
      if (reduceMotion) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
