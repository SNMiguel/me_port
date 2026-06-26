import { Effect, EffectAttribute } from "postprocessing";
import { Uniform, Color } from "three";

/**
 * Unified comic / Spider-Verse treatment (MIGUEL_UNIVERSE_SPEC §5.1) as a
 * single screen-space post pass — not per-object materials. Three independently
 * toggleable effects:
 *   1. Ink-line edges  — Sobel edge detection, drawn in deep-space color.
 *   2. Halftone dots   — screen-space dot pattern, denser in shadow.
 *   3. Color separation — RGB channel offset, intended to be driven only by
 *      camera motion (uColorSep set to ~0 at rest by the host component).
 *
 * Each strength is a uniform so the performance fallback (§19) can dial any of
 * them to 0 independently.
 */
const fragment = /* glsl */ `
uniform float uHalftone;
uniform float uInkLine;
uniform float uColorSep;
uniform float uDotSize;
uniform vec3  uDeepSpace;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 dir = uv - 0.5;
  vec3 col;

  // 3. Color separation — only meaningful while uColorSep > 0 (motion).
  if (uColorSep > 0.0001) {
    float amt = uColorSep * 0.004;
    col.r = texture(inputBuffer, uv - dir * amt).r;
    col.g = inputColor.g;
    col.b = texture(inputBuffer, uv + dir * amt).b;
  } else {
    col = inputColor.rgb;
  }

  // 1. Ink-line edges (Sobel on luminance of the scene buffer).
  if (uInkLine > 0.0001) {
    vec2 t = texelSize;
    float l00 = luma(texture(inputBuffer, uv + vec2(-t.x, -t.y)).rgb);
    float l01 = luma(texture(inputBuffer, uv + vec2( 0.0, -t.y)).rgb);
    float l02 = luma(texture(inputBuffer, uv + vec2( t.x, -t.y)).rgb);
    float l10 = luma(texture(inputBuffer, uv + vec2(-t.x,  0.0)).rgb);
    float l12 = luma(texture(inputBuffer, uv + vec2( t.x,  0.0)).rgb);
    float l20 = luma(texture(inputBuffer, uv + vec2(-t.x,  t.y)).rgb);
    float l21 = luma(texture(inputBuffer, uv + vec2( 0.0,  t.y)).rgb);
    float l22 = luma(texture(inputBuffer, uv + vec2( t.x,  t.y)).rgb);
    float gx = -l00 - 2.0 * l10 - l20 + l02 + 2.0 * l12 + l22;
    float gy = -l00 - 2.0 * l01 - l02 + l20 + 2.0 * l21 + l22;
    float edge = sqrt(gx * gx + gy * gy);
    float line = smoothstep(0.25, 0.7, edge) * uInkLine;
    col = mix(col, uDeepSpace, line);
  }

  // 2. Halftone dots — subtle, larger dots in darker regions.
  if (uHalftone > 0.0001) {
    vec2 res = 1.0 / texelSize;
    float l = luma(col);
    vec2 g = uv * res / max(uDotSize, 2.0);
    float d = length(fract(g) - 0.5);
    float radius = mix(0.06, 0.5, 1.0 - l);
    float dotMask = smoothstep(radius, radius - 0.08, d);
    col = mix(col, col * 0.78, dotMask * uHalftone);
  }

  outputColor = vec4(col, inputColor.a);
}
`;

export interface ComicEffectOptions {
  halftone?: number;
  inkLine?: number;
  colorSep?: number;
  dotSize?: number;
  deepSpace?: string;
}

export class ComicEffectImpl extends Effect {
  constructor({
    halftone = 0.35,
    inkLine = 0.8,
    colorSep = 0.0,
    dotSize = 4.0,
    deepSpace = "#060812",
  }: ComicEffectOptions = {}) {
    super("ComicEffect", fragment, {
      // This effect samples neighbouring pixels (Sobel edges + chromatic
      // offset), so it must be flagged as a convolution effect — otherwise
      // postprocessing's merged shader leaves inputBuffer undefined and throws.
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, Uniform<number | Color>>([
        ["uHalftone", new Uniform(halftone)],
        ["uInkLine", new Uniform(inkLine)],
        ["uColorSep", new Uniform(colorSep)],
        ["uDotSize", new Uniform(dotSize)],
        ["uDeepSpace", new Uniform(new Color(deepSpace))],
      ]),
    });
  }
}
