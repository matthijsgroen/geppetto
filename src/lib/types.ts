export type ShapesDefinition = {
  name: string;
  points: [number, number][];
};
export type ImageDefinition = {
  shapes: ShapesDefinition[];
};
