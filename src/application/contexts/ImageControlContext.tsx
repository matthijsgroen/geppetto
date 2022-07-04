import React, {
  createContext,
  PropsWithChildren,
  FC,
  useRef,
  useCallback,
  useContext,
  MutableRefObject,
} from "react";
import { GeppettoImage } from "../../animation/file2/types";

type ControlValues = GeppettoImage["controlValues"];

type Unsubscribe = () => void;
export type Subscription = (
  listener: (controlValues: ControlValues) => void
) => Unsubscribe;

const ImageCtrlContext = createContext<{
  controlValues: MutableRefObject<ControlValues>;
  update: (updater: (current: ControlValues) => ControlValues) => void;
  onUpdate: Subscription;
}>({
  controlValues: { current: {} },
  update: () => {},
  onUpdate: () => {
    return () => {};
  },
});

export const ImageControlContext: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const listenersRef = useRef<((controlVal: ControlValues) => void)[]>([]);
  const value = useRef<ControlValues>({});

  const update = useCallback(
    (handler: (current: ControlValues) => ControlValues) => {
      const updated = handler(value.current);
      value.current = updated;
      for (const listener of listenersRef.current) {
        listener(value.current);
      }
    },
    [value]
  );
  const onUpdate = useCallback((handler: (trans: ControlValues) => void) => {
    listenersRef.current = listenersRef.current.concat(handler);
    return () => {
      listenersRef.current = listenersRef.current.filter((h) => h !== handler);
    };
  }, []);
  return (
    <ImageCtrlContext.Provider
      value={{ controlValues: value, onUpdate, update }}
    >
      {children}
    </ImageCtrlContext.Provider>
  );
};

export const useControlValues = () => {
  const { controlValues } = useContext(ImageCtrlContext);
  return controlValues.current;
};

export const useControlValueSubscription = () => {
  const { onUpdate } = useContext(ImageCtrlContext);
  return onUpdate;
};

export const useUpdateControlValues = () => {
  const { update } = useContext(ImageCtrlContext);
  return update;
};
