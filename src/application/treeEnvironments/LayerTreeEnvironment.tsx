import { useMemo, useState } from "react";
import { DraggingPosition } from "react-complex-tree";
import {
  isRootNode,
  moveInHierarchy,
  visit,
} from "../../animation/file2/hierarchy";
import { rename } from "../../animation/file2/shapes";
import {
  TreeData,
  TreeItem,
  TreeItemIndex,
  TreeEnvironment,
} from "../../ui-components";
import { UseState } from "../types";
import { useFile } from "../applicationMenu/FileContext";
import useEvent from "../hooks/useEvent";
import produce from "immer";
import { GeppettoImage, NodeType } from "../../animation/file2/types";
import { ActionButton, useLayerTreeItems } from "./useLayerTreeItems";
import { MutationControlContext } from "./mutationControlContext";

type LayerTreeEnvironmentProps = {
  selectedItemsState: UseState<string[]>;
  focusedItemState: UseState<string | undefined>;
  showMutations?: boolean;
  toggleVisibility?: boolean;
  editControlId?: string;
  treeId: string;
  children: React.ReactElement | React.ReactElement[] | null;
};

type LayerItem = TreeItem<TreeData<"layer" | "layerFolder" | "mutation">>;
const onlyOne = (items: unknown[]) => items.length === 1;

const openThroughFocusItem = (
  file: GeppettoImage,
  focusItem: string | undefined
): string[] => {
  if (!focusItem) return [];
  const result: string[] = [];

  let currentItem = file.layerHierarchy[focusItem];
  if (!currentItem) return [];
  while (!isRootNode(currentItem)) {
    result.push(currentItem.parentId);
    currentItem = file.layerHierarchy[currentItem.parentId];
  }

  return result;
};

