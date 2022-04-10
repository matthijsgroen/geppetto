import { ComponentStory, ComponentMeta } from "@storybook/react";
import { storyTreeDataProvider } from "./storybookTreeDataProvider";
import { Tree } from "./Tree";
import { UncontrolledTreeEnvironment } from "./UncontrolledTreeEnvironment";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Tree",
  component: Tree,
} as ComponentMeta<typeof Tree>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tree> = (args) => (
  <UncontrolledTreeEnvironment dataProvider={storyTreeDataProvider}>
    <Tree {...args} />
  </UncontrolledTreeEnvironment>
);

export const Default = Template.bind({});
