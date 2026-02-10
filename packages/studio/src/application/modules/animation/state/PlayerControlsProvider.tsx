import {
  createContext,
  type FC,
  type PropsWithChildren,
  use,
  useEffect,
  useMemo,
  useRef,
} from "react";

type PlayerControlsProviderProps = PropsWithChildren;

type Unsubscribe = () => void;
type DataHandler<T> = (value: T) => void;
type Subscription<T> = (handler: DataHandler<T>) => Unsubscribe;

type ControlValue = { controlId: string; value: number | null };

type ContextValue = {
  setTimestamp: (time: { time: number; trackId: string } | null) => void;
  showControlValue: (controlId: string, value: number | null) => void;
  subscribeToControlValue: Subscription<ControlValue>;
  subscribeToTimestamp: Subscription<{ time: number; trackId: string } | null>;
};

const PlayerControlsContext = createContext<ContextValue>({
  setTimestamp: () => {},
  showControlValue: () => {},
  subscribeToControlValue: () => () => {},
  subscribeToTimestamp: () => () => {},
});

export const PlayerControlsProvider: FC<PlayerControlsProviderProps> = ({
  children,
}) => {
  const timestamp = useRef<{ time: number; trackId: string } | null>(null);
  const timestampSubscribers = useRef<
    DataHandler<{ time: number; trackId: string } | null>[]
  >([]);
  const latestControlValue = useRef<ControlValue | null>(null);
  const controlValueSubscribers = useRef<DataHandler<ControlValue>[]>([]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const value: ContextValue = useMemo(
    () => ({
      setTimestamp: (time: { time: number; trackId: string } | null) => {
        timestamp.current = time;
        timestampSubscribers.current.forEach((handler) =>
          handler(timestamp.current)
        );
      },
      subscribeToTimestamp: (
        handler: (time: { time: number; trackId: string } | null) => void
      ) => {
        timestampSubscribers.current.push(handler);
        return () => {
          timestampSubscribers.current = timestampSubscribers.current.filter(
            (sub) => sub !== handler
          );
        };
      },
      subscribeToControlValue: (handler: (value: ControlValue) => void) => {
        controlValueSubscribers.current.push(handler);
        if (latestControlValue.current) {
          handler(latestControlValue.current);
        }
        return () => {
          controlValueSubscribers.current =
            controlValueSubscribers.current.filter((sub) => sub !== handler);
        };
      },
      showControlValue: (controlId: string, value: number | null) => {
        latestControlValue.current = { controlId, value };
        controlValueSubscribers.current.forEach((handler) =>
          handler({ controlId, value })
        );
      },
    }),
    []
  );

  return (
    <PlayerControlsContext.Provider value={value}>
      {children}
    </PlayerControlsContext.Provider>
  );
};

export const usePlayerControls = () => use(PlayerControlsContext);

export const usePlayerTimestamp = (
  handler: DataHandler<{ time: number; trackId: string } | null>
) => {
  const { subscribeToTimestamp } = usePlayerControls();
  useEffect(
    () => subscribeToTimestamp(handler),
    [subscribeToTimestamp, handler]
  );
};

export const usePlayerControlValue = (handler: DataHandler<ControlValue>) => {
  const { subscribeToControlValue } = usePlayerControls();
  useEffect(
    () => subscribeToControlValue(handler),
    [subscribeToControlValue, handler]
  );
};
