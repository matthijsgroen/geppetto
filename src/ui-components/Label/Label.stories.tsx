import { Meta, StoryObj } from "@storybook/react-vite";
import { Label as LabelElement } from "./Label";

const meta = {
  title: "Elements/Label",
  component: LabelElement,
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["small", "default"],
    },
  },
  args: {
    children: "️Hello world",
    vertical: false,
    selectable: false,
    active: false,
    size: "default",
  },
} satisfies Meta<typeof LabelElement>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Label: Story = {};
