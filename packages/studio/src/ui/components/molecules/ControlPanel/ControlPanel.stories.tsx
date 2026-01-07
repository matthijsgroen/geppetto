import preview from "@sb/preview";
import { type ComponentProps } from "react";

import { ToggleInput } from "@/ui/components/atoms/ToggleInput/ToggleInput";
import { Control } from "@/ui/components/molecules/Control/Control";

import { ControlPanel as ControlPanelComponent } from "./ControlPanel";

type StoryProps = ComponentProps<typeof ControlPanelComponent> & {
  extraControlCount: number;
};

const meta = preview.meta({
  title: "Molecules/ControlPanel",
  component: ControlPanelComponent,
  argTypes: {
    children: { control: false },
    extraControlCount: { control: "number" },
  },
  args: {
    shadow: false,
    extraControlCount: 2,
  },
  render: ({ extraControlCount, children, ...args }: StoryProps) => (
    <div className="max-w-60">
      <ControlPanelComponent {...args}>
        {children}
        {Array.from({ length: extraControlCount ?? 0 }).map((_, index) => (
          <Control key={index} label={`Extra Field ${index + 1}`}>
            <ToggleInput />
          </Control>
        ))}
      </ControlPanelComponent>
    </div>
  ),
});
export default meta;

export const ControlPanel = meta.story({
  args: {
    children: [
      <Control key="field1" label="Hello">
        <ToggleInput />
      </Control>,
      <Control key="field2" label="Hello with a really really long name">
        <ToggleInput />
      </Control>,
    ],
  },
});
