import { MutableRefObject, useMemo, useRef } from "react";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage } from "../../animation/file2/types";
import { TreeData, TreeItem, TreeItemIndex } from "../../ui-components";
import { TREE_ROOT } from "../../ui-components/Tree/Tree";

type AnimationType = "animation" | "animationFolder";
export type AnimationItem = TreeItem<TreeData<AnimationType>>;

const populateTree = (
  newFile: GeppettoImage,
  previousFile: GeppettoImage,
  result: MutableRefObject<Record<TreeItemIndex, AnimationItem>>
) => {
  const hierarchy = newFile.animationHierarchy;

  const changedNodes = Object.keys(newFile.animationHierarchy).filter((key) => {
    const item = newFile.animationHierarchy[key];
    if (item !== previousFile.animationHierarchy[key]) {
      return true;
    }
    if (
      item.type === "animation" &&
      newFile.animations[key] !== previousFile.animations[key]
    ) {
      return true;
    }
    if (
      item.type === "animationFolder" &&
      newFile.animationFolders[key] !== previousFile.animationFolders[key]
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
          type: "animationFolder",
        },
        canRename: false,
      };

      for (const childId of childIds) {
        populateNode(childId);
      }
      return;
    }
    if (item.type === "animation") {
      const animationData = newFile.animations[nodeId];
      const data: TreeData<AnimationType> = {
        name: animationData.name,
        icon: "🎞",
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
    if (item.type === "animationFolder") {
      const animationFolderData = newFile.animationFolders[nodeId];
      const data: TreeData<AnimationType> = {
        name: animationFolderData.name,
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

export const useAnimationTreeItems = (file: GeppettoImage) => {
  const treeItemsRef = useRef<Record<TreeItemIndex, AnimationItem>>({});
  const fileRef = useRef<GeppettoImage>(newFile());

  useMemo(() => {
    populateTree(file, fileRef.current, treeItemsRef);
    fileRef.current = file;
  }, [file]);
  return treeItemsRef.current;
};
