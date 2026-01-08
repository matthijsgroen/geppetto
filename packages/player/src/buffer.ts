import type { Vec2, Vec3, Vec4, PreparedFloatBuffer } from "./types";

export const flatten = (vectors: Vec2[] | Vec3[] | Vec4[]): number[] =>
  ((vectors as unknown) as number[][]).reduce<number[]>(
    (result, vec) => result.concat(vec),
    []
  );

export type { PreparedFloatBuffer, PreparedIntBuffer } from "./types";

export const vectorArrayToPreparedFloatBuffer = (
  array: Vec2[] | Vec3[] | Vec4[]
): PreparedFloatBuffer => ({
  data: new Float32Array(flatten(array)),
  length: array.length,
  stride: array[0] === undefined ? 0 : array[0].length,
});
