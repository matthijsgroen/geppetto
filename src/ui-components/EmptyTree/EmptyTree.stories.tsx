import { ComponentStory, ComponentMeta } from "@storybook/react";
import { EmptyTree } from "./EmptyTree";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/EmptyTree",
  component: EmptyTree,
  args: {},
} as ComponentMeta<typeof EmptyTree>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EmptyTree> = (args) => (
  <EmptyTree {...args} />
);

export const Default = Template.bind({});
