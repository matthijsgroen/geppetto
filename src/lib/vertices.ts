import Delaunator from "delaunator";

export const verticesFromPoints = (points: number[][]): number[] =>
  Delaunator.from(points).triangles.reduce(
    (result, index) => result.concat(points[index]),
    [] as number[]
  );
