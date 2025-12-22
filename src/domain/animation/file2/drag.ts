import { produce } from "immer";

import { vecAdd } from "../../../infrastructure/webgl/lib/vertices";
import { type Vec2 } from "../../../shared/types/global";
import { collectChildIds } from "./hierarchy";
import { type GeppettoImage } from "../../../dtos/animation-file2.dto";

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
