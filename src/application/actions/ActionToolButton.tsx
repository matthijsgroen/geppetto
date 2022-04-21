import { ComponentProps } from "react";
import { Icon, ToolButton } from "../../ui-components";
import { shortcutStr } from "../../ui-components/Menu/shortcut";
import { Action } from "../hooks/useActionMap";

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
