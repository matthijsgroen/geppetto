import { useMemo, useState } from "react";

import type { Action } from "@/application/state/hooks/useActionMap";
import type { Shortcut } from "@/ui/components";

const TOGGLE_INFO_SHORTCUT: Shortcut = {
  ctrlOrCmd: true,
  interaction: "KeyI",
};

export const useInfoPanel = (): [panelOpen: boolean, action: Action] => {
  // Placeholder for future implementation
  const [showItemDetails, setShowItemDetails] = useState(false);

  const action = useMemo(
    (): Action => ({
      icon: "ℹ",
      colorizedIcon: true,
      tooltip: "Toggle info display",
      shortcut: TOGGLE_INFO_SHORTCUT,
      handler: () => {
        setShowItemDetails((prev) => !prev);
      },
    }),
    [setShowItemDetails]
  );
  return [showItemDetails, action];
};
