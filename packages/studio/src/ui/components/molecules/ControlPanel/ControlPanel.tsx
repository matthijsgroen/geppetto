import clsx from "clsx";
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

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
      const observer = new ResizeObserver(() => {
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
        `hide-scrollbar shrink-0 overflow-y-hidden rounded-control bg-panel`,
        "transition-[height,width] duration-300 ease-in-out",
        {
          "shadow-md": shadow,
        }
      )}
      style={height !== null ? { height } : {}}
    >
      <div
        className="[&>_*+*]:border-t [&>_*+*]:border-control-edge"
        ref={innerRef}
      >
        {children}
      </div>
    </form>
  );
};
