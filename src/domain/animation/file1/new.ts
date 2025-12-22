import { type ImageDefinition } from "@/dtos/animation-file1.dto";

export const newFile = (): ImageDefinition => ({
  animations: [],
  controlValues: {},
  controls: [],
  defaultFrame: {},
  shapes: [],
  version: "1.0",
});
