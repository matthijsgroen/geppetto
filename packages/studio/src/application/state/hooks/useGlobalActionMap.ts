import { useEffect } from "react";

import type { ActionHandlers } from "./useActionMap";
import { useActionMap } from "./useActionMap";

/**
 * Works the same as useActionMap, but registers keyboard events globally on window, and only returns the actions
 * @param producer
 */
export const useGlobalActionMap = <T extends string>(
  producer: () => ActionHandlers<T>
): ActionHandlers<T> => {
  const {
    actions: screenActions,
    triggerKeyboardAction: triggerScreenKeyboardAction,
  } = useActionMap(producer);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (triggerScreenKeyboardAction(event)) {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [triggerScreenKeyboardAction]);

  return screenActions;
};
