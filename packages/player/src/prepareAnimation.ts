import Delaunator from "delaunator";
import { geppettoImageSchema } from "@geppetto/types";
import { vectorArrayToPreparedFloatBuffer } from "./buffer";
import { visitHierarchy, getPreviousOfType } from "./traverse";
import type {
  GeppettoImage,
  MutationVector,
  Layer,
  Vec2,
  Vec4,
  AnimationControlTrack,
  AnimationVisibilityTrack,
  PreparedImageDefinition,
  PreparedLayer,
  PreparedAnimation,
  PreparedControl,
  PreparedControlTrack,
  PreparedControlAction,
} from "./types";

const getAnchor = (layer: Layer): Vec2 => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  layer.points.forEach(([x, y]) => {
    minX = x < minX ? x : minX;
    maxX = x > maxX ? x : maxX;
    minY = y < minY ? y : minY;
    maxY = y > maxY ? y : maxY;
  });

  return [(minX + maxX) / 2, (minY + maxY) / 2];
};

const filteredTriangles = (points: number[][]): number[] =>
  Delaunator.from(points).triangles;

const vectorTypeMapping: { [key in MutationVector["type"]]: number } = {
  translate: 1,
  stretch: 2,
  rotate: 3,
  deform: 4,
  opacity: 5,
  lightness: 6,
  colorize: 7,
  saturation: 8,
};

const mutatorToVec4 = (mutator: MutationVector): Vec4 => [
  vectorTypeMapping[mutator.type],
  mutator.origin[0],
  mutator.origin[1],
  mutator.type === "deform" || mutator.type === "translate"
    ? mutator.radius
    : -1,
];

/**
 * Convert the GeppettoImage format 2.x into a preprocessed structure optimized for WebGL rendering
 *
 * @param image - GeppettoImage in format 2.x
 * @param options - Optional configuration
 * @param options.validate - Whether to validate the input (default: true in development, false in production)
 * @returns PreparedImageDefinition optimized for WebGL
 * @throws {Error} If validation is enabled and the image format is invalid
 */
