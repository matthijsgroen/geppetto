import { Shortcut, shortcutStr } from "./shortcut";
import { className } from "../className";
import styles from "./Kbd.module.css";

type ShortcutProps = {
  shortcut: Shortcut;
  disabled?: boolean;
};

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
