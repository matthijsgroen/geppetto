import { useMemo, useRef } from "react";
import { iconMapping } from "../../animation/file2/mutation";
import { newFile } from "../../animation/file2/new";
import { GeppettoImage, NodeType } from "../../animation/file2/types";
import {
  Icon,
  ToolButton,
  TreeData,
  TreeItem,
  TreeItemIndex,
} from "../../ui-components";
import { TREE_ROOT } from "../../ui-components/Tree/Tree";

export type LayerItem = TreeItem<
  TreeData<"layer" | "layerFolder" | "mutation">
>;

export type ActionButton = "visibility";

const populateTree = (
  newFile: GeppettoImage,
  previousFile: GeppettoImage,
  result: Record<TreeItemIndex, LayerItem>,
  actionHandler: (nodeId: string, button: ActionButton) => void,
  showMutations: boolean,
  toggleVisibility: boolean
) => {
  const hierarchy = newFile.layerHierarchy;

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

  const populateNode = (nodeId: string) => {
    const item = hierarchy[nodeId];
    const childIds = (item.children || []).filter(
      (childId) => showMutations || hierarchy[childId].type !== "mutation"
    );
    if (!changedNodes.includes(nodeId)) {
      for (const childId of childIds) {
        populateNode(childId);
      }
      return;
    }

    if (item.type === "root") {
      result[nodeId] = {
        index: nodeId,
        canMove: false,
        hasChildren: true,
        children: childIds,
        data: {
          name: "Root",
          icon: "",
          type: "layerFolder",
        },
        canRename: false,
      };
    }
    if (item.type === "layer") {
      const layerData = newFile.layers[nodeId];
      const data: TreeData<NodeType> = {
        name: layerData.name,
        icon: "📄",
        type: item.type,
      };
      if (toggleVisibility) {
        data.itemTools = (
          <ToolButton
            size="small"
            icon={<Icon>👁</Icon>}
            active={layerData.visible}
            onClick={() => {
              actionHandler(`${nodeId}`, "visibility");
            }}
          />
        );
      }
      result[nodeId] = {
        index: nodeId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data,
        canRename: true,
      };
    }
    if (item.type === "layerFolder") {
      const layerFolderData = newFile.layerFolders[nodeId];
      const data: TreeData<NodeType> = {
        name: layerFolderData.name,
        icon: "📁",
        type: item.type,
      };
      if (toggleVisibility) {
        data.itemTools = (
          <ToolButton
            size="small"
            icon={<Icon>👁</Icon>}
            active={layerFolderData.visible}
            onClick={() => {
              actionHandler(`${nodeId}`, "visibility");
            }}
          />
        );
      }
      result[nodeId] = {
        index: nodeId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data,
        canRename: true,
      };
    }
    if (item.type === "mutation") {
      const mutationData = newFile.mutations[nodeId];
      result[nodeId] = {
        index: nodeId,
        canMove: true,
        hasChildren: childIds.length > 0,
        children: childIds,
        data: {
          name: mutationData.name,
          icon: iconMapping[mutationData.type],
          type: "mutation",
        },
        canRename: true,
      };
    }
    for (const childId of childIds) {
      populateNode(childId);
    }
  };

  populateNode(TREE_ROOT);
};

export const useLayerTreeItems = (
  file: GeppettoImage,
  actionHandler: (nodeId: string, button: ActionButton) => void,
  showMutations: boolean,
  toggleVisibility: boolean
) => {
  const treeItemsRef = useRef<Record<TreeItemIndex, LayerItem>>({});
  const fileRef = useRef<GeppettoImage>(newFile());

  useMemo(() => {
    populateTree(
      file,
      fileRef.current,
      treeItemsRef.current,
      actionHandler,
      showMutations,
      toggleVisibility
    );
    fileRef.current = file;
  }, [file, toggleVisibility, showMutations, actionHandler]);
  return treeItemsRef.current;
};
