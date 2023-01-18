import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon, Panel, ToolButton } from "..";
import { storyTreeItems, ToolsProvider } from "./storybookTreeDataProvider";
import { Tree as TreeComponent } from "./Tree";
import { TreeEnvironment } from "./TreeEnvironment";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Tree",
  component: TreeComponent,
  args: {
    treeId: "tree-1",
  },
} as ComponentMeta<typeof TreeComponent>;

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
const Template: ComponentStory<typeof TreeComponent> = (args) => (
  <Panel>
    {/* <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
      <Tree {...args} />
    </TreeEnvironment> */}
  </Panel>
);

export const Default = Template.bind({});
