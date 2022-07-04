import React, {
  createContext,
  PropsWithChildren,
  FC,
  useRef,
  useCallback,
  useContext,
} from "react";
import { ScreenTranslation } from "../types";

type MutableScreenTranslation = {
  zoom: number;
  scale: number;
  panX: number;
  panY: number;
};
type Unsubscribe = () => void;
export type Subscription = (
  listener: (trans: ScreenTranslation) => void
) => Unsubscribe;

const ScreenTransContext = createContext<{
  translation: ScreenTranslation;
  update: (updater: (current: ScreenTranslation) => ScreenTranslation) => void;
  onUpdate: Subscription;
}>({
  translation: { zoom: 1.0, scale: 1.0, panX: 0, panY: 0 },
  update: () => {},
  onUpdate: () => {
    return () => {};
  },
});

export const ScreenTranslationContext: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const listenersRef = useRef<((trans: ScreenTranslation) => void)[]>([]);
  const value = useRef<MutableScreenTranslation>({
    zoom: 1.0,
    scale: 1.0,
    panX: 0,
    panY: 0,
  });

  const update = useCallback(
    (handler: (current: ScreenTranslation) => ScreenTranslation) => {
      const updated = handler(value.current);
      value.current.panX = updated.panX;
      value.current.panY = updated.panY;
      value.current.scale = updated.scale;
      value.current.zoom = updated.zoom;
      for (const listener of listenersRef.current) {
        listener(value.current);
      }
    },
    [value]
  );
  const onUpdate = useCallback(
    (handler: (trans: ScreenTranslation) => void) => {
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
    <ScreenTransContext.Provider
      value={{ translation: value.current, onUpdate, update }}
    >
      {children}
    </ScreenTransContext.Provider>
  );
};

export const useScreenTranslation = () => {
  const { translation } = useContext(ScreenTransContext);
  return translation;
};

export const useScreenSubscription = () => {
  const { onUpdate } = useContext(ScreenTransContext);
  return onUpdate;
};

export const useUpdateScreenTranslation = () => {
  const { update } = useContext(ScreenTransContext);
  return update;
};
