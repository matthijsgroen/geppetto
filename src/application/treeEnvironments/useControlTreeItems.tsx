import { MutableRefObject, useMemo, useRef } from "react";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage } from "../../animation/file2/types";
import { TreeData, TreeItem, TreeItemIndex } from "../../ui-components";
import { TREE_ROOT } from "../../ui-components/Tree/Tree";

type ControlType = "control" | "controlFolder";
export type ControlItem = TreeItem<TreeData<ControlType>>;

const populateTree = (
  newFile: GeppettoImage,
  previousFile: GeppettoImage,
  result: MutableRefObject<Record<TreeItemIndex, ControlItem>>
) => {
  const hierarchy = newFile.controlHierarchy;

  const changedNodes = Object.keys(newFile.layerHierarchy).filter((key) => {
    const item = newFile.layerHierarchy[key];
    if (item !== previousFile.layerHierarchy[key]) {
      return true;
    }
    if (
      item.type === "layer" &&
      newFile.layers[key] !== previousFile.layers[key]
    ) {
      return true;
    }
    if (
      item.type === "layerFolder" &&
      newFile.layerFolders[key] !== previousFile.layerFolders[key]
    ) {
      return true;
    }
    if (
      item.type === "mutation" &&
      newFile.mutations[key] !== previousFile.mutations[key]
    ) {
      return true;
    }

    return false;
  });
  if (changedNodes.length === 0) {
    return;
  }
  result.current = { ...result.current };

  const populateNode = (nodeId: string) => {
    const item = hierarchy[nodeId];
    const childIds = item.children || [];
    if (!changedNodes.includes(nodeId)) {
      for (const childId of childIds) {
        populateNode(childId);
      }
      return;
    }

    if (item.type === "root") {
      result.current[nodeId] = {
        index: nodeId,
        canMove: false,
        hasChildren: true,
        children: item.children,
        data: {
          name: "Root",
          icon: "",
          type: "controlFolder",
        },
        canRename: false,
      };

      for (const childId of childIds) {
        populateNode(childId);
      }
      return;
    }
    if (item.type === "control") {
      const controlData = newFile.controls[nodeId];
      const data: TreeData<ControlType> = {
        name: controlData.name,
        icon: "⚙️",
        type: item.type,
      };
      result.current[nodeId] = {
        index: nodeId,
        canMove: true,
        hasChildren: false,
        children: [],
        data,
        canRename: true,
      };
    }
    if (item.type === "controlFolder") {
      const controlFolderData = newFile.controlFolders[nodeId];
      const data: TreeData<ControlType> = {
        name: controlFolderData.name,
        icon: "📁",
        type: item.type,
      };
      result.current[nodeId] = {
        index: nodeId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data,
        canRename: true,
      };
    }
    for (const childId of childIds) {
      populateNode(childId);
    }
  };

  populateNode(TREE_ROOT);
};

export const useControlTreeItems = (file: GeppettoImage) => {
  const treeItemsRef = useRef<Record<TreeItemIndex, ControlItem>>({});
  const fileRef = useRef<GeppettoImage>(newFile());

  useMemo(() => {
    populateTree(file, fileRef.current, treeItemsRef);
    fileRef.current = file;
  }, [file]);
  return treeItemsRef.current;
};
