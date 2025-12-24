import preview from "@sb/preview";

import { Icon } from "@/ui/components/atoms/Icon/Icon";
import { ToolButton } from "@/ui/components/atoms/ToolButton/ToolButton";
import { ToolBar } from "@/ui/components/molecules/ToolBar/ToolBar";

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
