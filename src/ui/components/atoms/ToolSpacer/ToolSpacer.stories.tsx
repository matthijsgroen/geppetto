import preview from "@sb/preview";

import { ToolBar } from "@/ui/components/molecules/ToolBar/ToolBar";

import { Icon } from "../Icon/Icon";
import { ToolButton } from "../ToolButton/ToolButton";
import { ToolSpacer as ToolSpacerComponent } from "./ToolSpacer";

const meta = preview.meta({
  title: "Atoms/ToolSpacer",
  component: ToolSpacerComponent,
  render: () => (
    <div className="w-full">
      <ToolBar>
        <ToolButton icon={<Icon>💡</Icon>} />
        <ToolSpacerComponent />
        <ToolButton icon={<Icon>🚨</Icon>} />
      </ToolBar>
    </div>
  ),
});
export default meta;

export const ToolSpacer = meta.story();
