import preview from "@sb/preview";

import { Control } from "@/ui/components/molecules/Control/Control";

import { ToggleInput } from "./ToggleInput";

const meta = preview.meta({
  title: "Atoms/Controls/ToggleInput",
  component: ToggleInput,
  args: {
    id: "InputField",
    checked: false,
  },
});
export default meta;

export const Standalone = meta.story();

export const InControl = meta.story({
  decorators: [
    (Story) => (
      <Control label="Label" htmlFor="InputField">
        <Story />
      </Control>
    ),
  ],
});
