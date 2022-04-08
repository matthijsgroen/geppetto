import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Panel } from "./Panel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Panel",
  component: Panel,
  argTypes: {
    children: { control: false, table: false },
  },
} as ComponentMeta<typeof Panel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Panel> = (args) => <Panel {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Lorem Ipsum",
};
