import { MouseEventHandler, PropsWithChildren } from "react";
import styles from "./TextButton.module.css";

type TextButtonProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

export const TextButton: React.FC<TextButtonProps> = ({
  onClick,
  children,
  ...props
}) => (
  <button
    {...props}
    onClick={onClick}
    className={styles.textButton}
    type="button"
  >
    {children}
  </button>
);
TextButton.displayName = "TextButton";
