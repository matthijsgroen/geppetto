import { useCallback, useState } from "react";
import { type DraggingPosition } from "react-complex-tree";

import { useFile } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import {
  isRootNode,
  moveInHierarchy,
} from "@/domain/animation/file2/hierarchy";
import { rename } from "@/domain/animation/file2/shapes";
import {
  type TreeData,
  TreeEnvironment,
  type TreeItem,
  type TreeItemIndex,
} from "@/ui/components";

import { useControlTreeItems } from "./useControlTreeItems";

type ControlTreeEnvironmentProps = {
  selectedItems: string[];
  onSelectItems?: (controlIds: string[]) => void;
  treeId: string;
  children: React.ReactElement | React.ReactElement[] | null;
};

type ControlItem = TreeItem<TreeData<"control" | "controlFolder">>;
const yes = () => true;

export const ControlTreeEnvironment: React.FC<ControlTreeEnvironmentProps> = ({
  selectedItems,
  onSelectItems,
  treeId,
  children,
}) => {
  const [file, setFile] = useFile();
  const [focusedItem, setFocusedItem] = useState<string | undefined>(undefined);

  const canDropAt = useCallback(
    (_items: ControlItem[], target: DraggingPosition) => {
      // target cannot be a layer (only for mutations)
      if (target.targetType === "item") {
        const targetItem = file.controlHierarchy[target.targetItem];
        return (
          targetItem.type === "controlFolder" || targetItem.type === "root"
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
            result.controlHierarchy = moveInHierarchy(
              result.controlHierarchy,
              `${item.index}`,
              { parent: targetId }
            );
            const node = fileData.controlHierarchy[`${item.index}`];
            if (!isRootNode(node)) {
              updatedItems.push(node.parentId);
            }
          }
          return result;
        });
      } else {
        setFile((fileData) => {
          const parent = fileData.controlHierarchy[`${target.parentItem}`];
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
            result.controlHierarchy = moveInHierarchy(
              result.controlHierarchy,
              `${item.index}`,
              target.linePosition === "bottom"
                ? { after: targetId }
                : { before: targetId }
            );
            const dest = result.controlHierarchy[`${item.index}`];
            if (!isRootNode(dest)) {
              updatedItems.push(dest.parentId);
            }
            const source = fileData.controlHierarchy[`${item.index}`];
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

  const items = useControlTreeItems(file);
  return (
    <TreeEnvironment
      canDrag={yes}
      canDragAndDrop
      canDropAt={canDropAt}
      canDropOnItemWithChildren
      canDropOnItemWithoutChildren
      canRename
      canReorderItems
      items={items}
      onDrop={onDrop}
      onFocusItem={useEvent((item: ControlItem) => {
        setFocusedItem(`${item.index}`);
      })}
      onRenameItem={useCallback(
        (item: ControlItem, newName: string) => {
          setFile(rename(`${item.index}`, item.data.type, newName));
        },
        [setFile]
      )}
      onSelectItems={useCallback(
        (items: TreeItemIndex[]) => {
          const ids = items.map((e) => `${e}`);
          onSelectItems?.(ids);
        },
        [onSelectItems]
      )}
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
