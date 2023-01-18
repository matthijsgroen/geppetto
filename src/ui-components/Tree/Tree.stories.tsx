import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon, ToolButton } from "..";
import { storyTreeItems, ToolsProvider } from "./storybookTreeDataProvider";
import { Tree } from "./Tree";
import { TreeEnvironment } from "./TreeEnvironment";

jest.setTimeout(30_000);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Tree",
  component: Tree,
  args: {
    treeId: "tree-1",
  },
} as ComponentMeta<typeof Tree>;

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton icon={<Icon>👁</Icon>} />
      </>
    );
  }
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tree> = (args) => (
  <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
    <Tree {...args} />
  </TreeEnvironment>
);

export const Default = Template.bind({});
