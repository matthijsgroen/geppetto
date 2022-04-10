import { useCallback } from "react";

export const useToolAction = (
  action: () => void,
  deps: React.DependencyList
): ((
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
) => void) =>
  useCallback(
    (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      if ("code" in e && !["Enter", "Space"].includes(e.code)) {
        return;
      }

      e.preventDefault();
      action();
    },
    deps
  );
