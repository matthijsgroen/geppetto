import { useEffect, useRef } from "react";
import {
  Icon,
  ToolButton,
  ControlledMenu,
  useMenuState,
  Label,
} from "../../ui-components";
import { useAppInstall } from "../hooks/useAppInstall";

export const InstallToolButton: React.FC = () => {
  const anchor = useRef(null);
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
        tooltip={"Install Geppetto as desktop application"}
        onClick={installer}
        ref={anchor}
      />
      <ControlledMenu
        captureFocus={false}
        anchorRef={anchor}
        portal
        position={"anchor"}
        arrow
        state={state}
        role="tooltip"
      >
        <Label>Install Geppetto as desktop application</Label>
      </ControlledMenu>
    </>
  ) : null;
};
