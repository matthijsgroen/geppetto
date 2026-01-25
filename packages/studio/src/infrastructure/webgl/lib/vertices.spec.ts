import { describe, expect, it } from "vitest";

import type { Keyframe, MutationVector } from "@/dtos/animation-file1.dto";

import {
  combineKeyFrames,
  defaultValueForVector,
  distance,
  filteredTriangles,
  flatten,
  interpolateFloat,
  mergeMutationValue,
  mix,
  mixHueVec2,
  mixVec2,
  vecAdd,
  vecMul,
  vecScale,
  vecSub,
  verticesFromPoints,
} from "./vertices";

describe("vertices", () => {
  describe("verticesFromPoints", () => {
    it("returns flattened triangle vertices from points", () => {
      const points = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const result = verticesFromPoints(points);
      // Result should be flattened coordinates (Delaunator returns [0, 2, 1])
      expect(result).toHaveLength(6);
      expect(result).toEqual([0, 0, 0, 1, 1, 0]);
    });

    it("handles quad (4 points)", () => {
      const points = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ];
      const result = verticesFromPoints(points);
      // Quad is triangulated into 2 triangles (6 vertices = 12 numbers)
      expect(result).toHaveLength(12);
    });
  });

  describe("filteredTriangles", () => {
    it("returns triangle indices using Delaunator", () => {
      const points = [
        [0, 0],
        [1, 0],
        [0, 1],
      ];
      const indices = filteredTriangles(points);
      expect(indices).toHaveLength(3);
      // Delaunator returns indices as Uint32Array in CCW order
      expect(Array.from(indices)).toEqual([0, 2, 1]);
    });
  });

  describe("mix", () => {
    it("interpolates at factor 0", () => {
      expect(mix(0, 10, 0)).toBe(0);
    });

    it("interpolates at factor 1", () => {
      expect(mix(0, 10, 1)).toBe(10);
    });

    it("interpolates at factor 0.5", () => {
      expect(mix(0, 10, 0.5)).toBe(5);
    });

    it("interpolates at factor 0.25", () => {
      expect(mix(0, 100, 0.25)).toBe(25);
    });

    it("works with negative numbers", () => {
      expect(mix(-10, 10, 0.5)).toBe(0);
    });
  });

  describe("mixVec2", () => {
    it("interpolates Vec2 at factor 0", () => {
      expect(mixVec2([0, 0], [10, 10], 0)).toEqual([0, 0]);
    });

    it("interpolates Vec2 at factor 1", () => {
      expect(mixVec2([0, 0], [10, 10], 1)).toEqual([10, 10]);
    });

    it("interpolates Vec2 at factor 0.5", () => {
      expect(mixVec2([0, 0], [10, 10], 0.5)).toEqual([5, 5]);
    });

    it("uses default values when undefined", () => {
      expect(mixVec2(undefined, [10, 10], 0.5)).toEqual([5, 5]);
      expect(mixVec2([10, 10], undefined, 0.5)).toEqual([5, 5]);
    });

    it("handles different x and y values", () => {
      expect(mixVec2([0, 10], [20, 30], 0.5)).toEqual([10, 20]);
    });
  });

  describe("mixHueVec2", () => {
    it("interpolates hue circularly for values close to 0/1 boundary", () => {
      // Going from 0.9 to 0.1 should wrap around through 1.0/0.0
      const result = mixHueVec2([0.9, 0], [0.1, 1], 0.5);
      expect(result[0]).toBeCloseTo(0, 1); // Hue wraps to ~0
      expect(result[1]).toBe(0.5); // Second component interpolates normally
    });

    it("interpolates hue normally when not crossing boundary", () => {
      const result = mixHueVec2([0.2, 0], [0.4, 1], 0.5);
      expect(result[0]).toBeCloseTo(0.3, 1);
      expect(result[1]).toBe(0.5);
    });

    it("handles reverse direction (0.1 to 0.9) wrapping around", () => {
      // 0.1 to 0.9 going backwards (through 0) is shorter
      const result = mixHueVec2([0.1, 0], [0.9, 1], 0.5);
      // Wraps around: 0.1 -> 0.05 -> 0.0 -> 0.95 -> 0.9 (shorter path)
      expect(result[0]).toBeCloseTo(0, 1);
      expect(result[1]).toBe(0.5);
    });
  });

  describe("defaultValueForVector", () => {
    it("returns [1, 1] for stretch", () => {
      expect(defaultValueForVector("stretch")).toEqual([1, 1]);
    });

    it("returns [1, 1] for opacity", () => {
      expect(defaultValueForVector("opacity")).toEqual([1, 1]);
    });

    it("returns [1, 1] for lightness", () => {
      expect(defaultValueForVector("lightness")).toEqual([1, 1]);
    });

    it("returns [1, 1] for saturation", () => {
      expect(defaultValueForVector("saturation")).toEqual([1, 1]);
    });

    it("returns [0, 0] for translate", () => {
      expect(defaultValueForVector("translate")).toEqual([0, 0]);
    });

    it("returns [0, 0] for rotate", () => {
      expect(defaultValueForVector("rotate")).toEqual([0, 0]);
    });

    it("returns [0, 0] for deform", () => {
      expect(defaultValueForVector("deform")).toEqual([0, 0]);
    });
  });

  describe("vecAdd", () => {
    it("adds two Vec2", () => {
      expect(vecAdd([1, 2], [3, 4])).toEqual([4, 6]);
    });

    it("handles negative values", () => {
      expect(vecAdd([5, -3], [-2, 7])).toEqual([3, 4]);
    });

    it("uses defaults when undefined", () => {
      expect(vecAdd(undefined, [3, 4])).toEqual([3, 4]);
      expect(vecAdd([1, 2], undefined)).toEqual([1, 2]);
      expect(vecAdd(undefined, undefined)).toEqual([0, 0]);
    });
  });

  describe("vecSub", () => {
    it("subtracts two Vec2", () => {
      expect(vecSub([5, 7], [2, 3])).toEqual([3, 4]);
    });

    it("handles negative results", () => {
      expect(vecSub([1, 2], [3, 4])).toEqual([-2, -2]);
    });

    it("uses defaults when undefined", () => {
      expect(vecSub(undefined, [3, 4])).toEqual([-3, -4]);
      expect(vecSub([5, 7], undefined)).toEqual([5, 7]);
    });
  });

  describe("vecMul", () => {
    it("multiplies two Vec2", () => {
      expect(vecMul([2, 3], [4, 5])).toEqual([8, 15]);
    });

    it("handles zero", () => {
      expect(vecMul([5, 10], [0, 1])).toEqual([0, 10]);
    });

    it("uses defaults when undefined", () => {
      expect(vecMul(undefined, [2, 3])).toEqual([2, 3]);
      expect(vecMul([2, 3], undefined)).toEqual([2, 3]);
    });
  });

  describe("vecScale", () => {
    it("scales a Vec2 by a scalar", () => {
      expect(vecScale([2, 3], 2)).toEqual([4, 6]);
    });

    it("scales by 0", () => {
      expect(vecScale([10, 20], 0)).toEqual([0, 0]);
    });

    it("scales by negative", () => {
      expect(vecScale([5, -3], -2)).toEqual([-10, 6]);
    });

    it("uses defaults when undefined", () => {
      expect(vecScale(undefined, 2)).toEqual([2, 2]);
    });
  });

  describe("distance", () => {
    it("calculates Euclidean distance", () => {
      expect(distance([0, 0], [3, 4])).toBe(5);
    });

    it("handles zero distance", () => {
      expect(distance([5, 5], [5, 5])).toBe(0);
    });

    it("handles negative coordinates", () => {
      expect(distance([-1, -1], [2, 3])).toBeCloseTo(5, 5);
    });

    it("calculates distance for identical points", () => {
      expect(distance([10, 20], [10, 20])).toBe(0);
    });
  });

  describe("mergeMutationValue", () => {
    it("multiplies for lightness type", () => {
      expect(mergeMutationValue([2, 3], [4, 5], "lightness")).toEqual([8, 15]);
    });

    it("multiplies for stretch type", () => {
      expect(mergeMutationValue([2, 3], [4, 5], "stretch")).toEqual([8, 15]);
    });

    it("multiplies for opacity type", () => {
      expect(mergeMutationValue([1.5, 2], [2, 0.5], "opacity")).toEqual([3, 1]);
    });

    it("multiplies for saturation type", () => {
      expect(mergeMutationValue([2, 3], [4, 5], "saturation")).toEqual([8, 15]);
    });

    it("returns first value for colorize when both defined", () => {
      expect(mergeMutationValue([1, 2], [3, 4], "colorize")).toEqual([1, 2]);
    });

    it("returns second value for colorize when first undefined", () => {
      expect(mergeMutationValue(undefined, [3, 4], "colorize")).toEqual([3, 4]);
    });

    it("returns default [0, 0] for colorize when both undefined", () => {
      expect(mergeMutationValue(undefined, undefined, "colorize")).toEqual([
        0, 0,
      ]);
    });

    it("adds for translate type", () => {
      expect(mergeMutationValue([1, 2], [3, 4], "translate")).toEqual([4, 6]);
    });

    it("adds for rotate type", () => {
      expect(mergeMutationValue([0.5, 0], [0.3, 0], "rotate")).toEqual([
        0.8, 0,
      ]);
    });

    it("adds for deform type", () => {
      expect(mergeMutationValue([10, 20], [5, -10], "deform")).toEqual([
        15, 10,
      ]);
    });

    it("handles undefined values for additive types", () => {
      expect(mergeMutationValue(undefined, [3, 4], "translate")).toEqual([
        3, 4,
      ]);
      expect(mergeMutationValue([1, 2], undefined, "translate")).toEqual([
        1, 2,
      ]);
    });
  });

  describe("combineKeyFrames", () => {
    it("merges keyframes using mutator mapping", () => {
      const a: Keyframe = { foo: [1, 2], bar: [3, 4] };
      const b: Keyframe = { foo: [5, 6], bar: [7, 8] };
      const mutatorMapping: Record<string, MutationVector> = {
        foo: { type: "stretch" } as MutationVector,
        bar: { type: "translate" } as MutationVector,
      };

      const result = combineKeyFrames(a, b, mutatorMapping);

      expect(result).toEqual({
        foo: [5, 12], // [5, 6] * [1, 2] (multiplicative for stretch)
        bar: [10, 12], // [7, 8] + [3, 4] (additive for translate)
      });
    });

    it("preserves b values when a doesn't have the key", () => {
      const a: Keyframe = { foo: [1, 2] };
      const b: Keyframe = { foo: [5, 6], bar: [7, 8] };
      const mutatorMapping: Record<string, MutationVector> = {
        foo: { type: "stretch" } as MutationVector,
        bar: { type: "translate" } as MutationVector,
      };

      const result = combineKeyFrames(a, b, mutatorMapping);

      expect(result).toEqual({
        foo: [5, 12],
        bar: [7, 8], // bar from b is preserved
      });
    });

    it("handles opacity mutations", () => {
      const a: Keyframe = { alpha: [0.5, 1] };
      const b: Keyframe = { alpha: [0.8, 1] };
      const mutatorMapping: Record<string, MutationVector> = {
        alpha: { type: "opacity" } as MutationVector,
      };

      const result = combineKeyFrames(a, b, mutatorMapping);

      expect(result).toEqual({
        alpha: [0.4, 1], // 0.8 * 0.5 = 0.4 (multiplicative)
      });
    });
  });

  describe("flatten", () => {
    it("flattens Vec2 array", () => {
      expect(
        flatten([
          [1, 2],
          [3, 4],
        ])
      ).toEqual([1, 2, 3, 4]);
    });

    it("flattens Vec3 array", () => {
      expect(
        flatten([
          [1, 2, 3],
          [4, 5, 6],
        ])
      ).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("flattens Vec4 array", () => {
      expect(
        flatten([
          [1, 2, 3, 4],
          [5, 6, 7, 8],
        ])
      ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("handles empty array", () => {
      expect(flatten([])).toEqual([]);
    });

    it("handles single vector", () => {
      expect(flatten([[1, 2, 3]])).toEqual([1, 2, 3]);
    });
  });

  describe("interpolateFloat", () => {
    it("interpolates between keyframes", () => {
      // Track format: [time, value, time, value, ...]
      const track = new Float32Array([0, 0, 10, 10, 20, 20]);

      expect(interpolateFloat(track, 5)).toBe(5);
      expect(interpolateFloat(track, 10)).toBe(10);
      expect(interpolateFloat(track, 15)).toBe(15);
    });

    it("returns last value when position is beyond track", () => {
      const track = new Float32Array([0, 0, 10, 10, 20, 20]);
      expect(interpolateFloat(track, 25)).toBe(20);
      expect(interpolateFloat(track, 100)).toBe(20);
    });

    it("uses startValue for position before first keyframe", () => {
      const track = new Float32Array([10, 100, 20, 200]);
      expect(interpolateFloat(track, 5, 50)).toBe(75); // Interpolate from startValue=50
    });

    it("handles single keyframe", () => {
      const track = new Float32Array([10, 100]);
      // Before first keyframe interpolates from startValue (default 0)
      expect(interpolateFloat(track, 5)).toBe(50);
      expect(interpolateFloat(track, 10)).toBe(100);
      expect(interpolateFloat(track, 15)).toBe(100);
    });

    it("interpolates with non-linear spacing", () => {
      const track = new Float32Array([0, 0, 5, 100, 15, 200]);
      expect(interpolateFloat(track, 2.5)).toBe(50); // Halfway between 0 and 5
      expect(interpolateFloat(track, 10)).toBe(150); // Halfway between 5 and 15
    });

    it("handles exact keyframe positions", () => {
      const track = new Float32Array([0, 10, 5, 20, 10, 30]);
      expect(interpolateFloat(track, 0)).toBe(10);
      expect(interpolateFloat(track, 5)).toBe(20);
      expect(interpolateFloat(track, 10)).toBe(30);
    });

    it("uses default startValue of 0 when not provided", () => {
      const track = new Float32Array([10, 100]);
      expect(interpolateFloat(track, 5)).toBeCloseTo(50, 5);
    });
  });
});
