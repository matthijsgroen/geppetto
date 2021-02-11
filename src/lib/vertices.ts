import Delaunator from "delaunator";
import { Vec2 } from "./types";

export const verticesFromPoints = (points: number[][]): number[] =>
  Delaunator.from(points).triangles.reduce(
    (result, index) => result.concat(points[index]),
    [] as number[]
  );

export const merge = (a: number, b: number, mix: number): number =>
  a * (1 - mix) + mix * b;

export const mergeVec2 = (
  a: Vec2 = [0, 0],
  b: Vec2 = [0, 0],
  mix: number
): Vec2 => [merge(a[0], b[0], mix), merge(a[1], b[1], mix)] as Vec2;

export const vector2X = (x: number, vec: Vec2 = [0, 0]): Vec2 => [x, vec[1]];
export const vector2Y = (y: number, vec: Vec2 = [0, 0]): Vec2 => [vec[0], y];
export const getX = (vec: Vec2 = [0, 0]): number => vec[0];
export const getY = (vec: Vec2 = [0, 0]): number => vec[1];
