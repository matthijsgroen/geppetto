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

const PlayerControlsContext = createContext<{
  setTimestamp: (time: number | null) => void;
  subscribeToTimestamp: Subscription<number | null>;
}>({
  setTimestamp: () => {},
  subscribeToTimestamp: () => () => {},
});

export const PlayerControlsProvider: FC<PlayerControlsProviderProps> = ({
  children,
}) => {
  const timestamp = useRef<number | null>(0);
  const timestampSubscribers = useRef<DataHandler<number | null>[]>([]);

  const value = useMemo(
    () => ({
      setTimestamp: (time: number | null) => {
        timestamp.current = time;
        timestampSubscribers.current.forEach((handler) =>
          handler(timestamp.current)
        );
      },
      subscribeToTimestamp: (handler: (time: number | null) => void) => {
        timestampSubscribers.current.push(handler);
        return () => {
          timestampSubscribers.current = timestampSubscribers.current.filter(
            (sub) => sub !== handler
          );
        };
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

export const usePlayerTimestamp = (handler: DataHandler<number | null>) => {
  const { subscribeToTimestamp } = usePlayerControls();
  useEffect(
    () => subscribeToTimestamp(handler),
    [subscribeToTimestamp, handler]
  );
};
