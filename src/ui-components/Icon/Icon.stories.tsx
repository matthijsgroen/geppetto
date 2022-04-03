import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon as IconElement } from "./Icon";

export default {
  title: "Elements/Icon",
  component: IconElement,
} as ComponentMeta<typeof IconElement>;

const Template: ComponentStory<typeof IconElement> = (args) => (
  <IconElement {...args} />
);

export const Icon = Template.bind({});
Icon.args = {
  children: "️💡",
};
