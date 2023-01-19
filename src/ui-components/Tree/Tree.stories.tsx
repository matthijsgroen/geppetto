import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { Panel } from "../Panel/Panel";
import { storyTreeItems, ToolsProvider } from "./storybookTreeDataProvider";
import { TreeEnvironment } from "./TreeEnvironment";
import { Tree as TreeComponent } from "./Tree";
import { ToolButton } from "../ToolButton/ToolButton";
import { Icon } from "../Icon/Icon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const story: ComponentMeta<typeof TreeComponent> = {
  title: "Components/Tree",
  component: TreeComponent,
  args: {
    treeId: "layers",
  },
};
export default story;

const toolsProvider: ToolsProvider = (data) => {
  if (data.type === "layer" || data.type === "layerFolder") {
    return (
      <>
        <ToolButton icon={<Icon>👁</Icon>} />
      </>
    );
  }
  return null;
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TreeComponent> = (args) => (
  <Panel>
    {/* <TreeEnvironment items={storyTreeItems(toolsProvider)} viewState={{}}>
      <TreeComponent {...args} />
    </TreeEnvironment> */}
    <TreeEnvironment
      items={storyTreeItems(toolsProvider)}
      viewState={{ layers: {} }}
    >
      <TreeComponent {...args} />
    </TreeEnvironment>
  </Panel>
);

export const Tree = Template.bind({});
