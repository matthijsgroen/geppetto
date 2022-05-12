import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { className } from "../className";
import styles from "./ControlPanel.module.css";

type ControlPanelProps = PropsWithChildren<{ shadow?: boolean }>;

/**
 * Creates a control panel for users to adjust properties
 * using controls.
 * @see Control
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  children,
  shadow = false,
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (innerRef.current) {
      const observer = new ResizeObserver((entries) => {
        const height = innerRef.current?.getBoundingClientRect().height;
        if (height !== undefined) {
          setHeight(height);
        }
      });

      observer.observe(innerRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <form
      className={className({
        [styles.controlPanel]: true,
        [styles.shadow]: shadow,
      })}
      style={height !== null ? { height } : {}}
    >
      <div ref={innerRef}>{children}</div>
    </form>
  );
};
