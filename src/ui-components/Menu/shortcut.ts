const OPTION_KEY = "⎇";
const CMD_KEY = "⌘";
const SHIFT_KEY = "⇧";

export type Shortcut = {
  key: KeyboardEvent["code"];
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  mac?: boolean;
};

const MAC_PLATFORM = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const isMac = (shortcut: Shortcut): boolean =>
  shortcut.mac === undefined ? MAC_PLATFORM : shortcut.mac;

const macShortcut = (shortcut: Shortcut): string => {
  const cmd = shortcut.ctrlOrCmd ? `${CMD_KEY} ` : "";
  const shift = shortcut.shift ? `${SHIFT_KEY} ` : "";
  const option = shortcut.alt ? `${OPTION_KEY} ` : "";

  let key = "";
  if (shortcut.key.startsWith("Key")) {
    key = shortcut.key.slice(3);
  }

  return `${option}${shift}${cmd}${key}`;
};

export const shortcutStr = (shortcut: Shortcut): string => {
  const isMacBrowser = isMac(shortcut);
  if (isMacBrowser) {
    return macShortcut(shortcut);
  }

  const ctrl = shortcut.ctrlOrCmd ? "Ctrl+" : "";
  const shift = shortcut.shift ? "Shift+" : "";
  const alt = shortcut.alt ? "Alt+" : "";

  let key = "";
  if (shortcut.key.startsWith("Key")) {
    key = shortcut.key.slice(3);
  }

  return `${ctrl}${alt}${shift}${key}`;
};

const f = (v: boolean | undefined): boolean => !!v;

export const isEvent = (shortcut: Shortcut, event: KeyboardEvent): boolean => {
  const isMacBrowser = isMac(shortcut);

  if (event.code !== shortcut.key) return false;
  if (event.shiftKey !== f(shortcut.shift)) return false;
  if (shortcut.ctrlOrCmd && !isMacBrowser && !event.ctrlKey) return false;
  if (shortcut.ctrlOrCmd && isMacBrowser && !event.metaKey) return false;

  return true;
};
