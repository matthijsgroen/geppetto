import preview from "#.storybook/preview";

import { Icon, ToolButton } from "../..";
import {
  storyTreeItems,
  type ToolsProvider,
} from "./storybookTreeDataProvider";
import { Tree } from "./Tree";
import { TreeEnvironment } from "./TreeEnvironment";

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton icon={<Icon>👁</Icon>} />
      </>
    );
  }
};

const meta = preview.meta({
  title: "Organisms/Tree",
  component: Tree,
  args: {
    treeId: "tree-1",
  },
  decorators: [
    (Story) => (
      <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
        <Story />
      </TreeEnvironment>
    ),
  ],
});
export default meta;

export const Default = meta.story();
