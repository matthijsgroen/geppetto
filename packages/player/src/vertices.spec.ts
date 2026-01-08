import { interpolateFloat, mixHue } from "./vertices";

describe("interpolateFloat", () => {
  it.each([
    [0.5, 9],
    [0, 6],
    [1, 12],
    [2, 6],
  ])(
    "returns an interpolated float from the track (position: %s)",
    (position, result) => {
      const track = new Float32Array([0, 6, 1, 12, 3, 0]);
      expect(interpolateFloat(track, position)).toEqual(result);
    }
  );

  it("returns the last value of the track if the position is exceeding track length", () => {
    const track = new Float32Array([0, 6, 1, 12, 3, 1.5]);
    expect(interpolateFloat(track, 5)).toEqual(1.5);
  });

  it("can interpolate from a provided start value", () => {
    const track = new Float32Array([20, 6, 30, 12, 60, 1.5]);
    expect(interpolateFloat(track, 10, 0)).toEqual(3);
  });

  describe("using mixHue", () => {
    it("can interpolate from a provided start value", () => {
      // prettier-ignore
      const track = new Float32Array([
        0, 0, 1, 1, 2, 0.2, 3, 0.8, 4, 0.6, 5, 1, 6, 0.8
      ]);
      const test = (pos: number) => interpolateFloat(track, pos, 0, mixHue);

      expect(test(0)).toEqual(0);
      expect(test(0.5)).toBeCloseTo(0);
      expect(test(1.5)).toBeCloseTo(0.1);
      expect(test(2.5)).toBeCloseTo(0);
      expect(test(3.5)).toBeCloseTo(0.7);
      expect(test(4.5)).toBeCloseTo(0.8);
      expect(test(5.5)).toBeCloseTo(0.9);
    });
  });
});
