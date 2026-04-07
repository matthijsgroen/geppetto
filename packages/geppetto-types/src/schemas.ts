import { z } from "zod";

/**
 * Zod schema for Vec2 type
 */
export const vec2Schema = z.tuple([z.number(), z.number()]);

/**
 * Zod schema for base mutation vector properties
 */
const baseMutationVectorSchema = z.object({
  name: z.string(),
  origin: vec2Schema,
});

/**
 * Zod schema for translation mutation vector
 */
export const translationVectorSchema = baseMutationVectorSchema.extend({
  type: z.literal("translate"),
  radius: z.number(),
});

/**
 * Zod schema for deformation mutation vector
 */
export const deformationVectorSchema = baseMutationVectorSchema.extend({
  type: z.literal("deform"),
  radius: z.number(),
});

/**
 * Zod schema for stretch mutation vector
 */
export const stretchVectorSchema = baseMutationVectorSchema.extend({
  type: z.literal("stretch"),
});

/**
 * Zod schema for rotation mutation vector
 */
export const rotationVectorSchema = baseMutationVectorSchema.extend({
  type: z.literal("rotate"),
});

/**
 * Zod schema for opacity mutation vector
 */
export const opacityVectorSchema = baseMutationVectorSchema.extend({
  type: z.literal("opacity"),
});

/**
 * Zod schema for lightness mutation vector
 */
export const lightnessSchema = baseMutationVectorSchema.extend({
  type: z.literal("lightness"),
});

/**
 * Zod schema for saturation mutation vector
 */
export const saturationSchema = baseMutationVectorSchema.extend({
  type: z.literal("saturation"),
});

/**
 * Zod schema for colorize mutation vector
 */
export const colorizeSchema = baseMutationVectorSchema.extend({
  type: z.literal("colorize"),
});

/**
 * Zod schema for any mutation vector
 */
export const mutationVectorSchema = z.discriminatedUnion("type", [
  translationVectorSchema,
  deformationVectorSchema,
  stretchVectorSchema,
  rotationVectorSchema,
  opacityVectorSchema,
  lightnessSchema,
  saturationSchema,
  colorizeSchema,
]);

/**
 * Zod schema for tree nodes
 */
export const treeNodeSchema = z.object({
  type: z.string(),
  parentId: z.string(),
  children: z.array(z.string()).optional(),
});

/**
 * Zod schema for root node
 */
export const rootNodeSchema = z.object({
  type: z.literal("root"),
  children: z.array(z.string()),
});

/**
 * Zod schema for hierarchy
 */
export const hierarchySchema = z.record(
  z.union([treeNodeSchema, rootNodeSchema])
);

/**
 * Zod schema for layer
 */
export const layerSchema = z.object({
  name: z.string(),
  visible: z.boolean(),
  points: z.array(vec2Schema),
  translate: vec2Schema,
});

/**
 * Zod schema for folder
 */
export const folderSchema = z.object({
  name: z.string(),
  collapsed: z.boolean(),
});

/**
 * Zod schema for layer folder
 */
export const layerFolderSchema = folderSchema.extend({
  visible: z.boolean(),
});

/**
 * Zod schema for keyframe
 */
export const keyframeSchema = z.record(vec2Schema);

/**
 * Zod schema for control definition
 */
export const controlDefinitionSchema = z.object({
  name: z.string(),
  type: z.literal("slider"),
  steps: z.array(keyframeSchema),
});

/**
 * Zod schema for frame control action
 */
export const frameControlActionSchema = z.object({
  start: z.number(),
  easingFunction: z.enum(["easeIn", "easeOut", "easeInOut", "linear"]),
  controlEndValue: z.number(),
  controlStartValue: z.number().optional(),
  duration: z.number(),
});

/**
 * Zod schema for frame layer visibility action
 */
export const frameLayerVisibilityActionSchema = z.object({
  start: z.number(),
  visible: z.boolean(),
});

/**
 * Zod schema for frame callback event
 */
export const frameCallbackEventSchema = z.object({
  id: z.string(),
  type: z.literal("callback"),
  start: z.number(),
  eventName: z.string(),
});

/**
 * Zod schema for frame event
 */
export const frameEventSchema = z.discriminatedUnion("type", [
  frameCallbackEventSchema,
]);

/**
 * Zod schema for animation control track
 */
export const animationControlTrackSchema = z.object({
  type: z.literal("control"),
  controlId: z.string(),
  actions: z.array(frameControlActionSchema),
  length: z.number(),
});

/**
 * Zod schema for animation visibility track
 */
export const animationVisibilityTrackSchema = z.object({
  type: z.literal("visibility"),
  layerId: z.string(),
  actions: z.array(frameLayerVisibilityActionSchema),
  length: z.number(),
});

/**
 * Zod schema for animation
 */
export const animationSchema = z.object({
  name: z.string(),
  looping: z.boolean(),
  speedModifier: z.number().optional(),
  autoplay: z.boolean().optional(),
  tracks: z.array(
    z.discriminatedUnion("type", [
      animationControlTrackSchema,
      animationVisibilityTrackSchema,
    ])
  ),
  events: z.array(frameEventSchema),
});

/**
 * Zod schema for GeppettoImage file format 2.x
 */
export const geppettoImageSchema = z.strictObject({
  version: z.string().refine((v) => v.startsWith("2."), {
    message: "Version must be 2.x",
  }),
  metadata: z.object({
    width: z.number(),
    height: z.number(),
    zoom: z.number(),
    pan: z.tuple([z.number(), z.number()]),
  }),
  layerHierarchy: hierarchySchema,
  layers: z.record(layerSchema),
  mutations: z.record(mutationVectorSchema),
  layerFolders: z.record(layerFolderSchema),
  defaultFrame: z.record(vec2Schema),
  controlHierarchy: hierarchySchema,
  controlFolders: z.record(folderSchema),
  controls: z.record(controlDefinitionSchema),
  controlValues: z.record(z.number()),
  animationHierarchy: hierarchySchema,
  animations: z.record(animationSchema),
});
