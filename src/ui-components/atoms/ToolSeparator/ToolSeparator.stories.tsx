import preview from "#.storybook/preview";

import { ToolBar } from "../../molecules/ToolBar/ToolBar";
import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSeparator as ToolSeparatorComponent } from "./ToolSeparator";

const meta = preview.meta({
  title: "Atoms/ToolSeparator",
  component: ToolSeparatorComponent,
  render: () => (
    <ToolBar>
      <ToolButton icon={<Icon>💡</Icon>} />
      <ToolSeparatorComponent />
      <ToolButton icon={<Icon>🚨</Icon>} />
    </ToolBar>
  ),
});
export default meta;

export const ToolSeparator = meta.story();
