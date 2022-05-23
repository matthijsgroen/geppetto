import Delaunator from "delaunator";
import { Vec2, Vec3, Vec4 } from "../../../types";
import { Keyframe, MutationVector } from "../../../animation/file1/types";

export const verticesFromPoints = (points: number[][]): number[] =>
  filteredTriangles(points).reduce(
    (result, index) => result.concat(points[index]),
    [] as number[]
  );

export const filteredTriangles = (points: number[][]): number[] =>
  Delaunator.from(points).triangles;

export const mix = (a: number, b: number, factor: number): number =>
  a * (1 - factor) + factor * b;

const circularDistance = (a: number, b: number): [number, number] => {
  const d = Math.abs(a - b);
  let aa = a;
  let ba = b;

  if (a < b && Math.abs(a + 1 - b) < d) {
    aa += 1;
  }
  if (a > b && Math.abs(b - a + 1) < d) {
    ba += 1;
  }
  return [aa, ba];
};

const mixHue = (a: number, b: number, factor: number): number => {
  const [aa, ba] = circularDistance(a, b);
  return mix(aa, ba, factor) % 1.0;
};

export const mixVec2 = (
  a: Vec2 = [0, 0],
  b: Vec2 = [0, 0],
  factor: number
): Vec2 => [mix(a[0], b[0], factor), mix(a[1], b[1], factor)] as Vec2;

export const mixHueVec2 = (
  a: Vec2 = [0, 0],
  b: Vec2 = [0, 0],
  factor: number
): Vec2 => [mixHue(a[0], b[0], factor), mix(a[1], b[1], factor)] as Vec2;

export const defaultValueForVector = (type: MutationVector["type"]): Vec2 =>
  type === "stretch" ||
  type === "opacity" ||
  type === "lightness" ||
  type === "saturation"
    ? [1, 1]
    : [0, 0];

export const vecAdd = (a: Vec2 = [0, 0], b: Vec2 = [0, 0]): Vec2 => [
  a[0] + b[0],
  a[1] + b[1],
];

export const vecSub = (a: Vec2 = [0, 0], b: Vec2 = [0, 0]): Vec2 => [
  a[0] - b[0],
  a[1] - b[1],
];

export const vecMul = (a: Vec2 = [1, 1], b: Vec2 = [1, 1]): Vec2 => [
  a[0] * b[0],
  a[1] * b[1],
];

export const vecScale = (a: Vec2 = [1, 1], b: number): Vec2 =>
  vecMul(a, [b, b]);

export const distance = (a: Vec2, b: Vec2): number =>
  Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));

export const mergeMutationValue = (
  a: Vec2 | undefined,
  b: Vec2 | undefined,
  type: MutationVector["type"]
): Vec2 =>
  type === "lightness" ||
  type === "stretch" ||
  type === "opacity" ||
  type === "saturation"
    ? vecMul(a, b)
    : type === "colorize"
    ? a || b || [0, 0]
    : vecAdd(a, b);

export const combineKeyFrames = (
  a: Keyframe,
  b: Keyframe,
  mutatorMapping: Record<string, MutationVector>
): Keyframe =>
  Object.entries(a).reduce<Keyframe>(
    (result, [key, value]) => ({
      ...result,
      [key]: mergeMutationValue(result[key], value, mutatorMapping[key].type),
    }),
    b
  );

export const flatten = (vectors: Vec2[] | Vec3[] | Vec4[]): number[] => {
  const result: number[] = [];
  for (const vector of vectors as unknown as number[][]) {
    result.push(...vector);
  }
  return result;
};

export const interpolateFloat = (
  track: Float32Array,
  position: number,
  startValue = 0
): number => {
  for (let i = 0; i < track.length; i += 2) {
    if (track[i] > position) {
      const previousPos = i > 1 ? track[i - 2] : 0;
      const previousValue = i > 1 ? track[i - 1] : startValue;
      const mix = (position - previousPos) / (track[i] - previousPos);
      return previousValue * (1 - mix) + track[i + 1] * mix;
    }
  }

  return track[track.length - 1];
};
