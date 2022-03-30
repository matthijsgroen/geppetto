import { Vec2 } from "../../../application/types";
import {
  ShapeDefinition,
  SpriteDefinition,
} from "../../../application/animation/file1-types";

export const flattenShapes = (shapes: ShapeDefinition[]): SpriteDefinition[] =>
  flattenTree(shapes).filter(
    (shape) => shape.type === "sprite"
  ) as SpriteDefinition[];

export const flattenTree = (shapes: ShapeDefinition[]): ShapeDefinition[] =>
  shapes.reduce(
    (result, shape) =>
      result.concat(
        shape,
        shape.type === "sprite" ? [] : flattenShapes(shape.items)
      ),
    [] as ShapeDefinition[]
  );

export const getAnchor = (sprite: SpriteDefinition): Vec2 => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  sprite.points.forEach(([x, y]) => {
    minX = x < minX ? x : minX;
    maxX = x > maxX ? x : maxX;
    minY = y < minY ? y : minY;
    maxY = y > maxY ? y : maxY;
  });

  return [(minX + maxX) / 2, (minY + maxY) / 2];
};
