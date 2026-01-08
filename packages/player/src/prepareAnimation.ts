import Delaunator from "delaunator";
import { vectorArrayToPreparedFloatBuffer } from "./buffer";
import {
  getMutationChain,
  buildMutationParentMap,
  getAllMutationIds,
  getAllLayerIds,
} from "./traverse";
import type {
  GeppettoImage,
  MutationVector,
  Layer,
  Vec2,
  Vec3,
  Vec4,
  AnimationControlTrack,
  AnimationVisibilityTrack,
} from "./types";
import type {
  PreparedImageDefinition,
  PreparedLayer,
  PreparedAnimation,
  PreparedControl,
  DirectControl,
  MixMode,
} from "./types";
import { MixMode as MixModeEnum } from "./types";

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

const getMixMode = (mutType: number): MixMode =>
  mutType === vectorTypeMapping.stretch ||
  mutType === vectorTypeMapping.lightness ||
  mutType === vectorTypeMapping.saturation ||
  mutType === vectorTypeMapping.opacity
    ? MixModeEnum.MULTIPLY
    : mutType === vectorTypeMapping.colorize
    ? MixModeEnum.HUE
    : MixModeEnum.ADD;

/**
 * Convert the GeppettoImage format 2.x into a preprocessed structure optimized for WebGL rendering
 *
 * @param image - GeppettoImage in format 2.x
 * @returns PreparedImageDefinition optimized for WebGL
 */
