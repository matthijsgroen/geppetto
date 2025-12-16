import { Control as ControlComponent } from "./Control";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { NumberInput } from "../../atoms/NumberInput/NumberInput";
import preview from "#.storybook/preview";
import { ToggleInput } from "../../atoms/ToggleInput/ToggleInput";
import { RangeInput } from "../../atoms/RangeInput/RangeInput";

const meta = preview.meta({
  title: "Molecules/Control",
  component: ControlComponent,
  argTypes: {
    children: { control: false },
  },
  args: { label: "Label", htmlFor: "InputField" },
  decorators: [
    (Story) => (
      <div>
        <ControlPanel>
          <Story />
        </ControlPanel>
      </div>
    ),
  ],
});
export default meta;

export const NumberControl = meta.story({
  args: {
    children: <NumberInput value={10} prefix="x:" htmlId="InputField" />,
  },
});

export const VectorControl = meta.story({
  args: {
    children: [
      <NumberInput key={"x"} value={10} prefix="x:" htmlId="InputField" />,
      <NumberInput key={"y"} value={10} prefix="y:" />,
    ],
  },
});

export const SliderControl = meta.story({
  args: {
    children: <RangeInput value={10} id="InputField" />,
  },
});

export const ToggleControl = meta.story({
  args: {
    children: <ToggleInput checked id="InputField" />,
  },
});
