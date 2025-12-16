import { ToolBar } from "../ToolBar/ToolBar";
import { Icon } from "../atoms/Icon/Icon";
import { ToolButton } from "../atoms/ToolButton/ToolButton";
import { ToolSeparator as ToolSeparatorComponent } from "./ToolSeparator";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/ToolSeparator",
  component: ToolSeparatorComponent,
} satisfies Meta<typeof ToolSeparatorComponent>;
export default meta;

type Story = StoryObj<typeof ToolSeparatorComponent>;

export const ToolSeparator: Story = {
  render: () => (
    <ToolBar>
      <ToolButton icon={<Icon>💡</Icon>} />
      <ToolSeparatorComponent />
      <ToolButton icon={<Icon>🚨</Icon>} />
    </ToolBar>
  ),
};
