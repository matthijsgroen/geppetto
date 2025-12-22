import preview from "#.storybook/preview";

import { Paragraph as ParagraphElement } from "./Paragraph";

const meta = preview.meta({
  title: "Atoms/Paragraph",
  component: ParagraphElement,
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["small", "default"],
    },
  },
  args: {
    selectable: true,
    size: "default",
  },
});
export default meta;

export const Paragraph = meta.story({
  args: {
    children: "️Hello world",
  },
});
