declare module "delaunator" {
  export function from(
    points: number[][]
  ): {
    triangles: number[];
  };
}
