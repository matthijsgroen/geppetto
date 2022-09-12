import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { className } from "../className";
import styles from "./TimeBox.module.css";

type TimeBoxProps = PropsWithChildren<{
  /**
   * @default 1.0
   */
  zoom?: number;
  active?: boolean;
}>;

type VisualTimeEvent = {
  id: number;
  start: number;
  end: number;
  label: string;
};

type VisualInfo = {
  row: number;
};

type TimeBoxContextValue = {
  events: VisualTimeEvent[];
  visualMap: Record<string, VisualInfo>;
  id: number;
  maxEnd: number;
  dimensionsUpdated: () => void;
};

const TimeBoxContext = createContext<MutableRefObject<TimeBoxContextValue>>({
  current: {
    events: [],
    visualMap: {},
    id: 0,
    maxEnd: 0,
    dimensionsUpdated: () => {},
  },
});

export const TimeBox: React.FC<TimeBoxProps> = ({
  children,
  active = false,
  zoom = 1.0,
}) => {
  const [dimensions, setDimensions] = useState([0, 0]);
  const valueRef = useRef<TimeBoxContextValue>({
    events: [],
    visualMap: {},
    id: 0,
    maxEnd: 0,
    dimensionsUpdated: () => {
      const maxWidth = valueRef.current.events.reduce(
        (localMax, event) => Math.max(localMax, event.end),
        0
      );
      const maxHeight = Object.values(valueRef.current.visualMap).reduce(
        (localMax, event) => Math.max(localMax, event.row),
        0
      );
      setDimensions([maxWidth, maxHeight]);
    },
  });

  return (
    <TimeBoxContext.Provider value={valueRef}>
      <div
        style={{
          fontSize: 16 * zoom,
          width: `${dimensions[0] * EM_SCALE}em`,
          height: `${dimensions[1] + 0.25}em`,
        }}
        className={styles.timeBox}
      >
        <div
          className={className({
            [styles.timeBar]: true,
            [styles.timeBarActive]: active,
          })}
        ></div>
        {children}
      </div>
    </TimeBoxContext.Provider>
  );
};

type EasingCurve = "linear" | "easeIn" | "easeOut" | "easeInOut";

type TimeEventProps = {
  start: number;
  end: number;
  curve?: EasingCurve | "none";
  label: string;
};

const useEventMapping = (start: number, end: number, label: string) => {
  const contextData = useContext(TimeBoxContext).current;
  const previousEnd = useRef(end);

  useEffect(() => {
    const id = ++contextData.id;
    contextData.events.push({
      start,
      end,
      label,
      id,
    });
    contextData.dimensionsUpdated();

    return () => {
      const index = contextData.events.findIndex((event) => event.id === id);
      contextData.events.splice(index, 1);
      contextData.dimensionsUpdated();
    };
  });

  if (previousEnd.current !== end) {
    contextData.dimensionsUpdated();
  }

  let maxRow = 0;
  for (const [key, value] of Object.entries(contextData.visualMap)) {
    if (key === label) {
      maxRow = value.row - 1;
      break;
    } else {
      maxRow = Math.max(maxRow, value.row);
    }
  }

  contextData.visualMap[label] = { row: maxRow + 1 };

  return maxRow;
};

const EM_SCALE = 0.0025;

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
