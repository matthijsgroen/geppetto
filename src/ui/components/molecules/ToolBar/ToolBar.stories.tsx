import preview from "@sb/preview";

import { Icon } from "@/ui/components/atoms/Icon/Icon";
import { ToolButton } from "@/ui/components/atoms/ToolButton/ToolButton";
import { ToolSeparator } from "@/ui/components/atoms/ToolSeparator/ToolSeparator";
import { ToolSpacer } from "@/ui/components/atoms/ToolSpacer/ToolSpacer";
import { ToolTab } from "@/ui/components/atoms/ToolTab/ToolTab";

import { ToolBar } from "./ToolBar";

const meta = preview.meta({
  title: "Molecules/ToolBar",
  component: ToolBar,
  argTypes: {
    children: { control: false },
    size: { control: "radio", options: ["default", "small"] },
    vertical: { control: "boolean" },
  },
  args: {
    size: "default",
    vertical: false,
    children: [
      <ToolTab active key="tab0" label="Canvas" />,
      <ToolButton icon={<Icon>💡</Icon>} key={0} />,
      <ToolButton active icon={<Icon>🎓</Icon>} key={1} />,
      <ToolSeparator key={2} />,
      <ToolButton icon={<Icon>🧲</Icon>} key={3} />,
      <ToolButton icon={<Icon>🧵</Icon>} key={4} />,
      <ToolSpacer key={5} />,
      <ToolButton icon={<Icon>🚧</Icon>} key={6} />,
    ],
  },
});
export default meta;

export const Default = meta.story({
  args: { size: "default" },
});

export const Small = meta.story({
  args: { size: "small" },
});

export const Narrow = meta.story({
  decorators: [
    (Story) => (
      <div style={{ width: "200px" }}>
        <Story />
      </div>
    ),
  ],
});
