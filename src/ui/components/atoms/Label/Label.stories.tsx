import preview from "@sb/preview";

import { Label as LabelElement } from "./Label";

const meta = preview.meta({
  title: "Atoms/Label",
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
});
export default meta;

export const Label = meta.story({});
