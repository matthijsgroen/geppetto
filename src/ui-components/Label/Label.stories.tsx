import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Label as LabelElement } from "./Label";

export default {
  title: "Elements/Label",
  component: LabelElement,
} as ComponentMeta<typeof LabelElement>;

const Template: ComponentStory<typeof LabelElement> = (args) => (
  <LabelElement {...args} />
);

export const Label = Template.bind({});
Label.args = {
  children: "️Hello world",
};
