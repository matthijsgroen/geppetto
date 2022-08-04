import { newFile } from "./new";
import { addFolder, addShape } from "./shapes";
import { addMutation } from "./mutation";
import { GeppettoImage, MutationVector } from "./types";
import { Vec2 } from "../../types";
import { addControl } from "./controls";

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
          file = addShape(name, { parent: parentId[0] })(file);

          return builder;
        }
      }
      file = addShape(name)(file);

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
          const updated = addMutation(file, name, type, props, {
            parent: folderParentId[0],
          });
          file = updated;
          return builder;
        }
        const layerParentId = Object.entries(file.layers).find(
          ([, f]) => f.name === parentName
        );
        if (layerParentId) {
          file = addMutation(file, name, type, props, {
            parent: layerParentId[0],
          });
          return builder;
        }
      }

      return builder;
    },
    addControl: (name: string, parentName?: string) => {
      if (parentName !== undefined) {
        const parentId = Object.entries(file.controlFolders).find(
          ([, f]) => f.name === parentName
        );
        if (parentId) {
          file = addControl(name, { parent: parentId[0] })(file);

          return builder;
        }
      }
      file = addControl(name)(file);

      return builder;
    },
    build: () => file,
  };

  return builder;
};

export const getMutationIdByName = (
  file: GeppettoImage,
  name: string
): string => {
  const mut = Object.entries(file.mutations).find(([, m]) => m.name === name);
  return mut ? mut[0] : "NOT_FOUND";
};

export const getShapeIdByName = (file: GeppettoImage, name: string): string => {
  const layer = Object.entries(file.layers).find(([, m]) => m.name === name);
  return layer ? layer[0] : "NOT_FOUND";
};

export const getShapeFolderIdByName = (
  file: GeppettoImage,
  name: string
): string => {
  const layer = Object.entries(file.layerFolders).find(
    ([, m]) => m.name === name
  );
  return layer ? layer[0] : "NOT_FOUND";
};

export const getControlIdByName = (
  file: GeppettoImage,
  name: string
): string => {
  const control = Object.entries(file.controls).find(
    ([, m]) => m.name === name
  );
  return control ? control[0] : "NOT_FOUND";
};
