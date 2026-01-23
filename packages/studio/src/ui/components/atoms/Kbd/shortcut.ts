import type React from "react";

const OPTION_KEY = "⎇";
const CMD_KEY = "⌘";
const CTRL_KEY = "⌃";
const SHIFT_KEY = "⇧";

const keyMap = {
  Delete: "Del",
  Backspace: "Backspace",
  DelOrBackspace: "Del",
  Enter: "Enter",
  Escape: "Esc",
  Tab: "Tab",
  Undo: "Z",
  Redo: "Y",
};

const mouseMap = {
  MouseDrag: "Drag",
};

type SpecialKeys = keyof typeof keyMap;

type MouseInteractions = keyof typeof mouseMap;

const macKeyMap: Record<SpecialKeys, string> = {
  Delete: "⌦",
  Backspace: "⌫",
  DelOrBackspace: "⌫",
  Enter: "↩",
  Escape: "⎋",
  Tab: "⇥",
  Undo: "Z",
  Redo: "Z",
};

export type Shortcut = {
  interaction:
    | `Key${string}`
    | `Digit${number}`
    | SpecialKeys
    | MouseInteractions;
  ctrlOrCmd?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  mac?: boolean;
};

const MAC_PLATFORM = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const isMac = (shortcut: Shortcut): boolean =>
  shortcut.mac === undefined ? MAC_PLATFORM : shortcut.mac;

const applySpecialMacShortcuts = (shortcut: Shortcut): Shortcut => {
  if (shortcut.interaction === "Undo") {
    return {
      interaction: "KeyZ",
      ctrlOrCmd: true,
    };
  }
  if (shortcut.interaction === "Redo") {
    return {
      interaction: "KeyZ",
      ctrlOrCmd: true,
      shift: true,
    };
  }
  return shortcut;
};

const macShortcut = (shortcut: Shortcut): string => {
  const internalShortcut = applySpecialMacShortcuts(shortcut);
  const cmd = internalShortcut.ctrlOrCmd ? `${CMD_KEY} ` : "";
  const ctrl = internalShortcut.ctrl ? `${CTRL_KEY} ` : "";
  const shift = internalShortcut.shift ? `${SHIFT_KEY} ` : "";
  const option = internalShortcut.alt ? `${OPTION_KEY} ` : "";

  let key = "";
  if (internalShortcut.interaction.startsWith("Key")) {
    key = internalShortcut.interaction.slice(3);
  } else if (internalShortcut.interaction.startsWith("Digit")) {
    key = internalShortcut.interaction.slice(5);
  } else {
    key =
      macKeyMap[internalShortcut.interaction as SpecialKeys] ||
      mouseMap[internalShortcut.interaction as MouseInteractions] ||
      "";
  }

  return `${option}${shift}${ctrl}${cmd}${key}`;
};

const applySpecialShortcuts = (shortcut: Shortcut): Shortcut => {
  if (shortcut.interaction === "Undo") {
    return {
      interaction: "KeyZ",
      ctrlOrCmd: true,
    };
  }
  if (shortcut.interaction === "Redo") {
    return {
      interaction: "KeyY",
      ctrlOrCmd: true,
    };
  }
  return shortcut;
};

export const shortcutStr = (shortcut: Shortcut): string => {
  const isMacBrowser = isMac(shortcut);
  if (isMacBrowser) {
    return macShortcut(shortcut);
  }
  const internalShortcut = applySpecialShortcuts(shortcut);

  const ctrl =
    internalShortcut.ctrlOrCmd || internalShortcut.ctrl ? "Ctrl+" : "";
  const shift = internalShortcut.shift ? "Shift+" : "";
  const alt = internalShortcut.alt ? "Alt+" : "";

  let key = "";
  if (internalShortcut.interaction.startsWith("Key")) {
    key = internalShortcut.interaction.slice(3);
  } else if (internalShortcut.interaction.startsWith("Digit")) {
    key = internalShortcut.interaction.slice(5);
  } else {
    key =
      keyMap[internalShortcut.interaction as SpecialKeys] ||
      mouseMap[internalShortcut.interaction as MouseInteractions] ||
      "";
  }

  return `${ctrl}${alt}${shift}${key}`;
};

const f = (v: boolean | undefined): boolean => !!v;

export const isEvent = (
  shortcut: Shortcut,
  event: KeyboardEvent | React.KeyboardEvent<Element>
): boolean => {
  const isMacBrowser = isMac(shortcut);
  const internalShortcut = isMacBrowser
    ? applySpecialMacShortcuts(shortcut)
    : applySpecialShortcuts(shortcut);

  const delOrBackspace =
    (event.code === "Delete" &&
      !isMacBrowser &&
      internalShortcut.interaction === "DelOrBackspace") ||
    (event.code === "Backspace" &&
      isMacBrowser &&
      internalShortcut.interaction === "DelOrBackspace");

  if (event.code !== internalShortcut.interaction && !delOrBackspace)
    return false;
  if (event.shiftKey !== f(internalShortcut.shift)) return false;
  if (internalShortcut.ctrl && !event.ctrlKey) return false;
  if (internalShortcut.ctrlOrCmd && !isMacBrowser && !event.ctrlKey)
    return false;
  if (internalShortcut.ctrlOrCmd && isMacBrowser && !event.metaKey)
    return false;

  return true;
};
