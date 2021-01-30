import { ShapeDefinition, SpriteDefinition, Vec2 } from "../../lib/types";

export const flattenShapes = (shapes: ShapeDefinition[]): SpriteDefinition[] =>
  shapes.reduce(
    (result, shape) =>
      result.concat(
        shape.type === "sprite" ? shape : flattenShapes(shape.items)
      ),
    [] as SpriteDefinition[]
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
