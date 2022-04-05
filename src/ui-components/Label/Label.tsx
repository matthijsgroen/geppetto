import { className } from "../className";
import styles from "./Label.module.css";

type LabelProps = {
  active?: boolean;
};

export const Label: React.FC<LabelProps> = ({ children, active = false }) => (
  <span
    className={className({ [styles.label]: true, [styles.active]: active })}
  >
    {children}
  </span>
);
