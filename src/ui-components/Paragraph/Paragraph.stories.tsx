import { StoryObj, Meta } from "@storybook/react-vite";
import { Paragraph as ParagraphElement } from "./Paragraph";

const meta = {
  title: "Elements/Paragraph",
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
} satisfies Meta<typeof ParagraphElement>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Paragraph: Story = {
  args: {
    children: "️Hello world",
  },
};
