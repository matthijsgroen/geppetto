import { Shortcut, shortcutStr } from "./shortcut";
import { clsx } from "clsx";

type ShortcutProps = {
  shortcut: Shortcut;
  disabled?: boolean;
  dimmed?: boolean;
  inMenu?: boolean;
};

/**
 * Kbd is useful for visualizing Keyboard shortcuts.
 * It will use different formatting for displaying shortcuts on mac
 * than on windows/linux. Mac tends to show shortcuts with symbols,
 * win/lin shows shortcuts by text combined with a `+` sign.
 */
export const Kbd: React.FC<ShortcutProps> = ({
  shortcut,
  disabled = false,
  dimmed = false,
  inMenu = false,
}) => (
  <kbd
    className={clsx("text-sm font-system self-center", {
      ["px-2"]: !inMenu,
      ["text-text-light dark:text-text-dark"]: !dimmed,
      ["text-dimmed-light/50 dark:text-dimmed-dark/50"]: dimmed,
      ["pl-4"]: inMenu,
      ["opacity-60"]: disabled,
    })}
  >
    {shortcutStr(shortcut)}
  </kbd>
);
