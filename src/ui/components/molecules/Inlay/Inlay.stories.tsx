import preview from "@sb/preview";

import { Control } from "@/ui/components";
import { ControlPanel } from "@/ui/components/molecules/ControlPanel/ControlPanel";

import { Inlay } from "./Inlay";

const meta = preview.meta({
  title: "Molecules/Inlay",
  component: Inlay,
  argTypes: {
    children: { control: false },
  },
  args: {
    children: (
      <ControlPanel>
        <Control label="Inlay Control ">Input</Control>
      </ControlPanel>
    ),
  },
});
export default meta;

export const Default = meta.story();
