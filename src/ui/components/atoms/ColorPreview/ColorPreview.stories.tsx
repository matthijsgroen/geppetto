import preview from "@sb/preview";

import { Control } from "@/ui/components/molecules/Control/Control";

import { ColorPreview } from "./ColorPreview";

const meta = preview.meta({
  title: "Atoms/Controls/ColorPreview",
  component: ColorPreview,
  args: {
    hue: 0.5,
    saturation: 0.8,
  },
});
export default meta;

export const Standalone = meta.story();

export const InControl = meta.story({
  decorators: [
    (Story) => (
      <Control htmlFor="InputField" label="Label">
        <Story />
      </Control>
    ),
  ],
});
