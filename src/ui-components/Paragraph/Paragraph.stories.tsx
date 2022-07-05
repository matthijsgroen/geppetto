import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Paragraph as ParagraphElement } from "./Paragraph";

export default {
  title: "Elements/Paragraph",
  component: ParagraphElement,
} as ComponentMeta<typeof ParagraphElement>;

const Template: ComponentStory<typeof ParagraphElement> = (args) => (
  <ParagraphElement {...args} />
);

export const Paragraph = Template.bind({});
Paragraph.args = {
  children: "️Hello world",
};
