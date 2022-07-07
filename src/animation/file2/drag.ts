import produce from "immer";
import { vecAdd } from "../../application/webgl/lib/vertices";
import { Vec2 } from "../../types";
import { collectChildIds } from "./hierarchy";
import { GeppettoImage } from "./types";

export const dragItem = (
  originFile: GeppettoImage,
  dragged: Vec2,
  itemId: string
) =>
  produce<GeppettoImage>((draft) => {
    const ids = [itemId, ...collectChildIds(draft.layerHierarchy, itemId)];

    for (const dragId of ids) {
      const item = originFile.layerHierarchy[dragId];
      if (item.type === "layer") {
        draft.layers[dragId].translate = vecAdd(
          originFile.layers[dragId].translate,
          dragged
        );
      }
      if (item.type === "mutation") {
        draft.mutations[dragId].origin = vecAdd(
          originFile.mutations[dragId].origin,
          dragged
        );
      }
    }
  });
