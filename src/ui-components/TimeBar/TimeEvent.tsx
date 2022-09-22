import { forwardRef } from "react";
import { className } from "../className";
import { ControlEventProps } from "../generic/ControlProps";
import styles from "./TimeBox.module.css";

type EasingCurve = "linear" | "easeIn" | "easeOut" | "easeInOut";

type TimeEventProps = {
  /** Start time in ms */
  startTime: number;
  /** End time in ms */
  endTime: number;
  row: number;
  easing?: EasingCurve | "none";
  label: string;
} & ControlEventProps<HTMLDivElement>;

export const TimeEvent = forwardRef<HTMLDivElement, TimeEventProps>(
  (
    { startTime, endTime, row, label, easing = "none", ...eventHandlers },
    ref
  ) => (
    <div
      className={styles.timeEvent}
      tabIndex={0}
      role={"gridcell"}
      style={{
        gridColumn: `${Math.floor(startTime / 10) + 1} / span ${Math.floor(
          (endTime - startTime) / 10
        )}`,
        gridRow: 1 + row,
      }}
      ref={ref}
      {...eventHandlers}
    >
      <label>{label}</label>
      <div
        className={className({
          [styles.curve]: easing !== "none",
          [styles.curveLinear]: easing === "linear",
          [styles.curveEaseIn]: easing === "easeIn",
          [styles.curveEaseOut]: easing === "easeOut",
          [styles.curveEaseInOut]: easing === "easeInOut",
        })}
      ></div>
    </div>
  )
);
TimeEvent.displayName = "TimeEvent";

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
