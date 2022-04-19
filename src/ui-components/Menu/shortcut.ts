const OPTION_KEY = "⎇";
const CMD_KEY = "⌘";
const SHIFT_KEY = "⇧";

export const shortcut = (options: {
  key: string;
  ctrlCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  mac?: boolean;
}): string => {
  const isMacBrowser =
    options.mac === undefined
      ? /Mac|iPod|iPhone|iPad/.test(navigator.platform)
      : options.mac;

  let ctrl = "";
  if (options.ctrlCmd) {
    if (isMacBrowser) {
      ctrl = `${CMD_KEY} `;
    } else {
      ctrl = "Ctrl+";
    }
  }

  let shift = "";
  if (options.shift) {
    if (isMacBrowser) {
      shift = `${SHIFT_KEY} `;
    } else {
      shift = "Shift+";
    }
  }

  let alt = "";
  if (options.alt) {
    if (isMacBrowser) {
      alt = `${OPTION_KEY} `;
    } else {
      alt = "Alt+";
    }
  }

  if (isMacBrowser) {
    return `${alt}${shift}${ctrl}${options.key}`;
  }
  return `${ctrl}${alt}${shift}${options.key}`;
};
