import { ToolBar } from "./ToolBar";
import { Icon } from "../atoms/Icon/Icon";
import { ToolButton } from "../atoms/ToolButton/ToolButton";
import { ToolSeparator } from "../ToolSeparator/ToolSeparator";
import { ToolSpacer } from "../ToolSpacer/ToolSpacer";
import { ToolTab } from "../ToolTab/ToolTab";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/ToolBar",
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
} satisfies Meta<typeof ToolBar>;
export default meta;

type Story = StoryObj<typeof ToolBar>;

export const Default: Story = {
  args: { size: "default" },
};

export const Small: Story = {
  args: { size: "small" },
};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "200px" }}>
        <Story />
      </div>
    ),
  ],
};
