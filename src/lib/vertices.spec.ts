import { interpolateFloat } from "./vertices";

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
