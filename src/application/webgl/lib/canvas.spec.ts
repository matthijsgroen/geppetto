import { Vec2 } from "../../../types";
import { getTextureCoordinate } from "./canvas";

describe("getTextureCoordinate", () => {
  it.each<{
    name: string;
    canvas: Vec2;
    texture: Vec2;
    zoom: number;
    pan: Vec2;
    coordinate: Vec2;
    expected: [number | null, number | null];
  }>([
    {
      name: "center",
      canvas: [100, 100],
      texture: [50, 30],
      zoom: 1.0,
      pan: [0, 0],
      coordinate: [50, 50],
      expected: [25, 15],
    },
    {
      name: "panning",
      canvas: [100, 100],
      texture: [50, 30],
      zoom: 1.0,
      pan: [1, 0],
      coordinate: [50, 50],
      expected: [0, 15],
    },
    {
      name: "coordinate shift",
      canvas: [100, 100],
      texture: [50, 30],
      zoom: 1.0,
      pan: [0, 0],
      coordinate: [40, 40],
      expected: [20, 10],
    },
    {
      name: "coordinate shift with zoom",
      canvas: [100, 100],
      texture: [50, 30],
      zoom: 2.0,
      pan: [0, 0],
      coordinate: [40, 40],
      expected: [23, 13],
    },
    {
      name: "coordinate shift with zoom and panning",
      canvas: [100, 100],
      texture: [50, 30],
      zoom: 2.0,
      pan: [-1, 0],
      coordinate: [40, 40],
      expected: [48, 13],
    },
  ])(
    "can translate canvas coordinates to texture coordinates ($name)",
    ({ canvas, texture, zoom, pan, coordinate, expected }) => {
      const result = getTextureCoordinate(
        canvas,
        texture,
        pan,
        zoom,
        coordinate
      );
      expect(result).toEqual(expected);
    }
  );
});