export const prepareAnimation = (
  image: GeppettoImage
): PreparedImageDefinition => {
  // Step 1: Get all mutation IDs in hierarchy order and build parent map
  const mutationIds = getAllMutationIds(image.layerHierarchy);
  const mutatorParents = buildMutationParentMap(mutationIds, image.layerHierarchy);
  
  // Step 2: Convert mutations to Vec4 array using ID-based lookups (O(1))
  const mutators: Vec4[] = mutationIds.map((id) => {
    const mutation = image.mutations[id];
    return mutatorToVec4(mutation);
  });
  
  // Step 3: Build mutation ID to index map for O(1) lookup
  const mutationIndexMap = new Map<string, number>(
    mutationIds.map((id, index) => [id, index])
  );
  
  // Step 4: Process layers and build geometry
  const layerIds = getAllLayerIds(image.layerHierarchy);
  const layers: PreparedLayer[] = [];
  const vertices: Vec4[] = [];
  const indices: number[] = [];
  const layerNames = new Map<string, number>();
  
  layerIds.forEach((layerId, layerIndex) => {
    const layer = image.layers[layerId];
    layerNames.set(layer.name, layerIndex);
    
    const anchor = getAnchor(layer);
    const shapeIndices = filteredTriangles(layer.points);
    const itemOffset = [...layer.translate, layerIndex * 0.1];
    const offset = vertices.length;
    
    // Get last mutation in chain for this layer
    const mutationChain = getMutationChain(layerId, image.layerHierarchy);
    const lastMutationId = mutationChain[mutationChain.length - 1];
    const mutatorIndex = lastMutationId ? mutationIndexMap.get(lastMutationId) ?? -1 : -1;
    
    layers.push({
      name: layer.name,
      start: indices.length * 2,
      amount: shapeIndices.length,
      mutator: mutatorIndex,
      x: itemOffset[0],
      y: itemOffset[1],
      z: -0.9 + itemOffset[2] * 0.0001,
      visible: layer.visible,
    });
    
    layer.points.forEach(([x, y]) => {
      vertices.push([x - anchor[0], y - anchor[1], x, y]);
    });
    
    shapeIndices.forEach((index) => {
      indices.push(index + offset);
    });
  });
  
  // Step 5: Sort layers by z-index for correct rendering order
  layers.sort((a, b) => (b.z || 0) - (a.z || 0));
  
  // Step 6: Initialize visibility state buffer
  const visibilityState = new Uint8Array(layers.length);
  layers.forEach((layer, index) => {
    visibilityState[index] = layer.visible ? 1 : 0;
  });
  
  // Step 7: Process controls
  const controlIds = Object.keys(image.controls);
  const controlNames = new Map<string, number>();
  const controls: PreparedControl[] = [];
  const defaultControlValues = new Float32Array(controlIds.length);
  
  type ControlData = {
    name: string;
    controlIndex: number;
    valueStartIndex: number;
    values: Vec2[];
    stepType: number;
  };
  
  type MutationControl = {
    [mutationIndex: number]: ControlData[];
  };
  
  const controlMutationValueList: Vec2[] = [];
  const mutationValueIndicesList: Vec3[] = [];
  const controlMutationIndicesList: Vec2[] = [];
  const directControls: DirectControl[] = [];
  
  controlIds.forEach((controlId, controlIndex) => {
    const control = image.controls[controlId];
    controlNames.set(control.name, controlIndex);
    controls.push({
      name: control.name,
      steps: control.steps.length,
    });
    defaultControlValues[controlIndex] = image.controlValues?.[controlId] ?? 0;
  });
  
  // Step 8: Build mutation-control relationships
  const mutationControlData: MutationControl = {};
  
  controlIds.forEach((controlId, controlIndex) => {
    const control = image.controls[controlId];
    const affectedMutations = new Set<string>();
    
    // Collect all mutations affected by this control
    control.steps.forEach((step) => {
      Object.keys(step).forEach((mutationId) => {
        affectedMutations.add(mutationId);
      });
    });
    
    // For each affected mutation, store control data
    affectedMutations.forEach((mutationId) => {
      const mutationIndex = mutationIndexMap.get(mutationId);
      if (mutationIndex === undefined) return;
      
      const values: Vec2[] = control.steps.map((step) => step[mutationId] || [0, 0]);
      
      const controlData: ControlData = {
        name: control.name,
        controlIndex,
        valueStartIndex: 0,
        values,
        stepType: 0,
      };
      
      if (!mutationControlData[mutationIndex]) {
        mutationControlData[mutationIndex] = [];
      }
      mutationControlData[mutationIndex].push(controlData);
    });
  });
  
  // Step 9: Build control mutation buffers (separate single-control "direct" from multi-control "complex")
  controlMutationIndicesList.length = mutators.length;
  controlMutationIndicesList.fill([0, 0]);
  
  Object.entries(mutationControlData).forEach(([keyAsString, controlsForMutation]) => {
    const mutationIndex = parseInt(keyAsString, 10);
    
    // Single control optimization - GPU-free direct updates
    if (controlsForMutation.length === 1) {
      const controlData = controlsForMutation[0];
      const mutType = mutators[mutationIndex][0];
      
      directControls.push({
        mutation: mutationIndex,
        mixMode: getMixMode(mutType),
        control: controlData.controlIndex,
        stepType: controlData.stepType,
        trackX: new Float32Array(
          controlData.values.reduce<number[]>(
            (result, element, index) => result.concat(index, element[0]),
            []
          )
        ),
        trackY: new Float32Array(
          controlData.values.reduce<number[]>(
            (result, element, index) => result.concat(index, element[1]),
            []
          )
        ),
      });
      return;
    }
    
    if (controlsForMutation.length === 0) return;
    
    // Multi-control - needs shader iteration
    for (const controlData of controlsForMutation) {
      controlData.valueStartIndex = controlMutationValueList.length;
      controlMutationValueList.push(...controlData.values);
    }
    
    const items: Vec3[] = controlsForMutation.map<Vec3>((d) => [
      d.valueStartIndex,
      d.controlIndex,
      d.stepType,
    ]);
    
    controlMutationIndicesList[mutationIndex] = [
      mutationValueIndicesList.length,
      items.length,
    ];
    mutationValueIndicesList.push(...items);
  });
  
  // Step 10: Initialize mutation values from defaults
  const mutationValues = new Float32Array(mutators.length * 2);
  if (image.defaultFrame) {
    Object.entries(image.defaultFrame).forEach(([mutationId, value]) => {
      const index = mutationIndexMap.get(mutationId);
      if (index === undefined) return;
      mutationValues[index * 2] = value[0];
      mutationValues[index * 2 + 1] = value[1];
    });
  }
  
  // Step 11: Convert animations (track-based format 2.x)
  const animationIds = Object.keys(image.animations);
  const animationNames = new Map<string, number>();
  const animations: PreparedAnimation[] = [];
  
  animationIds.forEach((animationId, animationIndex) => {
    const animation = image.animations[animationId];
    animationNames.set(animation.name, animationIndex);
    
    const tracks: [number, Float32Array][] = [];
    const visibilityTracks = new Map<number, [number, boolean][]>();
    const events: [number, string][] = [];
    
    // Process animation tracks
    animation.tracks.forEach((track) => {
      if (track.type === "control") {
        const controlTrack = track as AnimationControlTrack;
        const controlIndex = controlNames.get(image.controls[controlTrack.controlId]?.name);
        if (controlIndex === undefined) return;
        
        // Convert actions to time-value pairs
        const timeValues: number[] = [];
        controlTrack.actions.forEach((action) => {
          timeValues.push(action.start, action.controlStartValue ?? 0);
          if (action.duration > 0) {
            timeValues.push(action.start + action.duration, action.controlEndValue);
          }
        });
        
        tracks.push([controlIndex, new Float32Array(timeValues)]);
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
    
    animations.push({
      name: animation.name,
      duration: animation.tracks.reduce((max, track) => Math.max(max, track.length), 0),
      looping: animation.looping,
      tracks,
      visibilityTracks,
      events,
    });
  });
  
  // Step 12: Extract canvas metadata
  const metadata = {
    width: image.metadata?.width ?? 1024,
    height: image.metadata?.height ?? 1024,
    zoom: image.metadata?.zoom ?? 1,
    pan: (image.metadata?.pan ?? [0, 0]) as Vec2,
  };
  
  return {
    directControls,
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
    controlMutationValues: vectorArrayToPreparedFloatBuffer(controlMutationValueList),
    mutationValueIndices: vectorArrayToPreparedFloatBuffer(mutationValueIndicesList),
    controlMutationIndices: vectorArrayToPreparedFloatBuffer(controlMutationIndicesList),
    shapeVertices: vectorArrayToPreparedFloatBuffer(vertices),
    shapeIndices: new Uint16Array(indices),
    layers,
    visibilityState,
    controls,
    defaultControlValues,
    controlNames,
    animationNames,
    layerNames,
    animations,
    metadata,
  };
};
