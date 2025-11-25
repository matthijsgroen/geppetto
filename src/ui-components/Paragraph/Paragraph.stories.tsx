import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-webpack5";
import { Paragraph as ParagraphElement } from "./Paragraph";

export default {
  title: "Elements/Paragraph",
  component: ParagraphElement,
  args: {
    selectable: true,
    size: "default",
  },
} as ComponentMeta<typeof ParagraphElement>;

const Template: ComponentStory<typeof ParagraphElement> = (args) => (
  <ParagraphElement {...args} />
);

export const Paragraph = Template.bind({});
Paragraph.args = {
  children: "️Hello world",
};
