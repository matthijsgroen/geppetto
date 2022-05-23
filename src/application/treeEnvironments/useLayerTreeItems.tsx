import { useMemo, useRef } from "react";
import { iconMapping } from "../../animation/file2/mutation";
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
  hierarchy: GeppettoImage["layerHierarchy"],
  mutations: GeppettoImage["mutations"],
  layers: GeppettoImage["layers"],
  folders: GeppettoImage["layerFolders"],
  result: Record<TreeItemIndex, LayerItem>,
  actionHandler: (nodeId: string, button: ActionButton) => void,
  showMutations: boolean,
  toggleVisibility: boolean
) => {
  const populateNode = (nodeId: string) => {
    const item = hierarchy[nodeId];

    const childIds = (item.children || []).filter(
      (childId) => showMutations || hierarchy[childId].type !== "mutation"
    );

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

      for (const childId of item.children) {
        populateNode(childId);
      }
      return;
    }
    if (item.type === "layer") {
      const layerData = layers[nodeId];
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
      const layerFolderData = folders[nodeId];
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
      const mutationData = mutations[nodeId];
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

  useMemo(() => {
    populateTree(
      file.layerHierarchy,
      file.mutations,
      file.layers,
      file.layerFolders,
      treeItemsRef.current,
      actionHandler,
      showMutations,
      toggleVisibility
    );
  }, [
    file.layerHierarchy,
    file.mutations,
    file.layers,
    file.layerFolders,
    toggleVisibility,
    showMutations,
    actionHandler,
  ]);
  return treeItemsRef.current;
};
