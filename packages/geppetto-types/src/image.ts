import { type Animation } from "./animations";
import { type ControlDefinition } from "./controls";
import { type Hierarchy } from "./hierarchy";
import { type Folder, type Layer, type LayerFolder } from "./layers";
import { type MutationVector } from "./mutations";
import { type Vec2 } from "./common";

/**
 * Geppetto Image file format 2.x
 *
 * This is the main type definition for the Geppetto animation format version 2.
 * It uses a hierarchical ID-based structure with separate records for layers,
 * mutations, controls, and animations.
 */
export type GeppettoImage = {
  /** File format version (2.x) */
  version: `2.${number}`;

  /** Canvas metadata */
  metadata: {
    width: number;
    height: number;
    zoom: number;
    pan: [number, number];
  };

  /** Layer hierarchy tree */
  layerHierarchy: Hierarchy<"layerFolder" | "layer" | "mutation">;

  /** Layer definitions by ID */
  layers: Record<string, Layer>;

  /** Mutation vectors by ID */
  mutations: Record<string, MutationVector>;

  /** Layer folders by ID */
  layerFolders: Record<string, LayerFolder>;

  /** Default mutation values */
  defaultFrame: Record<string, Vec2>;

  /** Control hierarchy tree */
  controlHierarchy: Hierarchy<"controlFolder" | "control">;

  /** Control folders by ID */
  controlFolders: Record<string, Folder>;

  /** Control definitions by ID */
  controls: Record<string, ControlDefinition>;

  /** Default control values */
  controlValues: Record<string, number>;

  /** Animations by ID */
  animations: Record<string, Animation>;
};

/**
 * Alias for GeppettoImage for backwards compatibility
 */
export type ImageDefinition2 = GeppettoImage;
