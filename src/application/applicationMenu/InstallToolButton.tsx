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

export const InstallToolButton: React.VFC = () =>
  deferedInstallPrompt ? <ToolButton icon={<Icon>🖥</Icon>} /> : null;