export const prepareAnimation = (
  image: GeppettoImage,
  options: { validate?: boolean } = {}
): PreparedImageDefinition => {
  // Default to true - users can explicitly set to false for production builds
  const shouldValidate = options.validate ?? true;

  // Validate input format if enabled
  if (shouldValidate) {
    const validationResult = geppettoImageSchema.safeParse(image);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(`Invalid Geppetto image format:\n${errorMessage}`);
    }
  }

  // Step 1: Collect all mutations in hierarchy order (matching studio's createShapeMutationList)
  const mutatorIndices: { id: string; parent: number }[] = [];
  const mutators: Vec4[] = [];
  const mutatorMapping: Record<string, number> = {};

  visitHierarchy(image.layerHierarchy, (nodeId, node) => {
    if (node.type === "mutation") {
      const mutation = image.mutations[nodeId];
      const value = mutatorToVec4(mutation);
      const index = mutators.length;
      mutators.push(value);

      const parentMutation = getPreviousOfType(
        image.layerHierarchy,
        "mutation",
        nodeId
      );
      const mutatorIndex =
        parentMutation === null
          ? -1
          : mutatorIndices.findIndex((e) => e.id === parentMutation);
      mutatorIndices.push({ id: nodeId, parent: mutatorIndex });
      mutatorMapping[nodeId] = index;
    }
  });

  // Step 2: Build shape-to-mutator mapping
  const shapeMutatorMapping: Record<string, number> = {};
  visitHierarchy(image.layerHierarchy, (nodeId, node) => {
    if (node.type === "layer") {
      const parentMutation = node.children
        ? node.children.slice(-1)[0]
        : getPreviousOfType(image.layerHierarchy, "mutation", nodeId);

      const mutatorIndex =
        parentMutation === null
          ? -1
          : mutatorIndices.findIndex((e) => e.id === parentMutation);
      shapeMutatorMapping[nodeId] = mutatorIndex;
    }
  });

  // Build parent array (Int32Array for parent indices)
  const mutatorParents = new Int32Array(mutators.length);
  mutatorIndices.forEach((item, index) => {
    mutatorParents[index] = item.parent;
  });

  // Step 3: Process layers and build geometry
  const layers: PreparedLayer[] = [];
  const vertices: Vec4[] = [];
  const indices: number[] = [];
  const layerNames = new Map<string, number>();
  let layerIndex = 0;

  visitHierarchy(image.layerHierarchy, (nodeId, node) => {
    if (node.type === "layerFolder") {
      const folder = image.layerFolders[nodeId];
      if (!folder.visible) {
        return; // Skip this folder and its children
      }
    }
    if (node.type !== "layer") {
      return;
    }

    const layer = image.layers[nodeId];
    if (!layer.visible) return;

    const currentLayerIndex = layerIndex++;
    layerNames.set(layer.name, currentLayerIndex);

    const anchor = getAnchor(layer);
    const shapeIndices = filteredTriangles(layer.points);
    const itemOffset = [...layer.translate, currentLayerIndex * 0.1];
    const offset = vertices.length;

    const mutatorIndex = shapeMutatorMapping[nodeId] ?? -1;

    layers.push({
      name: layer.name,
      start: indices.length * 2,
      amount: shapeIndices.length,
      mutator: mutatorIndex,
      x: itemOffset[0],
      y: itemOffset[1],
      z: -0.5 + itemOffset[2] * 0.001,
      visible: layer.visible,
    });

    layer.points.forEach(([x, y]) => {
      vertices.push([x - anchor[0], y - anchor[1], x, y]);
    });

    shapeIndices.forEach((index) => {
      indices.push(index + offset);
    });
  });

  // Step 4: Sort layers by z-index for correct rendering order
  layers.sort((a, b) => (b.z || 0) - (a.z || 0));

  // Step 5: Process controls (simplified - no shader optimization)
  const controlIds = Object.keys(image.controls);
  const controlNames = new Map<string, number>();
  const controls: PreparedControl[] = [];
  const defaultControlValues = new Float32Array(controlIds.length);

  controlIds.forEach((controlId, controlIndex) => {
    const control = image.controls[controlId];
    controlNames.set(control.name, controlIndex);

    controls.push({
      name: control.name,
      steps: control.steps.length,
    });
    defaultControlValues[controlIndex] = image.controlValues?.[controlId] ?? 0;
  });

  // Step 6: Initialize mutation values from defaults
  const mutationValues = new Float32Array(mutators.length * 2);
  if (image.defaultFrame) {
    Object.entries(image.defaultFrame).forEach(([mutationId, value]) => {
      const index = mutatorMapping[mutationId];
      if (index !== undefined) {
        mutationValues[index * 2] = value[0];
        mutationValues[index * 2 + 1] = value[1];
      }
    });
  }

  // Step 7: Process animations (track-based format 2.x)
  const animationIds = Object.keys(image.animations);
  const animationNames = new Map<string, number>();
  const animations: PreparedAnimation[] = [];

  animationIds.forEach((animationId, animationIndex) => {
    const animation = image.animations[animationId];
    animationNames.set(animation.name, animationIndex);

    const tracks: PreparedControlTrack[] = [];
    const visibilityTracks = new Map<number, [number, boolean][]>();
    const events: [number, string][] = [];

    // Process animation tracks
    animation.tracks.forEach((track) => {
      if (track.type === "control") {
        const controlTrack = track as AnimationControlTrack;
        const controlIndex = controlNames.get(
          image.controls[controlTrack.controlId]?.name
        );
        if (controlIndex === undefined) return;

        // Convert to prepared format, preserving easing and start values
        const preparedActions: PreparedControlAction[] = controlTrack.actions
          .slice()
          .sort((a, b) => a.start - b.start)
          .map((action) => ({
            start: action.start,
            duration: action.duration,
            easingFunction: action.easingFunction,
            controlEndValue: action.controlEndValue,
            controlStartValue: action.controlStartValue, // undefined means use current value
          }));

        tracks.push({
          controlIndex,
          actions: preparedActions,
          length: controlTrack.length,
        });
      } else if (track.type === "visibility") {
        const visTrack = track as AnimationVisibilityTrack;
        const layerIndex = layerNames.get(image.layers[visTrack.layerId]?.name);
        if (layerIndex === undefined) return;

        const actions: [number, boolean][] = visTrack.actions.map((action) => [
          action.start,
          action.visible,
        ]);
        visibilityTracks.set(layerIndex, actions);
      }
    });

    // Process events
    animation.events?.forEach((event) => {
      events.push([event.start, event.eventName]);
    });

    // Calculate animation duration from track lengths
    const animationDuration = animation.tracks.reduce(
      (max, track) => Math.max(max, track.length),
      0
    );

    animations.push({
      name: animation.name,
      duration: animationDuration,
      looping: animation.looping,
      speed: animation.speedModifier ?? 1,
      autoplay: animation.autoplay ?? false,
      tracks,
      visibilityTracks,
      events,
    });
  });

  // Step 8: Extract canvas metadata
  const metadata = {
    width: image.metadata?.width ?? 1024,
    height: image.metadata?.height ?? 1024,
    zoom: image.metadata?.zoom ?? 1,
    pan: (image.metadata?.pan ?? [0, 0]) as Vec2,
  };

  return {
    // Mutation data (matching studio's structure)
    mutators: vectorArrayToPreparedFloatBuffer(mutators),
    mutatorParents: {
      data: mutatorParents,
      length: mutatorParents.length,
      stride: 1,
    },
    mutationValues: {
      data: mutationValues,
      length: mutators.length,
      stride: 2,
    },
    mutatorMapping, // For updating mutation values from controls/animations
    rawMutations: image.mutations, // Raw mutation definitions for interpolation

    // Geometry data
    shapeVertices: vectorArrayToPreparedFloatBuffer(vertices),
    shapeIndices: new Uint16Array(indices),
    layers,

    // Control data (simplified - no shader optimization)
    controls,
    defaultControlValues,
    controlNames,
    rawControls: image.controls, // Raw control definitions with steps for interpolation

    // Animation data
    animations,
    animationNames,
    layerNames,

    // Canvas metadata
    metadata,
  };
};
