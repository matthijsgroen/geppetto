import { useCallback, useEffect, useMemo } from "react";
import { DraggingPosition } from "react-complex-tree";
import { isRootNode, moveInHierarchy } from "../../animation/file2/hierarchy";
import { newFile } from "../../animation/file2/new";
import { rename } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import {
  TreeData,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from "../../ui-components";
import { treeDataProvider } from "./LayerTreeDataProvider";
import { UseState } from "../types";

type LayerTreeEnvironmentProps = {
  fileState: UseState<GeppettoImage>;
  selectedItemsState: UseState<string[]>;
  showMutations?: boolean;
  children: React.ReactElement | React.ReactElement[] | null;
};

type LayerItem = TreeItem<TreeData<"layer" | "layerFolder" | "mutation">>;
const yes = () => true;

export const LayerTreeEnvironment: React.FC<LayerTreeEnvironmentProps> = ({
  children,
  fileState,
  selectedItemsState,
  showMutations = false,
}) => {
  const [fileData, setFileData] = fileState;
  const [, setSelectedItems] = selectedItemsState;

  const treeData = useMemo(
    () => treeDataProvider(newFile(), { showMutations }),
    [showMutations]
  );
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(fileData);
  }, [fileData, treeData]);

  const canDropAt = useCallback(
    (_items: LayerItem[], target: DraggingPosition) => {
      // target cannot be a layer (only for mutations)
      if (target.targetType === "item") {
        const targetItem = fileData.layerHierarchy[target.targetItem];
        return targetItem.type === "layerFolder" || targetItem.type === "root";
      }
      return true;
    },
    [fileData]
  );

  const onDrop = useCallback(
    (items: LayerItem[], target: DraggingPosition) => {
      items.reverse();
      const updatedItems: string[] = [];
      if (target.targetType === "item") {
        const targetId = `${target.targetItem}`;
        updatedItems.push(targetId);
        setFileData((fileData) => {
          const result = { ...fileData };
          for (const item of items) {
            if (result.layerHierarchy[item.index].type === "mutation") continue;

            result.layerHierarchy = moveInHierarchy(
              result.layerHierarchy,
              `${item.index}`,
              { parent: targetId }
            );
            const node = fileData.layerHierarchy[`${item.index}`];
            if (!isRootNode(node)) {
              updatedItems.push(node.parentId);
            }
          }
          return result;
        });
      } else {
        setFileData((fileData) => {
          const parent = fileData.layerHierarchy[`${target.parentItem}`];
          if (!parent.children) {
            return fileData;
          }
          const childIds = parent.children.filter(
            (id) => fileData.layerHierarchy[id].type !== "mutation"
          );
          const targetId =
            target.linePosition === "bottom"
              ? childIds[target.childIndex - 1]
              : childIds[target.childIndex];

          const result = { ...fileData };
          for (const item of items) {
            if (result.layerHierarchy[item.index].type === "mutation") continue;
            result.layerHierarchy = moveInHierarchy(
              result.layerHierarchy,
              `${item.index}`,
              target.linePosition === "bottom"
                ? { after: targetId }
                : { before: targetId }
            );
            const dest = result.layerHierarchy[`${item.index}`];
            if (!isRootNode(dest)) {
              updatedItems.push(dest.parentId);
            }
            const source = fileData.layerHierarchy[`${item.index}`];
            if (!isRootNode(source)) {
              updatedItems.push(source.parentId);
            }
          }

          return result;
        });
      }
      treeData.addChangedId && treeData.addChangedId(...updatedItems);
    },
    [treeData, setFileData]
  );

  return (
    <UncontrolledTreeEnvironment
      dataProvider={treeData}
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
      onRenameItem={useCallback(
        (item: LayerItem, newName: string) => {
          setFileData((fileData) =>
            rename(fileData, `${item.index}`, item.data.type, newName)
          );
          treeData.addChangedId && treeData.addChangedId(`${item.index}`);
        },
        [setFileData, treeData]
      )}
      onDrop={onDrop}
      canDropOnItemWithChildren={true}
      canDropOnItemWithoutChildren={true}
    >
      {children}
    </UncontrolledTreeEnvironment>
  );
};
