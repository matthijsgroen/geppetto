import { PropsWithChildren } from "react";
import { className } from "../className";
import styles from "./TimeBox.module.css";

type TimeBoxProps = PropsWithChildren<{
  /**
   * @default 1.0
   */
  zoom?: number;
  active?: boolean;
}>;

export const TimeBox: React.FC<TimeBoxProps> = ({
  children,
  active = false,
  zoom = 1.0,
}) => {
  return (
    <div
      style={{
        fontSize: 16 * zoom,
      }}
      className={className({
        [styles.timeBox]: true,
        [styles.timeBoxActive]: active,
      })}
    >
      {children}
    </div>
  );
};
