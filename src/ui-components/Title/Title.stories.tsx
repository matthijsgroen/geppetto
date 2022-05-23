import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Title as TitleElement } from "./Title";

export default {
  title: "Elements/Title",
  component: TitleElement,
} as ComponentMeta<typeof TitleElement>;

const Template: ComponentStory<typeof TitleElement> = (args) => (
  <TitleElement {...args} />
);

export const Title = Template.bind({});
Title.args = {
  children: "️Hello world",
};
