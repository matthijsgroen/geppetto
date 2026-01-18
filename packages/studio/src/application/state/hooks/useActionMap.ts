import type React from "react";
import { useRef } from "react";

import { isEvent, type Shortcut } from "@/ui/components";

export type Action = {
  caption?: string;
  icon?: string;
  colorizedIcon?: boolean;
  tooltip?: string;
  shortcut: Shortcut;
  type?: "checkbox" | "normal" | "radio";
  isChecked?: () => boolean;
  handler: () => void;
};

export type ActionHandlers<T extends string> = Record<T, Action>;

export type ActionMap<ActionHandlers> = {
  triggerKeyboardAction: (
    event: KeyboardEvent | React.KeyboardEvent<HTMLElement>
  ) => boolean;
  actions: ActionHandlers;
};

export const useActionMap = <T extends string>(
  producer: () => ActionHandlers<T>
): ActionMap<ActionHandlers<T>> => {
  const ref = useRef<{
    result: ActionMap<ActionHandlers<T>>;
    producer: typeof producer;
  }>(null);

  if (ref.current?.producer !== producer) {
    const result = producer();
    const actionList = Object.entries<Action>(result);
    const triggerKeyboardAction = (
      e: KeyboardEvent | React.KeyboardEvent<HTMLElement>
    ) => {
      for (const [, action] of actionList) {
        if (isEvent(action.shortcut, e)) {
          action.handler();
          return true;
        }
      }
      return false;
    };
    ref.current = {
      result: {
        triggerKeyboardAction,
        actions: result,
      },
      producer,
    };
  }

  return ref.current.result;
};
