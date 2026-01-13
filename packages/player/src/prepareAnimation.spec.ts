import {  prepareAnimation } from "./prepareAnimation";
import type { GeppettoImage } from "@geppetto/types";
import { describe, it, expect } from "vitest";

describe("prepareAnimation", () => {
  const imageDefinition: GeppettoImage = {
    version: "2.0",
    metadata: {
      width: 100,
      height: 100,
      zoom: 1,
      pan: [0, 0],
    },
    layerHierarchy: {
      root: {
        type: "root",
        children: ["folder1"],
      },
      folder1: {
        type: "layerFolder",
        parentId: "root",
        children: ["mut0", "mut1", "layer1", "layer2", "layer3"],
      },
      mut0: {
        type: "mutation",
        parentId: "folder1",
      },
      mut1: {
        type: "mutation",
        parentId: "folder1",
      },
      layer1: {
        type: "layer",
        parentId: "folder1",
        children: ["mut2", "mut3"],
      },
      mut2: {
        type: "mutation",
        parentId: "layer1",
      },
      mut3: {
        type: "mutation",
        parentId: "layer1",
      },
      layer2: {
        type: "layer",
        parentId: "folder1",
        children: ["mut4"],
      },
      mut4: {
        type: "mutation",
        parentId: "layer2",
      },
      layer3: {
        type: "layer",
        parentId: "folder1",
        children: ["mut5"],
      },
      mut5: {
        type: "mutation",
        parentId: "layer3",
      },
    },
    layers: {
      layer1: {
        name: "Layer1",
        points: [
          [0, 0],
          [10, 10],
          [5, 5],
        ],
        translate: [20, 20],
        visible: true,
      },
      layer2: {
        name: "Layer2",
        points: [
          [0, 0],
          [10, 10],
          [5, 5],
        ],
        translate: [20, 20],
        visible: true,
      },
      layer3: {
        name: "Layer3",
        points: [
          [0, 0],
          [10, 10],
          [5, 5],
        ],
        translate: [20, 20],
        visible: true,
      },
    },
    mutations: {
      mut0: { name: "Mutation1",  type: "translate", origin: [30, 30], radius: -1 },
      mut1: { name: "Mutation2", type: "opacity", origin: [30, 30], },
      mut2: { name: "Mutation3", type: "deform", origin: [15, 15], radius: 30 },
      mut3: { name: "Mutation4", type: "stretch", origin: [18, 12] },
      mut4: { name: "Mutation5", type: "rotate", origin: [40, 34] },
      mut5: { name: "Mutation6", type: "translate", origin: [40, 34], radius: -1 },
    },
    defaultFrame: {
      mut0: [0, 0],
      mut1: [1, 0],
      mut2: [2, 0],
      mut3: [1, 1],
      mut4: [45, 0],
      mut5: [0, 0],
    },
    layerFolders: {
      folder1: { name: "Folder", collapsed: false, visible: true },
    },
    controlHierarchy: {
      root: {
        type: "root",
        children: ["ctrl0", "ctrl1", "ctrl2"],
      },
      ctrl0: {
        type: "control",
        parentId: "root",
      },
      ctrl1: {
        type: "control",
        parentId: "root",
      },
      ctrl2: {
        type: "control",
        parentId: "root",
      },
    },
    controlFolders: {},
    controls: {
      ctrl0: {
        name: "Control1",
        type: "slider",
        steps: [
          { mut2: [15, 0], mut4: [200, 0] },
          { mut2: [-15, 0], mut4: [120, 0] },
        ],
      },
      ctrl1: {
        name: "Control2",
        type: "slider",
        steps: [
          { mut1: [1, 0], mut4: [-20, 0] },
          { mut1: [0.2, 0], mut4: [-60, 0] },
        ],
      },
      ctrl2: {
        name: "Control3",
        type: "slider",
        steps: [
          { mut5: [-500, 0] },
          { mut5: [300, 0] },
        ],
      },
    },
    controlValues: {
      ctrl0: 0.5,
      ctrl1: 0.75,
      ctrl2: 0.25,
    },
    animations: {
      anim0: {
        name: "AnimationTrack",
        looping: false,
        tracks: [
          {
            type: "control",
            controlId: "ctrl0",
            length: 6200,
            actions: [
              { start: 0, duration: 2000, easingFunction: "linear" as const, controlEndValue: 0 },
              { start: 2000, duration: 2000, easingFunction: "linear" as const, controlEndValue: 0.7 },
              { start: 4000, duration: 2200, easingFunction: "linear" as const, controlEndValue: 1.0 },
            ],
          },
          {
            type: "control",
            controlId: "ctrl1",
            length: 6200,
            actions: [
              { start: 0, duration: 2000, easingFunction: "linear" as const, controlEndValue: 0.4 },
              { start: 2000, duration: 4200, easingFunction: "linear" as const, controlEndValue: 1.0 },
            ],
          },
        ],
        events: [{ start: 2500, eventName: "MyCustomEvent" }],
      },
      anim1: {
        name: "New Animation",
        looping: false,
        tracks: [],
        events: [],
      },
    },
  };

  describe("mutators buffer", () => {
    it("places all types of mutators", () => {
      const result = prepareAnimation(imageDefinition, { validate: false });
      const buffer = result.mutators;
      expect(buffer.length).toEqual(6);
      // translate
      expect(buffer.data.slice(0, 4)).toEqual(
        new Float32Array([1, 30, 30, -1])
      );
      // opacity
      expect(buffer.data.slice(4, 8)).toEqual(
        new Float32Array([5, 30, 30, -1])
      );
      // mutate
      expect(buffer.data.slice(8, 12)).toEqual(
        new Float32Array([4, 15, 15, 30])
      );
      // stretch
      expect(buffer.data.slice(12, 16)).toEqual(
        new Float32Array([2, 18, 12, -1])
      );
      // rotate
      expect(buffer.data.slice(16, 20)).toEqual(
        new Float32Array([3, 40, 34, -1])
      );
    });
  });

  describe("mutatorParents buffer", () => {
    it("uses -1 if mutator has no parent", () => {
      const result = prepareAnimation(imageDefinition, { validate: false });
      const buffer = result.mutatorParents;
      expect(buffer.data[0]).toEqual(-1);
    });

    it("links to the parent mutation of a parent folder", () => {
      const result = prepareAnimation(imageDefinition, { validate: false });
      const buffer = result.mutatorParents;
      expect(buffer.data[2]).toEqual(1);
      expect(buffer.data[4]).toEqual(1);
    });

    it("links to the parent mutation of a mutator earlier on same level", () => {
      const result = prepareAnimation(imageDefinition, { validate: false });
      const buffer = result.mutatorParents;
      expect(buffer.data[1]).toEqual(0);
      expect(buffer.data[3]).toEqual(2);
    });
  });

  describe("mutationValues", () => {
    it("places all mutation values in order in a buffer", () => {
      const result = prepareAnimation(imageDefinition, { validate: false });
      const buffer = result.mutationValues;
      expect(buffer.data).toEqual(
        new Float32Array([0, 0, 1, 0, 2, 0, 1, 1, 45, 0, 0, 0])
      );
    });
  });

  describe("control administration", () => {
    it("reports what controls there are", () => {
      const { controls } = prepareAnimation(imageDefinition, { validate: false });
      expect(controls).toEqual([
        { name: "Control1", steps: 2 },
        { name: "Control2", steps: 2 },
        { name: "Control3", steps: 2 },
      ]);
    });
  });

  describe("animations", () => {
    it("creates animation tracks for each control", () => {
      const { animations } = prepareAnimation(imageDefinition, { validate: false });
      expect(animations).toHaveLength(2);
      
      const animationTrack = animations[0];
      expect(animationTrack.name).toBe("AnimationTrack");
      expect(animationTrack.duration).toBe(6200);
      expect(animationTrack.looping).toBe(false);
      expect(animationTrack.tracks).toHaveLength(2);
      expect(animationTrack.events).toEqual([[2500, "MyCustomEvent"]]);
      
      // Check first track (Control1)
      expect(animationTrack.tracks[0].controlIndex).toBe(0);
      expect(animationTrack.tracks[0].actions).toHaveLength(3);
      
      // Check second track (Control2)
      expect(animationTrack.tracks[1].controlIndex).toBe(1);
      expect(animationTrack.tracks[1].actions).toHaveLength(2);
      
      const newAnimation = animations[1];
      expect(newAnimation.name).toBe("New Animation");
      expect(newAnimation.duration).toBe(0);
      expect(newAnimation.tracks).toEqual([]);
      expect(newAnimation.events).toEqual([]);
    });
  });
});
