import { useState } from "react";
import { Icon, ToolButton } from "../../ui-components";

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt: () => Promise<void>;
}

let deferedInstallPrompt: BeforeInstallPromptEvent;

window.addEventListener("beforeinstallprompt", (event: Event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();
  console.log("Before Install event!");
  deferedInstallPrompt = event as BeforeInstallPromptEvent;
});

export const InstallToolButton: React.FC = () => {
  const [canInstall, setCanInstall] = useState<boolean>(!!deferedInstallPrompt);

  return canInstall ? <ToolButton icon={<Icon>🖥</Icon>} /> : null;
};
