import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Panel as PanelElement } from "./Panel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Panel",
  component: PanelElement,
  argTypes: {
    children: { control: false, table: false },
  },
  args: {
    padding: 0,
    workspace: false,
    center: false,
  },
} as ComponentMeta<typeof PanelElement>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PanelElement> = (args) => (
  <PanelElement {...args} />
);

export const Panel = Template.bind({});
Panel.args = {
  children: "Lorem Ipsum",
};
