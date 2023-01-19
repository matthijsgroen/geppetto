import { PropsWithChildren } from "react";
import { className } from "../className";
import styles from "./TimeBox.module.css";

type TimeBoxProps = PropsWithChildren<{
  /**
   * @default 1.0
   */
  zoom?: number;
}>;

export const TimeBox: React.FC<TimeBoxProps> = ({ children, zoom = 1.0 }) => {
  return (
    <div
      style={{
        fontSize: 16 * zoom,
      }}
      role={"grid"}
      className={className({
        [styles.timeBox]: true,
      })}
    >
      {children}
    </div>
  );
};
TimeBox.displayName = "TimeBox";
