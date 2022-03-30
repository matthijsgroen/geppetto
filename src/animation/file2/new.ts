import { GeppettoImage } from "./types";

export const newFile = (): GeppettoImage => ({
  version: "2.0",
  metadata: {
    width: 2048,
    height: 1536,
    zoom: 1.0,
    pan: [0, 0],
  },
  layerHierarchy: [],
  layerFolders: {},
  layers: {},
  mutations: {},

  controlHierarchy: [],
  controlFolders: {},
  controls: {},
  defaultFrame: {},
  controlValues: {},

  animationHierarchy: [],
  animationFolders: {},
  animations: {},
});
