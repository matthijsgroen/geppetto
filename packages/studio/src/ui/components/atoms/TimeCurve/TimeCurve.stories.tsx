import preview from "@sb/preview";

import { TimeCurve as TimeCurveComponent } from "./TimeCurve";

const meta = preview.meta({
  title: "Atoms/TimeCurve",
  component: TimeCurveComponent,
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "easeIn", "easeOut", "easeInOut"],
    },
    size: {
      control: "radio",
      options: ["flex", "option"],
    },
    start: {
      control: "number",
      defaultValue: 0,
    },
    end: {
      control: "number",
      defaultValue: 1,
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex-1 bg-toolbar p-4">
        <Story />
      </div>
    ),
  ],
});

export default meta;

export const TimeCurve = meta.story({
  args: {
    variant: "easeInOut",
    size: "option",
    start: 0,
    end: 1,
  },
});
