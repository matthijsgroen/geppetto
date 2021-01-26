export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export type ShapesDefinition = {
  name: string;
  points: Vec2[];
  settings: {
    parent?: { id: string; offset: Vec2 };
    anchor: Vec2;
  };
  mutationVectors?: {
    [key: string]: Vec3;
  };
};

export type Keyframe = {
  [element: string]: {
    deformations: {
      [key: string]: Vec2;
    };
  };
};

export type ControlDefinition = {
  name: string;
  type: "slider";
  min: Keyframe;
  max: Keyframe;
};

export type ImageDefinition = {
  shapes: ShapesDefinition[];
  controls: ControlDefinition[];
};
