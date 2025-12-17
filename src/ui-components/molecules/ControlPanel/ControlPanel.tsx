import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import clsx from "clsx";

type ControlPanelProps = PropsWithChildren<{ shadow?: boolean }>;

/**
 * Creates a control panel for users to adjust properties
 * using controls.
 * @see Control
 */
export const ControlPanel: FC<ControlPanelProps> = ({
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
      className={clsx(
        "bg-control-default rounded-control overflow-y-hidden hide-scrollbar shrink-0",
        "transition-[height,width] duration-300 ease-in-out",
        {
          "shadow-md": shadow,
        }
      )}
      style={height !== null ? { height } : {}}
    >
      <div
        ref={innerRef}
        className="[&>_*+*]:border-t [&>_*+*]:border-control-edge"
      >
        {children}
      </div>
    </form>
  );
};
