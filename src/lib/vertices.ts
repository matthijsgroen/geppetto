import Delaunator from "delaunator";
import { MutationVector, Vec2 } from "./types";

export const verticesFromPoints = (points: number[][]): number[] =>
  Delaunator.from(points).triangles.reduce(
    (result, index) => result.concat(points[index]),
    [] as number[]
  );

export const mix = (a: number, b: number, factor: number): number =>
  a * (1 - factor) + factor * b;

export const mixVec2 = (
  a: Vec2 = [0, 0],
  b: Vec2 = [0, 0],
  factor: number
): Vec2 => [mix(a[0], b[0], factor), mix(a[1], b[1], factor)] as Vec2;

export const defaultValueForVector = (type: MutationVector["type"]): Vec2 =>
  type === "stretch" ? [1, 1] : [0, 0];
