import { useMemo } from "react";

import type { Action } from "@/application/state/hooks/useActionMap";
import { useUpdateScreenTranslation } from "@/application/state/ScreenTranslationContext";
import type { Shortcut } from "@/ui/components";

const FIT_TO_SCREEN_SHORTCUT: Shortcut = {
  alt: true,
  interaction: "KeyF",
};

export const useFitToScreenAction = (): Action => {
  const resetZoom = useUpdateScreenTranslation();
  const action = useMemo(
    (): Action => ({
      icon: "⛶",
      colorizedIcon: true,
      caption: "Fit",
      tooltip: "Fit to screen",
      shortcut: FIT_TO_SCREEN_SHORTCUT,
      handler: () => {
        resetZoom(() => ({
          zoom: 1.0,
          scale: 1.0,
          panX: 0,
          panY: 0,
        }));
      },
    }),
    [resetZoom]
  );
  return action;
};
