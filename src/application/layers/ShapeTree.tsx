import { useCallback, useEffect, useMemo } from "react";
import { GeppettoImage } from "../../animation/file2/types";
import {
  Icon,
  Panel,
  ToolBar,
  ToolButton,
  Tree,
  UncontrolledTreeEnvironment,
} from "../../ui-components";
import { UseState } from "../types";
import { treeDataProvider } from "./TreeDataProvider";

type ShapeTreeProps = {
  fileState: UseState<GeppettoImage>;
};

export const ShapeTree: React.VFC<ShapeTreeProps> = ({ fileState }) => {
  const [fileData] = fileState;

  const treeData = useMemo(
    () => treeDataProvider(fileData, { showMutations: false }),
    []
  );
  useEffect(() => {
    treeData.updateActiveTree && treeData.updateActiveTree(fileData);
  }, [fileData]);
  const addShape = useCallback(() => {
    console.log("Add shape");
  }, []);

  return (
    <div>
      <UncontrolledTreeEnvironment dataProvider={treeData}>
        <ToolBar size="small">
          <ToolButton
            icon={<Icon>📄</Icon>}
            label="+"
            tooltip="Add layer"
            onClick={addShape}
            onKeyDown={addShape}
          />
          {/* 
              <ToolButton
                icon={<Icon>📁</Icon>}
                label="+"
                tooltip="Add folder"
              />
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
    </div>
  );
};
