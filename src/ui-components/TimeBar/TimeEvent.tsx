import { className } from "../className";
import styles from "./TimeBox.module.css";

type EasingCurve = "linear" | "easeIn" | "easeOut" | "easeInOut";

type TimeEventProps = {
  /** Start time in ms */
  startTime: number;
  /** End time in ms */
  endTime: number;
  row: number;
  curve?: EasingCurve | "none";
  label: string;
};

export const TimeEvent: React.FC<TimeEventProps> = ({
  startTime,
  endTime,
  row,
  label,
  curve = "none",
}) => {
  return (
    <div
      className={styles.timeEvent}
      style={{
        gridColumn: `${Math.floor(startTime / 10) + 1} / span ${Math.floor(
          (endTime - startTime) / 10
        )}`,
        gridRow: 1 + row,
      }}
    >
      <label>{label}</label>
      <div
        className={className({
          [styles.curve]: curve !== "none",
          [styles.curveLinear]: curve === "linear",
          [styles.curveEaseIn]: curve === "easeIn",
          [styles.curveEaseOut]: curve === "easeOut",
          [styles.curveEaseInOut]: curve === "easeInOut",
        })}
      ></div>
    </div>
  );
};

export const TimeLineCurves: React.FC = () => (
  <>
    <svg width="0" height="0">
      <defs>
        <clipPath id="linearCurve" clipPathUnits="objectBoundingBox">
          <path d="M0 1L1 0L1 1L0 1" />
        </clipPath>
        <clipPath id="easeInCurve" clipPathUnits="objectBoundingBox">
          <path d="M0 1C0.5 1 0.89 1 1 0L1 1L0 1" />
        </clipPath>
        <clipPath id="easeOutCurve" clipPathUnits="objectBoundingBox">
          <path d="M0 1C0.5 0 0.89 0 1 0L1 1L0 1" />
        </clipPath>
        <clipPath id="easeInOutCurve" clipPathUnits="objectBoundingBox">
          <path d="M0 1C0.45 1 0.55 0 1 0L1 1L0 1" />
        </clipPath>
      </defs>
    </svg>
  </>
);
