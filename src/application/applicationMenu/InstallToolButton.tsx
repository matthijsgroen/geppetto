import { useEffect, useState } from "react";
import { Icon, ToolButton } from "../../ui-components";

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt: () => Promise<void>;
}

let deferedInstallPrompt: BeforeInstallPromptEvent;
let notifyInstallReady: (() => void)[] = [];

window.addEventListener("beforeinstallprompt", (event: Event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();
  deferedInstallPrompt = event as BeforeInstallPromptEvent;
  console.log("Before Install event!");
  notifyInstallReady.forEach((l) => l());
});

export const InstallToolButton: React.FC = () => {
  const [canInstall, setCanInstall] = useState<boolean>(!!deferedInstallPrompt);
  useEffect(() => {
    const listener = () => {
      setCanInstall(true);
    };
    notifyInstallReady = notifyInstallReady.concat(listener);
    return () => {
      notifyInstallReady = notifyInstallReady.filter((l) => l !== listener);
    };
  }, [setCanInstall]);

  return canInstall ? (
    <ToolButton
      icon={<Icon>🖥</Icon>}
      onClick={() => {
        deferedInstallPrompt.prompt();
      }}
    />
  ) : null;
};
