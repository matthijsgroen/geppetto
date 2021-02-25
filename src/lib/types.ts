export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export type TranslationVector = {
  name: string;
  type: "translate";
  origin: Vec2;
};

export type DeformationVector = {
  name: string;
  type: "deform";
  origin: Vec2;
  radius: number;
};

export type StretchVector = {
  name: string;
  type: "stretch";
  origin: Vec2;
};

export type RotationVector = {
  name: string;
  type: "rotate";
  origin: Vec2;
};

export type MutationVector =
  | TranslationVector
  | DeformationVector
  | StretchVector
  | RotationVector;

export type SpriteDefinition = {
  name: string;
  type: "sprite";
  points: Vec2[];
  mutationVectors: MutationVector[];
  translate: Vec2;
};

export type FolderDefinition = {
  name: string;
  type: "folder";
  mutationVectors: MutationVector[];
  items: ShapeDefinition[];
};

export type ShapeDefinition = FolderDefinition | SpriteDefinition;

export type ItemSelection = {
  name: string;
  type: "layer" | "vector" | "control";
};

export type Keyframe = Record<string, Vec2>;

export type ControlDefinition = {
  name: string;
  type: "slider";
  min: Keyframe;
  max: Keyframe;
};

export type ImageDefinition = {
  shapes: ShapeDefinition[];
  defaultFrame?: Keyframe;
  controls: ControlDefinition[];
};
