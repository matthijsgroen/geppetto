import type { GeppettoImage } from "@geppetto/types";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  type RefObject,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import useEvent from "./hooks/useEvent";

type ControlValues = GeppettoImage["controlValues"];
type MutationValues = GeppettoImage["defaultFrame"];

type Unsubscribe = () => void;
export type Subscription = (
  listener: (
    controlValues: ControlValues,
    mutationValues: MutationValues
  ) => void
) => Unsubscribe;

const ImageCtrlContext = createContext<{
  controlValues: RefObject<ControlValues>;
  mutationValues: RefObject<MutationValues>;
  updateControlValues: (
    updater: (current: ControlValues) => ControlValues
  ) => void;
  updateMutationValues: (
    updater: (current: MutationValues) => MutationValues
  ) => void;
  onUpdate: Subscription;
}>({
  controlValues: { current: {} },
  mutationValues: { current: {} },
  updateControlValues: () => {},
  updateMutationValues: () => {},
  onUpdate: () => {
    return () => {};
  },
});

export const ImageControlProvider: FC<PropsWithChildren> = ({ children }) => {
  const listenersRef = useRef<
    ((controlValues: ControlValues, mutationValues: MutationValues) => void)[]
  >([]);
  const controlValues = useRef<ControlValues>({});
  const mutationValues = useRef<MutationValues>({});

  const updateControlValues = useEvent(
    (handler: (current: ControlValues) => ControlValues) => {
      const updated = handler(controlValues.current);
      controlValues.current = updated;
      for (const listener of listenersRef.current) {
        listener(controlValues.current, mutationValues.current);
      }
    }
  );
  const updateMutationValues = useEvent(
    (handler: (current: MutationValues) => MutationValues) => {
      const updated = handler(mutationValues.current);
      mutationValues.current = updated;
      for (const listener of listenersRef.current) {
        listener(controlValues.current, mutationValues.current);
      }
    }
  );
  const onUpdate = useCallback(
    (
      handler: (
        controlValues: ControlValues,
        mutationValues: MutationValues
      ) => void
    ) => {
      listenersRef.current = listenersRef.current.concat(handler);
      return () => {
        listenersRef.current = listenersRef.current.filter(
          (h) => h !== handler
        );
      };
    },
    []
  );
  return (
    <ImageCtrlContext.Provider
      value={{
        controlValues,
        mutationValues,
        onUpdate,
        updateControlValues,
        updateMutationValues,
      }}
    >
      {children}
    </ImageCtrlContext.Provider>
  );
};

export const useControlValues = () => use(ImageCtrlContext).controlValues;

export const useMutationValues = () => use(ImageCtrlContext).mutationValues;

export const useControlValueSubscription = () => use(ImageCtrlContext).onUpdate;

export const useUpdateControlValues = () =>
  use(ImageCtrlContext).updateControlValues;

export const useUpdateMutationValues = () =>
  use(ImageCtrlContext).updateMutationValues;

export const useDirectMutationValues = (): [
  MutationValues,
  (updater: (current: MutationValues) => MutationValues) => void,
] => {
  const {
    mutationValues: initialMutationValues,
    updateMutationValues,
    onUpdate,
  } = use(ImageCtrlContext);

  const [mutationValues, setMutationValues] = useState<MutationValues>(
    initialMutationValues.current
  );

  useEffect(() => {
    const unsubscribe = onUpdate((_, updatedMutationValues) => {
      setMutationValues(updatedMutationValues);
    });
    return unsubscribe;
  }, [setMutationValues, onUpdate]);

  return [mutationValues, updateMutationValues];
};

export const useDirectControlValues = (): [
  ControlValues,
  (updater: (current: ControlValues) => ControlValues) => void,
] => {
  const {
    controlValues: initialControlValues,
    updateControlValues,
    onUpdate,
  } = use(ImageCtrlContext);

  const [controlValues, setControlValues] = useState<ControlValues>(
    initialControlValues.current
  );

  useEffect(() => {
    const unsubscribe = onUpdate((updatedControlValues) => {
      setControlValues(updatedControlValues);
    });
    return unsubscribe;
  }, [setControlValues, onUpdate]);

  return [controlValues, updateControlValues];
};
