import clsx from "clsx";
import type { ComponentProps, FC } from "react";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";

import useEvent from "@/application/state/hooks/useEvent";
import { type Vec2 } from "@/shared/types/global";

export enum MouseMode {
  Normal,
  Grab,
  Grabbing,
  Panning,
  Aim,
  Target,
}

type MouseControlProps = PropsWithChildren<{
  mode: MouseMode;
}>;

const MouseControlContainer: FC<MouseControlProps & ComponentProps<"div">> = ({
  mode,
  children,
  ...props
}) => (
  <div
    {...props}
    className={clsx(
      "box-border size-full border border-control-edge focus:border-control-focus",
      {
        "cursor-grab": mode === MouseMode.Grab,
        "cursor-grabbing": mode === MouseMode.Grabbing,
        "cursor-move": mode === MouseMode.Panning,
        "cursor-default": mode === MouseMode.Normal,
        "cursor-crosshair": mode === MouseMode.Aim,
        "cursor-pointer": mode === MouseMode.Target,
      }
    )}
  >
    {children}
  </div>
);

type MouseEventsProps = {
  onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onWheel?: (delta: number, position: Vec2, rect: DOMRect) => void;
};

const MouseControl: React.FC<MouseControlProps & MouseEventsProps> = ({
  children,
  mode,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onContextMenu,
  onWheel,
  onKeyDown,
  onKeyUp,
}) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && onWheel) {
      const elem = ref.current;
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        onWheel(e.deltaY, [e.offsetX, e.offsetY], elem.getBoundingClientRect());
      };
      elem.addEventListener("wheel", handler, { passive: false });

      return () => {
        elem.removeEventListener("wheel", handler);
      };
    }
  }, [ref, onWheel]);

  const mouseMode =
    isGrabbing && mode === MouseMode.Normal
      ? MouseMode.Panning
      : isGrabbing && mode === MouseMode.Grab
        ? MouseMode.Grabbing
        : mode;

  return (
    <MouseControlContainer
      mode={mouseMode}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseDown={useEvent((e: React.MouseEvent<HTMLDivElement>) => {
        setIsGrabbing(true);
        onMouseDown?.(e);
      })}
      onMouseMove={onMouseMove}
      onMouseUp={useEvent((e: React.MouseEvent<HTMLDivElement>) => {
        setIsGrabbing(false);
        onMouseUp?.(e);
      })}
      ref={ref}
      tabIndex={0}
    >
      {children}
    </MouseControlContainer>
  );
};

export default MouseControl;
