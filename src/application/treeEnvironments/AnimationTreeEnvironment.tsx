import { useCallback, useState } from "react";
import { DraggingPosition } from "react-complex-tree";
import { isRootNode, moveInHierarchy } from "../../animation/file2/hierarchy";
import {
  TreeData,
  TreeItem,
  TreeItemIndex,
  TreeEnvironment,
} from "../../ui-components";
import { UseState } from "../types";
import { useFile } from "../contexts/FileContext";
import useEvent from "../hooks/useEvent";
import { useAnimationTreeItems } from "./useAnimationTreeItems";

type AnimationTreeEnvironmentProps = {
  selectedItemsState: UseState<string[]>;
  treeId: string;
  children: React.ReactElement | React.ReactElement[] | null;
};

type ControlItem = TreeItem<TreeData<"animation" | "animationFolder">>;
const yes = () => true;

export const AnimationTreeEnvironment: React.FC<AnimationTreeEnvironmentProps> =
  ({ selectedItemsState, treeId, children }) => {
    const [file, setFile] = useFile();
    const [selectedItems, setSelectedItems] = selectedItemsState;
    const [focusedItem, setFocusedItem] =
      useState<string | undefined>(undefined);

    const canDropAt = useCallback(
      (_items: ControlItem[], target: DraggingPosition) => {
        // target cannot be a layer (only for mutations)
        if (target.targetType === "item") {
          const targetItem = file.animationHierarchy[target.targetItem];
          return (
            targetItem.type === "animationFolder" || targetItem.type === "root"
          );
        }
        return true;
      },
      [file]
    );

    const onDrop = useCallback(
      (items: ControlItem[], target: DraggingPosition) => {
        items.reverse();
        const updatedItems: string[] = [];
        if (target.targetType === "item") {
          const targetId = `${target.targetItem}`;
          updatedItems.push(targetId);
          setFile((fileData) => {
            const result = { ...fileData };
            for (const item of items) {
              result.animationHierarchy = moveInHierarchy(
                result.animationHierarchy,
                `${item.index}`,
                { parent: targetId }
              );
              const node = fileData.animationHierarchy[`${item.index}`];
              if (!isRootNode(node)) {
                updatedItems.push(node.parentId);
              }
            }
            return result;
          });
        } else {
          setFile((fileData) => {
            const parent = fileData.animationHierarchy[`${target.parentItem}`];
            if (!parent.children) {
              return fileData;
            }
            const childIds = parent.children;
            const targetId =
              target.linePosition === "bottom"
                ? childIds[target.childIndex - 1]
                : childIds[target.childIndex];

            const result = { ...fileData };
            for (const item of items) {
              result.animationHierarchy = moveInHierarchy(
                result.animationHierarchy,
                `${item.index}`,
                target.linePosition === "bottom"
                  ? { after: targetId }
                  : { before: targetId }
              );
              const dest = result.animationHierarchy[`${item.index}`];
              if (!isRootNode(dest)) {
                updatedItems.push(dest.parentId);
              }
              const source = fileData.animationHierarchy[`${item.index}`];
              if (!isRootNode(source)) {
                updatedItems.push(source.parentId);
              }
            }

            return result;
          });
        }
      },
      [setFile]
    );

    const items = useAnimationTreeItems(file);
    return (
      <TreeEnvironment
        items={items}
        onSelectItems={useCallback(
          (items: TreeItemIndex[]) => {
            const ids = items.map((e) => `${e}`);
            setSelectedItems(ids);
          },
          [setSelectedItems]
        )}
        canRename={true}
        canDrag={yes}
        canDropAt={canDropAt}
        canDragAndDrop={true}
        canReorderItems={true}
        //   onRenameItem={useCallback(
        // (item: ControlItem, newName: string) => {
        //   setFile((fileData) =>
        //     rename(fileData, `${item.index}`, item.data.type, newName)
        //   );
        //   treeData.addChangedId && treeData.addChangedId(`${item.index}`);
        // },
        // [setFile, treeData]
        //   )}
        onDrop={onDrop}
        onFocusItem={useEvent((item: ControlItem) => {
          setFocusedItem(`${item.index}`);
        })}
        canDropOnItemWithChildren={true}
        canDropOnItemWithoutChildren={true}
        viewState={{
          [treeId]: {
            expandedItems: [], // TODO: expand when folders get supported
            selectedItems,
            focusedItem,
          },
        }}
      >
        {children}
      </TreeEnvironment>
    );
  };
