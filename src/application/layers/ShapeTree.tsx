import { useCallback, useEffect, useMemo, useState } from "react";
import { addFolder, addShape } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import {
  Icon,
  Panel,
  ToolBar,
  ToolButton,
  Tree,
  TreeData,
  TreeItem,
  UncontrolledTreeEnvironment,
} from "../../ui-components";
import { useToolAction } from "../hooks/useToolAction";
import { UseState } from "../types";
import { treeDataProvider } from "./TreeDataProvider";

type ShapeTreeProps = {
  fileState: UseState<GeppettoImage>;
};

export const ShapeTree: React.VFC<ShapeTreeProps> = ({ fileState }) => {
  const [fileData, setFileData] = fileState;
  const [focusedItem, setFocusedItem] = useState<TreeItem<TreeData> | null>(
    null
  );

  const treeData = useMemo(
    () => treeDataProvider(fileData, { showMutations: false }),
    []
  );
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(fileData);
  }, [fileData]);

  const addShapeAction = useToolAction(() => {
    const [updatedImage] = addShape(fileData, "New Shape");
    setFileData(updatedImage);
  }, [fileData]);

  const addFolderAction = useToolAction(() => {
    const [updatedImage] = addFolder(fileData, "New folder");
    setFileData(updatedImage);
  }, [fileData]);

  return (
    <>
      <UncontrolledTreeEnvironment
        dataProvider={treeData}
        onFocusItem={useCallback((item: TreeItem<TreeData>) => {
          setFocusedItem(item);
        }, [])}
      >
        <ToolBar size="small">
          <ToolButton
            icon={<Icon>📄</Icon>}
            label="+"
            tooltip="Add layer"
            onClick={addShapeAction}
            onKeyDown={addShapeAction}
          />
          <ToolButton
            icon={<Icon>📁</Icon>}
            label="+"
            tooltip="Add folder"
            onClick={addFolderAction}
            onKeyDown={addFolderAction}
          />
          {/* 
              <ToolButton
                icon={<Icon>📑</Icon>}
                disabled={true}
                tooltip="Copy layer"
              />
              <ToolButton
                icon={<Icon>🗑</Icon>}
                disabled={true}
                tooltip="Remove item"
              />
              <ToolButton
                icon={<Icon>⬆</Icon>}
                disabled={true}
                tooltip="Move item up"
              />
              <ToolButton
                icon={<Icon>⬇</Icon>}
                disabled={true}
                tooltip="Move item down"
              /> */}
        </ToolBar>
        <Panel padding={5}>{<Tree />}</Panel>
      </UncontrolledTreeEnvironment>
    </>
  );
};
