import { Control } from "../../molecules/Control/Control";
import { RangeInput } from "./RangeInput";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Atoms/Controls/RangeInput",
  component: RangeInput,
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
      <Control label={"Label"} htmlFor={"InputField"}>
        <Story />
      </Control>
    ),
  ],
});
