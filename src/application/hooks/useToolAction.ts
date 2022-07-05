import React from "react";
import useEvent from "./useEvent";

export const useToolAction = (
  action: () => void
): ((
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
) => void) =>
  useEvent(
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
    }
  );
