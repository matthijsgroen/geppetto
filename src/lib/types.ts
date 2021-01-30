export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export type ElementData = {
  deformations?: {
    [key: string]: Vec2;
  };
  stretchX?: number;
  stretchY?: number;
  translateX?: number;
  translateY?: number;
};

export type SpriteDefinition = {
  name: string;
  type: "sprite";
  points: Vec2[];
  // anchor: Vec2;
  mutationVectors?: {
    [key: string]: Vec3;
  };
  baseElementData: ElementData;
};

export type FolderDefinition = {
  name: string;
  type: "folder";
  items: ShapeDefinition[];
};

export type ShapeDefinition = FolderDefinition | SpriteDefinition;

export type Keyframe = {
  [element: string]: ElementData;
};

export type ControlDefinition = {
  name: string;
  type: "slider";
  min: Keyframe;
  max: Keyframe;
};

export type ImageDefinition = {
  shapes: ShapeDefinition[];
  controls: ControlDefinition[];
};
