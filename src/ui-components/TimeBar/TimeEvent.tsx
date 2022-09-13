import { className } from "../className";
import { EM_SCALE } from "./constants";
import { useEventMapping } from "./TimeBox";
import styles from "./TimeBox.module.css";

type EasingCurve = "linear" | "easeIn" | "easeOut" | "easeInOut";

type TimeEventProps = {
  start: number;
  end: number;
  curve?: EasingCurve | "none";
  label: string;
};

export const TimeEvent: React.FC<TimeEventProps> = ({
  start,
  end,
  label,
  curve = "none",
}) => {
  const row = useEventMapping(start, end, label);
  return (
    <div
      className={styles.timeEvent}
      style={{
        left: `${start * EM_SCALE}em`,
        width: `${(end - start) * EM_SCALE}em`,
        top: `${row * 2 + 0.25}rem`,
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
