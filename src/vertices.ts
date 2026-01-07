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

export const interpolateFloat = (
  track: Float32Array,
  position: number,
  startValue = 0,
  mixer = mix
): number => {
  for (let i = 0; i < track.length; i += 2) {
    if (track[i] > position) {
      const previousPos = i > 1 ? track[i - 2] : 0;
      const previousValue = i > 1 ? track[i - 1] : startValue;
      const mix = (position - previousPos) / (track[i] - previousPos);
      return mixer(previousValue, track[i + 1], mix);
    }
  }

  return track[track.length - 1];
};
