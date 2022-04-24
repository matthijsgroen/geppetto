import { createContext, PropsWithChildren, useCallback, useRef } from "react";

type SystemMessage = "fileOpen" | "textureOpen";

type Unsubscribe = () => void;

export const ApplicationContext = createContext<{
  sendMessage: (message: SystemMessage) => void;
  onMessage: (listener: (message: SystemMessage) => void) => Unsubscribe;
}>({
  sendMessage: () => {},
  onMessage: () => {
    return () => {};
  },
});

export const AppContext: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const listenersRef = useRef<((message: SystemMessage) => void)[]>([]);
  const sendMessage = useCallback((message: SystemMessage) => {
    for (const listener of listenersRef.current) {
      listener(message);
    }
  }, []);
  const onMessage = useCallback((handler: (message: SystemMessage) => void) => {
    listenersRef.current = listenersRef.current.concat(handler);
    return () => {
      listenersRef.current = listenersRef.current.filter((h) => h !== handler);
    };
  }, []);

  return (
    <ApplicationContext.Provider value={{ sendMessage, onMessage }}>
      {children}
    </ApplicationContext.Provider>
  );
};
