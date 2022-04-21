import { ComponentProps } from "react";
import { MenuItem } from "../../ui-components";
import { shortcutStr } from "../../ui-components/Menu/shortcut";
import { Action } from "../hooks/useActionMap";

type Props = {
  action: Action;
} & Omit<ComponentProps<typeof MenuItem>, "shortcut" | "children" | "onClick">;

export const ActionMenuItem: React.FC<Props> = ({ action, ...props }) => (
  <MenuItem
    {...props}
    shortcut={shortcutStr(action.shortcut)}
    onClick={action.handler}
  >
    {action.caption}
  </MenuItem>
);
