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
        tooltip="Install Geppetto as desktop application"
        onClick={installer}
        ref={anchor}
      />
      <ControlledMenu
        captureFocus={false}
        anchorRef={anchor as RefObject<HTMLElement>}
        portal
        position="anchor"
        arrow
        state={state}
        role="tooltip"
      >
        <Label>Install Geppetto as desktop application</Label>
      </ControlledMenu>
    </>
  ) : null;
};
