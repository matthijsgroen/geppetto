import { newFile } from "../../../animation/file2/new";
import { addFolder, addShape } from "../../../animation/file2/shapes";
import { addMutation } from "../../../animation/file2/mutation";
import { GeppettoImage, MutationVector } from "../../../animation/file2/types";
import { Vec2 } from "../../../types";

export const fileBuilder = () => {
  let file = newFile();

  const builder = {
    addFolder: (name: string, parentName?: string) => {
      if (parentName !== undefined) {
        const parentId = Object.entries(file.layerFolders).find(
          ([, f]) => f.name === parentName
        );
        if (parentId) {
          file = addFolder(file, name, { parent: parentId[0] });

          return builder;
        }
      }
      file = addFolder(file, name);

      return builder;
    },
    addShape: (name: string, parentName?: string) => {
      if (parentName !== undefined) {
        const parentId = Object.entries(file.layerFolders).find(
          ([, f]) => f.name === parentName
        );
        if (parentId) {
          const [updated] = addShape(file, name, { parent: parentId[0] });
          file = updated;

          return builder;
        }
      }
      const [updated] = addShape(file, name);
      file = updated;

      return builder;
    },
    addMutation: <MutationType extends MutationVector["type"]>(
      name: string,
      type: MutationType,
      props: Omit<
        Extract<MutationVector, { type: MutationType }>,
        "name" | "type" | "origin"
      > & { origin?: Vec2 },
      parentName: string
    ) => {
      if (parentName !== undefined) {
        const folderParentId = Object.entries(file.layerFolders).find(
          ([, f]) => f.name === parentName
        );
        if (folderParentId) {
          const [updated] = addMutation(file, name, type, props, {
            parent: folderParentId[0],
          });
          file = updated;
          return builder;
        }
        const layerParentId = Object.entries(file.layers).find(
          ([, f]) => f.name === parentName
        );
        if (layerParentId) {
          const [updated] = addMutation(file, name, type, props, {
            parent: layerParentId[0],
          });
          file = updated;
          return builder;
        }
      }

      return builder;
    },
    result: () => file,
  };

  return builder;
};

export const mutationIdByName = (file: GeppettoImage, name: string): string => {
  const mut = Object.entries(file.mutations).find(([, m]) => m.name === name);
  if (mut) {
    return mut[0];
  }
  return "NOT_FOUND";
};
