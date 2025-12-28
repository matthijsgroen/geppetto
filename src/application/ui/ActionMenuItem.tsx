import { type ComponentProps } from "react";

import { type Action } from "@/application/state/hooks/useActionMap";
import { MenuItem } from "@/ui/components";

type Props = {
  action: Action;
} & Omit<ComponentProps<typeof MenuItem>, "shortcut" | "children" | "onClick">;

export const ActionMenuItem: React.FC<Props> = ({ action, ...props }) => (
  <MenuItem {...props} onClick={action.handler} shortcut={action.shortcut}>
    {action.caption}
  </MenuItem>
);
