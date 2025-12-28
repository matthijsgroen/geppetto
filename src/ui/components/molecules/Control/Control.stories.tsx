import preview from "@sb/preview";

import { NumberInput } from "@/ui/components/atoms/NumberInput/NumberInput";
import { RangeInput } from "@/ui/components/atoms/RangeInput/RangeInput";
import { ToggleInput } from "@/ui/components/atoms/ToggleInput/ToggleInput";
import { ControlPanel } from "@/ui/components/molecules/ControlPanel/ControlPanel";

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
    children: <NumberInput htmlId="InputField" prefix="x:" value={10} />,
  },
});

export const VectorControl = meta.story({
  args: {
    children: [
      <NumberInput htmlId="InputField" key="x" prefix="x:" value={10} />,
      <NumberInput key="y" prefix="y:" value={10} />,
    ],
  },
});

export const SliderControl = meta.story({
  args: {
    children: <RangeInput id="InputField" value={10} />,
  },
});

export const ToggleControl = meta.story({
  args: {
    children: <ToggleInput checked id="InputField" />,
  },
});
