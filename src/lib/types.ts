export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export type ShapesDefinition = {
  name: string;
  points: Vec2[];
  settings: {
    parent?: { id: string; offset: Vec2 };
    anchor: Vec2;
  };
};

export type ImageDefinition = {
  shapes: ShapesDefinition[];
};
