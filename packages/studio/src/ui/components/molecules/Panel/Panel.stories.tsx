import preview from "@sb/preview";

import { Panel as PanelComponent } from "./Panel";

const meta = preview.meta({
  title: "Molecules/Panel",
  component: PanelComponent,
  argTypes: {
    children: { control: false },
    padding: {
      control: { type: "radio" },
      options: ["none", "sm", "md"],
      mapping: {
        none: undefined,
        sm: "sm",
        md: "md",
      },
    },
  },
  args: {
    padding: "sm",
    workspace: false,
    scrollable: false,
    center: false,
    fitContent: false,
  },
});
export default meta;

export const Panel = meta.story({
  args: {
    children: "Lorem Ipsum",
  },
});
