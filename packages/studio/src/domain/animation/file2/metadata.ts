import type { GeppettoImage } from "@geppetto/types";
import { produce } from "immer";

export const updateImageWidth = (newWidth: number) =>
  produce<GeppettoImage>((draft) => {
    draft.metadata.width = newWidth;
  });

export const updateImageHeight = (newHeight: number) =>
  produce<GeppettoImage>((draft) => {
    draft.metadata.height = newHeight;
  });
