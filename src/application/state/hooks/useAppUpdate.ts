import { useEffect, useState } from "react";

let appUpdater: (() => void) | null = null;
let notifyUpdate: (() => void)[] = [];

export const setAppUpdate = (updater: () => void) => {
  appUpdater = updater;
  for (const notifier of notifyUpdate) {
    notifier();
  }
};

export const useAppUpdate = (): [hasUpdate: boolean, updater: () => void] => {
  const [updater, setUpdater] = useState<[boolean, () => void]>(
    appUpdater ? [true, appUpdater] : [false, () => {}]
  );
  useEffect(() => {
    const handler = () => {
      if (appUpdater) {
        setUpdater([true, appUpdater]);
      }
    };
    notifyUpdate = notifyUpdate.concat(handler);
    return () => {
      notifyUpdate = notifyUpdate.filter((h) => h !== handler);
    };
  }, []);

  return updater;
};
