// - Make a doll (define lots and lots of sliders and toggles, sliders should be able to have multiple stops)
//
// - Create layout of elements (hierarchy)
// - Use sliders as modifiers
// - Define sprites based on one or multiple texture maps

export type TextureMap = {
  [key: string]: { x: number; y: number; w: number; h: number };
};

export const characterTextureMap: TextureMap = {
  head: { x: 100, y: 200, w: 100, h: 100 },
  leftEye: { x: 100, y: 200, w: 100, h: 100 },
  rightEye: { x: 100, y: 200, w: 100, h: 100 },
  leftPupil: { x: 100, y: 200, w: 100, h: 100 },
  rightPupil: { x: 100, y: 200, w: 100, h: 100 },
  leftBrow: { x: 100, y: 200, w: 100, h: 100 },
  rightBrow: { x: 100, y: 200, w: 100, h: 100 },
};

type RenderElement = {
  sprite: string;
  id: number;
  x: number;
  y: number;
  z: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  saturation?: number;
  hue?: number;
  brightness?: number;
  parentId?: number;
  // render shape?
  // shape deformation?
};
export type Composition = RenderElement[];

// Composition:

// const composition: Composition = [{}];
