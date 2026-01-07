import type { RefObject } from "react";
import React, { useEffect, useRef } from "react";

import { useAppInstall } from "@/application/state/hooks/useAppInstall";
import {
  ControlledMenu,
  Icon,
  Label,
  ToolButton,
  useMenuState,
} from "@/ui/components";

export const InstallToolButton: React.FC = () => {
  const anchor = useRef<HTMLButtonElement>(null);
  const [{ state }, toggleMenu] = useMenuState();
  const [canInstall, installer] = useAppInstall();
  useEffect(() => {
    toggleMenu(true);
    const timer = setTimeout(() => {
      toggleMenu(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toggleMenu]);

  return canInstall ? (
    <>
      <ToolButton
        icon={<Icon>🖥</Icon>}
        onClick={installer}
        ref={anchor}
        tooltip="Install Geppetto as desktop application"
      />
      <ControlledMenu
        anchorRef={anchor as RefObject<HTMLElement>}
        arrow
        captureFocus={false}
        portal
        position="anchor"
        role="tooltip"
        state={state}
      >
        <Label>Install Geppetto as desktop application</Label>
      </ControlledMenu>
    </>
  ) : null;
};
