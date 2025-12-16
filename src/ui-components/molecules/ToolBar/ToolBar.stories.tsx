import { ToolBar } from "./ToolBar";
import { Icon } from "../../atoms/Icon/Icon";
import { ToolButton } from "../../atoms/ToolButton/ToolButton";
import { ToolSeparator } from "../../atoms/ToolSeparator/ToolSeparator";
import { ToolSpacer } from "../../atoms/ToolSpacer/ToolSpacer";
import { ToolTab } from "../../atoms/ToolTab/ToolTab";
import preview from "#.storybook/preview";

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
      <ToolTab label={"Canvas"} active={true} key={"tab0"} />,
      <ToolButton icon={<Icon>💡</Icon>} key={0} />,
      <ToolButton active={true} icon={<Icon>🎓</Icon>} key={1} />,
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
