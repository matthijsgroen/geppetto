import { Control } from "../../molecules/Control/Control";
import { NumberInput } from "./NumberInput";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Atoms/Controls/NumberInput",
  component: NumberInput,
  args: {
    prefix: "x:",
    htmlId: "InputField",
    value: 10,
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

export const VectorControl = meta.story({
  decorators: [
    (Story) => (
      <>
        <Story />
        <NumberInput key={"y"} value={10} prefix="y:" />
      </>
    ),
  ],
});
