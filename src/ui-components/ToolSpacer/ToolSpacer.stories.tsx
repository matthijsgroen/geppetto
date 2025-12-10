import { ToolBar } from "../ToolBar/ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSpacer as ToolSpacerComponent } from "./ToolSpacer";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/ToolSpacer",
  component: ToolSpacerComponent,
} satisfies Meta<typeof ToolSpacerComponent>;

export default meta;

type Story = StoryObj<typeof ToolSpacerComponent>;

export const ToolSpacer: Story = {
  render: () => (
    <div style={{ width: "100%" }}>
      <ToolBar>
        <ToolButton icon={<Icon>💡</Icon>} />
        <ToolSpacerComponent />
        <ToolButton icon={<Icon>🚨</Icon>} />
      </ToolBar>
    </div>
  ),
};
