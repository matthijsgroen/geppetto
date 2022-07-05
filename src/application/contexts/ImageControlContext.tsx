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
import useEvent from "../hooks/useEvent";

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
  controlValues: MutableRefObject<ControlValues>;
  mutationValues: MutableRefObject<MutationValues>;
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

export const ImageControlContext: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
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

export const useControlValues = () =>
  useContext(ImageCtrlContext).controlValues;

export const useMutationValues = () =>
  useContext(ImageCtrlContext).mutationValues;

export const useControlValueSubscription = () =>
  useContext(ImageCtrlContext).onUpdate;

export const useUpdateControlValues = () =>
  useContext(ImageCtrlContext).updateControlValues;

export const useUpdateMutationValues = () =>
  useContext(ImageCtrlContext).updateMutationValues;
