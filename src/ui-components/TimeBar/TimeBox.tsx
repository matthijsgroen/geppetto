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
import { EM_SCALE } from "./constants";
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

type TimeBoxContextValue = {
  events: VisualTimeEvent[];
  visualMap: string[];
  subscriptions: (() => void)[];
  subscribe: (callback: () => void) => () => void;
  id: number;
  maxEnd: number;
  dimensionsUpdated: () => void;
};

const debounce = (fn: () => void, ms: number): (() => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (): void => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
};

const TimeBoxContext = createContext<MutableRefObject<TimeBoxContextValue>>({
  current: {
    events: [],
    visualMap: [],
    id: 0,
    maxEnd: 0,
    dimensionsUpdated: () => {},
    subscribe: () => () => {},
    subscriptions: [],
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
    visualMap: [],
    id: 0,
    maxEnd: 0,
    subscriptions: [],
    dimensionsUpdated: debounce(() => {
      const maxWidth = valueRef.current.events.reduce(
        (localMax, event) => Math.max(localMax, event.end),
        0
      );
      for (const subscriber of valueRef.current.subscriptions) {
        subscriber();
      }
      const maxHeight = valueRef.current.visualMap.length;
      if (maxWidth !== dimensions[0] || maxHeight !== dimensions[1]) {
        setDimensions([maxWidth, maxHeight]);
      }
    }, 0),
    subscribe: (callback) => {
      valueRef.current.subscriptions =
        valueRef.current.subscriptions.concat(callback);
      return () => {
        valueRef.current.subscriptions = valueRef.current.subscriptions.filter(
          (c) => c !== callback
        );
      };
    },
  });

  return (
    <TimeBoxContext.Provider value={valueRef}>
      <div
        style={{
          fontSize: 16 * zoom,
          width: `${dimensions[0] * EM_SCALE}em`,
          height: `${dimensions[1] * 2 + 0.25}rem`,
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

export const useEventMapping = (start: number, end: number, label: string) => {
  const contextData = useContext(TimeBoxContext).current;
  const previousEnd = useRef(end);
  const rowRef = useRef(0);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const id = ++contextData.id;
    contextData.events.push({
      start,
      end,
      label,
      id,
    });

    const unsubscribe = contextData.subscribe(() => {
      // check row index
      const row = contextData.visualMap.indexOf(label);

      if (row !== rowRef.current && row !== -1) {
        forceRender((r) => (r + 1) % 10);
      }
    });
    contextData.dimensionsUpdated();

    return () => {
      const index = contextData.events.findIndex((event) => event.id === id);
      contextData.events.splice(index, 1);
      const labelCount = contextData.events.reduce(
        (result, item) => (item.label === label ? result + 1 : result),
        0
      );
      if (labelCount === 0) {
        const removeRow = contextData.visualMap.indexOf(label);
        contextData.visualMap.splice(removeRow, 1);
      }
      unsubscribe();

      contextData.dimensionsUpdated();
    };
  }, [contextData, start, end, label]);

  if (previousEnd.current !== end) {
    contextData.dimensionsUpdated();
  }
  const row = contextData.visualMap.indexOf(label);
  if (row === -1) {
    contextData.visualMap.push(label);
  }

  const renderRow = row === -1 ? contextData.visualMap.length - 1 : row;
  rowRef.current = renderRow;
  return renderRow;
};
