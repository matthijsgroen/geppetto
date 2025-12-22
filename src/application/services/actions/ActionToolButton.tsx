import { type ComponentProps } from "react";

import { type Action } from "@/application/state/hooks/useActionMap";
import { Icon, shortcutStr,ToolButton } from "@/ui/components";

type Props = { action: Action } & Omit<
  ComponentProps<typeof ToolButton>,
  "onClick" | "tooltip" | "icon"
>;

export const ActionToolButton: React.FC<Props> = ({ action, ...props }) => (
  <ToolButton
    {...props}
    onClick={action.handler}
    icon={action.icon ? <Icon>{action.icon}</Icon> : undefined}
    tooltip={`${action.tooltip} ${shortcutStr(action.shortcut)}`}
  />
);
