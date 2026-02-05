import { GeppettoImage } from "./image";

export const newFile = (): GeppettoImage => ({
  version: "2.0",
  metadata: {
    width: 1024,
    height: 1024,
    zoom: 1.0,
    pan: [0, 0],
  },
  layerHierarchy: { root: { type: "root", children: [] } },
  layerFolders: {},
  layers: {},
  mutations: {},

  controlHierarchy: { root: { type: "root", children: [] } },
  controlFolders: {},
  controls: {},

  defaultFrame: {},
  controlValues: {},

  animationHierarchy: { root: { type: "root", children: [] } },
  animations: {},
});