export const LayerTreeEnvironment: React.FC<LayerTreeEnvironmentProps> = ({
  children,
  selectedItemsState,
  focusedItemState,
  treeId,
  editControlId,
  showMutations = false,
  toggleVisibility = false,
}) => {
  const [file, setFile] = useFile();
  const [selectedItems, setSelectedItems] = selectedItemsState;
  const [focusedItem, setFocusedItem] = focusedItemState;

  const actionButtonPress = useEvent(
    (itemId: string, buttonId: ActionButton) => {
      if (buttonId === "visibility") {
        setFile(
          produce((draft) => {
            const item = draft.layerHierarchy[itemId];
            if (item.type === "layer") {
              draft.layers[itemId].visible = !draft.layers[itemId].visible;
            }
            if (item.type === "layerFolder") {
              draft.layerFolders[itemId].visible =
                !draft.layerFolders[itemId].visible;
            }
          })
        );
      }
    }
  );

  const expandedFolders = useMemo(() => {
    const expanded: string[] = [];
    visit(file.layerHierarchy, (node, nodeId) => {
      if (node.type === "layerFolder") {
        const folderInfo = file.layerFolders[nodeId];
        if (!folderInfo.collapsed) {
          expanded.push(nodeId);
        }
      }
    });

    return expanded;
  }, [file.layerFolders, file.layerHierarchy]);
  const [expandedLayers, setExpandedLayers] = useState<string[]>([]);
  const focusedExpansions = openThroughFocusItem(file, focusedItem);

  const expandedItems = useMemo(
    () => expandedFolders.concat(expandedLayers).concat(focusedExpansions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedFolders.join(), expandedLayers.join(), focusedExpansions.join()]
  );

  const items = useLayerTreeItems(
    file,
    actionButtonPress,
    showMutations,
    toggleVisibility
    // expandedItems
  );

  const canDropAt = useEvent((items: LayerItem[], target: DraggingPosition) => {
    // target cannot be a layer (only for mutations)
    if (target.targetType === "item") {
      const targetItem = file.layerHierarchy[target.targetItem];
      if (targetItem.type === "layer" && items.length === 1) {
        const itemId = `${items[0].index}`;
        if (file.mutations[itemId]) {
          return true;
        }
      }
      return targetItem.type === "layerFolder" || targetItem.type === "root";
    }
    if (target.targetType === "between-items") {
      const parent = file.layerHierarchy[`${target.parentItem}`];
      if (!parent.children) {
        return false;
      }
      const childIds = showMutations
        ? parent.children
        : parent.children.filter(
            (id) => file.layerHierarchy[id].type !== "mutation"
          );
      const mutationCount = showMutations
        ? parent.children.filter(
            (id) => file.layerHierarchy[id].type === "mutation"
          ).length
        : 0;

      const targetId =
        target.linePosition === "bottom"
          ? childIds[target.childIndex - 1]
          : childIds[target.childIndex];
      const aligned = childIds[target.childIndex];

      if (
        items.every((item) => item.index === targetId || item.index === aligned)
      ) {
        return false;
      }

      if (
        items.every(
          (item) =>
            !file.mutations[item.index] && target.childIndex < mutationCount
        )
      ) {
        return false;
      }
    }
    return true;
  });

  const onDrop = useEvent((items: LayerItem[], target: DraggingPosition) => {
    items.reverse();
    if (target.targetType === "item") {
      const targetId = `${target.targetItem}`;
      setFile((fileData) => {
        const result = { ...fileData };
        for (const item of items) {
          result.layerHierarchy = moveInHierarchy(
            result.layerHierarchy,
            `${item.index}`,
            { parent: targetId }
          );
        }
        return result;
      });
    } else {
      // Between items
      const parent = file.layerHierarchy[`${target.parentItem}`];
      if (!parent.children) {
        return;
      }
      const childIds = showMutations
        ? parent.children
        : parent.children.filter(
            (id) => file.layerHierarchy[id].type !== "mutation"
          );
      const targetId =
        target.linePosition === "bottom"
          ? childIds[target.childIndex - 1]
          : childIds[target.childIndex];

      if (targetId === undefined) return;

      setFile((fileData) => {
        let hasChanges = false;
        const result = { ...fileData };
        for (const item of items) {
          if (item.index === targetId) continue;
          hasChanges = true;
          result.layerHierarchy = moveInHierarchy(
            result.layerHierarchy,
            `${item.index}`,
            target.linePosition === "bottom"
              ? { after: targetId }
              : { before: targetId }
          );
        }

        return hasChanges ? result : fileData;
      });
    }
  });

  return (
    <MutationControlContext editControlId={editControlId}>
      <TreeEnvironment
        items={items}
        onSelectItems={useEvent((items: TreeItemIndex[]) => {
          const ids = items.map((e) => `${e}`);
          setSelectedItems(ids);
        })}
        canRename={true}
        canDrag={onlyOne}
        canDropAt={canDropAt}
        canDragAndDrop={true}
        canReorderItems={true}
        onRenameItem={useEvent((item: LayerItem, newName: string) => {
          setFile((fileData) =>
            rename(fileData, `${item.index}`, item.data.type, newName)
          );
        })}
        onDrop={onDrop}
        onExpandItem={useEvent((item: TreeItem<TreeData<NodeType>>) => {
          const treeNode = file.layerHierarchy[item.index];
          if (treeNode.type === "layerFolder") {
            setFile(
              produce((draft) => {
                draft.layerFolders[item.index].collapsed = false;
              })
            );
          }
          if (treeNode.type === "layer") {
            setExpandedLayers((layers) => layers.concat(`${item.index}`));
          }
        })}
        onCollapseItem={useEvent((item: TreeItem<TreeData<NodeType>>) => {
          const treeNode = file.layerHierarchy[item.index];
          if (treeNode.type === "layerFolder") {
            setFile(
              produce((draft) => {
                draft.layerFolders[item.index].collapsed = true;
              })
            );
          }
          if (treeNode.type === "layer") {
            setExpandedLayers((layers) =>
              layers.filter((layer) => layer !== item.index)
            );
          }
        })}
        onFocusItem={useEvent((item: TreeItem<TreeData<NodeType>>) => {
          setFocusedItem(`${item.index}`);
        })}
        canDropOnItemWithChildren={true}
        canDropOnItemWithoutChildren={true}
        viewState={{
          [treeId]: {
            expandedItems,
            selectedItems,
            focusedItem,
          },
        }}
      >
        {children}
      </TreeEnvironment>
    </MutationControlContext>
  );
};
