import { Icon, ToolButton } from "src/ui-components";

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt: () => Promise<void>;
}

let deferedInstallPrompt: BeforeInstallPromptEvent;

window.addEventListener("beforeinstallprompt", (e: Event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  deferedInstallPrompt = e as BeforeInstallPromptEvent;
});

export const InstallToolButton: React.VFC = () =>
  deferedInstallPrompt ? <ToolButton icon={<Icon>🖥</Icon>} /> : null;
