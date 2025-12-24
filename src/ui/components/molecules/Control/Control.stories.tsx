import preview from "@sb/preview";

import { NumberInput } from "@/ui/components/atoms/NumberInput/NumberInput";
import { RangeInput } from "@/ui/components/atoms/RangeInput/RangeInput";
import { ToggleInput } from "@/ui/components/atoms/ToggleInput/ToggleInput";

import { ControlPanel } from "../ControlPanel/ControlPanel";
import { Control as ControlComponent } from "./Control";

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
      <NumberInput key="x" value={10} prefix="x:" htmlId="InputField" />,
      <NumberInput key="y" value={10} prefix="y:" />,
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
