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

type TimeEventProps = {
  start: number;
  end: number;
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

export const TimeEvent: React.FC<TimeEventProps> = ({ start, end, label }) => {
  const row = useEventMapping(start, end, label);
  console.log("event:", start, end, label, row);
  return (
    <div
      className={styles.timeEvent}
      style={{
        left: `${start * EM_SCALE}em`,
        width: `${(end - start) * EM_SCALE}em`,
        top: `${row + 0.25}em`,
      }}
    >
      Event!
    </div>
  );
};
