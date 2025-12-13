import { Icon, ToolButton } from "..";
import { storyTreeItems, ToolsProvider } from "./storybookTreeDataProvider";
import { Tree } from "./Tree";
import { TreeEnvironment } from "./TreeEnvironment";
import { Meta, StoryObj } from "@storybook/react-vite";

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton icon={<Icon>👁</Icon>} />
      </>
    );
  }
};

const meta = {
  title: "Components/Tree",
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
} as Meta<typeof Tree>;
export default meta;

type Story = StoryObj<typeof Tree>;

export const Default: Story = {};
