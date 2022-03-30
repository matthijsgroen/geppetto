import { Vec2 } from "geppetto-player";
import { interpolateFloat, mixVec2, mixHueVec2 } from "./vertices";

describe("interpolateFloat", () => {
  it.each([
    [0.5, 9],
    [0, 6],
    [1, 12],
    [2, 6],
  ])("returns an interpolated float from the track", (position, result) => {
    const track = new Float32Array([0, 6, 1, 12, 3, 0]);
    expect(interpolateFloat(track, position)).toEqual(result);
  });

  it("returns the last value of the track if the position is exceeding track length", () => {
    const track = new Float32Array([0, 6, 1, 12, 3, 1.5]);
    expect(interpolateFloat(track, 5)).toEqual(1.5);
  });

  it("can interpolate from a provided start value", () => {
    const track = new Float32Array([20, 6, 30, 12, 60, 1.5]);
    expect(interpolateFloat(track, 10, 0)).toEqual(3);
  });
});

describe("mixVec2", () => {
  it.each<[Vec2 | undefined, Vec2 | undefined, number, Vec2]>([
    [[1, 1], [0, 0], 0.5, [0.5, 0.5]],
    [[0, 0], [0.5, 0.5], 0.5, [0.25, 0.25]],
    [[1, 1], [0, 0], 0.25, [0.75, 0.75]],
    [[1, 1], undefined, 0.25, [0.75, 0.75]],
    [undefined, undefined, 0.25, [0.0, 0.0]],
  ])(
    "mixes vector value %s and %s with %s => %s",
    (vec1, vec2, mix, expected) => {
      const result = mixVec2(vec1, vec2, mix);
      expect(result).toEqual(expected);
    }
  );
});

describe("mixHueVec2", () => {
  it.each<[Vec2, Vec2, number, Vec2]>([
    [[1, 1], [0, 0], 0.5, [0, 0.5]],
    [[1, 1], [0.2, 0], 0.5, [0.1, 0.5]],
    [[1, 1], [0.2, 0], 1.0, [0.2, 0]],

    [[0, 1], [0.8, 0], 0.5, [0.9, 0.5]],
    [[0, 1], [0.3, 0], 0.5, [0.15, 0.5]],

    [[0.6, 1], [1, 0], 0.5, [0.8, 0.5]],
    [[0.6, 1], [0, 0], 0.5, [0.8, 0.5]],
  ])(
    "mixes vector value %s and %s with %s => %s",
    (vec1, vec2, mix, expected) => {
      const result = mixHueVec2(vec1, vec2, mix);
      expect(result[0]).toBeCloseTo(expected[0], 0.0001);
      expect(result[1]).toBeCloseTo(expected[1], 0.0001);
    }
  );
});
