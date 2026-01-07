import { Vec2, Vec3, Vec4 } from "src/types";

export const flatten = (vectors: Vec2[] | Vec3[] | Vec4[]): number[] =>
  ((vectors as unknown) as number[][]).reduce<number[]>(
    (result, vec) => result.concat(vec),
    []
  );

export type PreparedFloatBuffer = {
  data: Float32Array;
  length: number;
  stride: number;
};

export type PreparedIntBuffer = {
  data: Int32Array;
  length: number;
  stride: number;
};

export const vectorArrayToPreparedFloatBuffer = (
  array: Vec2[] | Vec3[] | Vec4[]
): PreparedFloatBuffer => ({
  data: new Float32Array(flatten(array)),
  length: array.length,
  stride: array[0] === undefined ? 0 : array[0].length,
});
