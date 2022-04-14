import React, { useCallback } from "react";

export const useToolAction = (
  action: () => void,
  deps: React.DependencyList
): ((
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
) => void) =>
  useCallback(
    (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      if (
        "code" in e.nativeEvent &&
        !["Enter", "Space"].includes(
          (e as React.KeyboardEvent).nativeEvent.code
        )
      ) {
        return;
      }

      e.preventDefault();
      action();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, action]
  );
