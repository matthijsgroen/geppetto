import type { MenuState } from "@szhsin/react-menu";
import type { FC, PropsWithChildren } from "react";

import { ControlledMenu } from "@/ui/components";

type AnimationContextMenuProps = PropsWithChildren<{
  anchorPoint: { x: number; y: number };
  state?: MenuState;
  endTransition?: () => void;
  onClose: () => void;
}>;

export const AnimationContextMenu: FC<AnimationContextMenuProps> = ({
  onClose,
  children,
  ...menuProps
}) => {
  return (
    <ControlledMenu
      {...menuProps}
      menuStyle={{ fontSize: "1rem" }}
      onClose={onClose}
    >
      {children}
    </ControlledMenu>
  );
};
