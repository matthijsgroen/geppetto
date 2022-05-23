import { useCallback, useEffect, useMemo } from "react";
import { DraggingPosition } from "react-complex-tree";
import { isRootNode, moveInHierarchy } from "../../animation/file2/hierarchy";
import { newFile } from "../../animation/file2/new";
import {
  TreeData,
  TreeItem,
  TreeItemIndex,
  TreeEnvironment,
} from "../../ui-components";
import { treeDataProvider } from "./ControlTreeDataProvider";
import { UseState } from "../types";
import { useFile } from "../applicationMenu/FileContext";

type ControlTreeEnvironmentProps = {
  selectedItemsState: UseState<string[]>;
  children: React.ReactElement | React.ReactElement[] | null;
};

type ControlItem = TreeItem<TreeData<"control" | "controlFolder">>;
const yes = () => true;

export const ControlTreeEnvironment: React.FC<ControlTreeEnvironmentProps> = ({
  children,
  selectedItemsState,
}) => {
  const [file, setFile] = useFile();
  const [, setSelectedItems] = selectedItemsState;

  const treeData = useMemo(() => treeDataProvider(newFile()), []);
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(file);
  }, [file, treeData]);

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
      treeData.addChangedId && treeData.addChangedId(...updatedItems);
    },
    [treeData, setFile]
  );

  return (
    <TreeEnvironment
      items={{}}
      viewState={{}}
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
      canDropOnItemWithChildren={true}
      canDropOnItemWithoutChildren={true}
    >
      {children}
    </TreeEnvironment>
  );
};
