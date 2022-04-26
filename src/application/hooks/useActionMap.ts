import React, { useRef } from "react";
import { isEvent, Shortcut } from "../../ui-components";

export type Action = {
  caption?: string;
  icon?: string;
  tooltip?: string;
  shortcut: Shortcut;
  handler: () => void;
};

type ActionHandlers<T extends string> = Record<T, Action>;

type ActionMap<ActionHandlers> = {
  triggerKeyboardAction: (
    event: KeyboardEvent | React.KeyboardEvent<HTMLElement>
  ) => boolean;
  actions: ActionHandlers;
};

export const useActionMap = <T extends string>(
  producer: () => ActionHandlers<T>
): ActionMap<ActionHandlers<T>> => {
  const ref =
    useRef<{
      result: ActionMap<ActionHandlers<T>>;
      producer: typeof producer;
    }>();
  if (!ref.current || ref.current.producer !== producer) {
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
