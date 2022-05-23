import { useCallback, useEffect, useState } from "react";

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

export const useAppInstall = (): [
  canInstall: boolean,
  installer: () => void
] => {
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
  const installer = useCallback(() => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
  }, []);

  return [canInstall, installer];
};
