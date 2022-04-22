import { useEffect, useRef, useState } from "react";
import {
  Icon,
  ToolButton,
  ControlledMenu,
  useMenuState,
  Label,
} from "../../ui-components";

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt: () => Promise<void>;
}

let deferredInstallPrompt: BeforeInstallPromptEvent;
let notifyInstallReady: (() => void)[] = [];

window.addEventListener("beforeinstallprompt", (event: Event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();
  deferredInstallPrompt = event as BeforeInstallPromptEvent;
  const params = new URLSearchParams(window.location.search);
  if (params.get("utm_source") !== "app") {
    notifyInstallReady.forEach((l) => l());
  }
});

export const InstallToolButton: React.FC = () => {
  const anchor = useRef(null);
  const [canInstall, setCanInstall] = useState<boolean>(
    !!deferredInstallPrompt
  );
  useEffect(() => {
    const listener = () => {
      setCanInstall(true);
    };
    notifyInstallReady = notifyInstallReady.concat(listener);
    return () => {
      notifyInstallReady = notifyInstallReady.filter((l) => l !== listener);
    };
  }, [setCanInstall]);
  const [{ state }, toggleMenu] = useMenuState();
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
        onClick={() => {
          deferredInstallPrompt.prompt();
        }}
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
