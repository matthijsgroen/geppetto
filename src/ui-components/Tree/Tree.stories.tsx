import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon, ToolButton } from "..";
import {
  storyTreeDataProvider,
  ToolsProvider,
} from "./storybookTreeDataProvider";
import { Tree } from "./Tree";
import { UncontrolledTreeEnvironment } from "./UncontrolledTreeEnvironment";

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
  <UncontrolledTreeEnvironment
    dataProvider={storyTreeDataProvider(toolsProvider)}
  >
    <Tree {...args} />
  </UncontrolledTreeEnvironment>
);

export const Default = Template.bind({});
