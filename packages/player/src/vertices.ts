import type { EasingFunction } from "./types";

export const mix = (a: number, b: number, factor: number): number =>
  a * (1 - factor) + b * factor;

export const mixHue = (a: number, b: number, factor: number): number => {
  const d = Math.abs(a - b);
  let aa = a;
  let ba = b;

  if (a < b && Math.abs(a + 1 - b) < d) {
    aa += 1;
  }
  if (a > b && Math.abs(b - a + 1) < d) {
    ba += 1;
  }
  return mix(aa, ba, factor) % 1;
};

/**
 * Easing function: ease in (slow start, fast end)
 */
export const easeIn = (t: number): number => t * t;

/**
 * Easing function: ease out (fast start, slow end)
 */
export const easeOut = (t: number): number => t * (2 - t);

/**
 * Easing function: ease in-out (slow start, slow end)
 */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/**
 * Apply easing function to factor
 */
export const applyEasing = (factor: number, easing: EasingFunction): number => {
  switch (easing) {
    case "easeIn":
      return easeIn(factor);
    case "easeOut":
      return easeOut(factor);
    case "easeInOut":
      return easeInOut(factor);
    case "linear":
    default:
      return factor;
  }
};

export const interpolateFloat = (
  track: Float32Array,
  position: number,
  startValue = 0,
  mixer = mix,
  easing: EasingFunction = "linear"
): number => {
  for (let i = 0; i < track.length; i += 2) {
    if (track[i] > position) {
      const previousPos = i > 1 ? track[i - 2] : 0;
      const previousValue = i > 1 ? track[i - 1] : startValue;
      const mixFactor = (position - previousPos) / (track[i] - previousPos);
      const easedFactor = applyEasing(mixFactor, easing);
      return mixer(previousValue, track[i + 1], easedFactor);
    }
  }

  return track[track.length - 1];
};
