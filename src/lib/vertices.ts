import Delaunator from "delaunator";
import { Keyframe, MutationVector, Vec2, Vec3, Vec4 } from "./types";

export const verticesFromPoints = (points: number[][]): number[] =>
  fileredTriangles(points).reduce(
    (result, index) => result.concat(points[index]),
    [] as number[]
  );

export const fileredTriangles = (points: number[][]): number[] =>
  Delaunator.from(points).triangles;

export const mix = (a: number, b: number, factor: number): number =>
  a * (1 - factor) + factor * b;

export const mixVec2 = (
  a: Vec2 = [0, 0],
  b: Vec2 = [0, 0],
  factor: number
): Vec2 => [mix(a[0], b[0], factor), mix(a[1], b[1], factor)] as Vec2;

export const defaultValueForVector = (type: MutationVector["type"]): Vec2 =>
  type === "stretch" || type === "opacity" ? [1, 1] : [0, 0];

export const vecAdd = (a: Vec2 = [0, 0], b: Vec2 = [0, 0]): Vec2 => [
  a[0] + b[0],
  a[1] + b[1],
];

export const vecMul = (a: Vec2 = [1, 1], b: Vec2 = [1, 1]): Vec2 => [
  a[0] * b[0],
  a[1] * b[1],
];

export const mergeMutationValue = (
  a: Vec2 | undefined,
  b: Vec2 | undefined,
  type: MutationVector["type"]
): Vec2 =>
  type === "stretch" || type === "opacity" ? vecMul(a, b) : vecAdd(a, b);

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

export const flatten = (vectors: Vec2[] | Vec3[] | Vec4[]): number[] =>
  ((vectors as unknown) as number[][]).reduce<number[]>(
    (result, vec) => result.concat(vec),
    []
  );

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
