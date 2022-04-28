import { Shortcut, shortcutStr } from "./shortcut";
import { className } from "../className";
import styles from "./Kbd.module.css";

type ShortcutProps = {
  shortcut: Shortcut;
  disabled?: boolean;
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
}) => (
  <kbd
    className={className({
      [styles.shortcut]: true,
      [styles.disabled]: disabled,
    })}
  >
    {shortcutStr(shortcut)}
  </kbd>
);
