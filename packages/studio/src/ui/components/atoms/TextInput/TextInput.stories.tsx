import preview from "@sb/preview";

import { Control } from "@/ui/components/molecules/Control/Control";

import { TextInput as TextInputComponent } from "./TextInput";

const meta = preview.meta({
  title: "Atoms/Controls/TextInput",
  component: TextInputComponent,
  argTypes: {
    type: { control: false },
    size: {
      control: { type: "radio" },
      options: ["default", "small"],
    },
    align: {
      control: { type: "radio" },
      options: ["left", "right", "center"],
    },
  },
  args: {
    placeholder: "Enter text...",
    size: "default",
    align: "left",
    transparent: false,
  },
});

export default meta;

export const StandAlone = meta.story({
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
});

export const InControl = meta.story({
  decorators: [
    (Story) => (
      <Control label="Name">
        <Story />
      </Control>
    ),
  ],
});
