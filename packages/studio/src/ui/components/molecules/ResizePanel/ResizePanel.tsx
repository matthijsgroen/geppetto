import clsx from "clsx";
import React, {
  type CSSProperties,
  type PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  DraggableCore,
  type DraggableCoreProps,
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";

const Draggable: React.FC<PropsWithChildren<Partial<DraggableCoreProps>>> = ({
  children,
  ...props
}) => {
  return <DraggableCore {...props}>{children}</DraggableCore>;
};

/**
 * Implementation based on: https://github.com/bjgrosse/react-resize-toolbar/blob/master/src/ResizePanel.js
 *
 * The existing implementation did not have types, and was using deprecated functions
 * of React. Re-implemented it to have types, a functional component, and not using deprecated code
 */

export enum ResizeDirection {
  North,
  South,
  West,
  East,
}

type ResizePanelProps = PropsWithChildren<{
  direction: ResizeDirection;
  minSize?: number;
  defaultSize?: number;
  maxSize?: number;
  borderClass?: string;
  containerClass?: string;
}>;

const isHorizontal = (direction: ResizeDirection) =>
  ResizeDirection.East === direction || direction === ResizeDirection.West;

export const ResizePanel: React.FC<ResizePanelProps> = ({
  children,
  direction,
  borderClass,
  containerClass,
  defaultSize,
  minSize = 10,
  maxSize,
}) => {
  const [size, setSize] = useState<number | null>(
    defaultSize === undefined ? null : defaultSize
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const horizontal = isHorizontal(direction);

  const onDrag = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      const factor =
        direction === ResizeDirection.East ||
        direction === ResizeDirection.South
          ? -1
          : 1;

      // modify the size based on the drag delta
      const delta = horizontal ? data.deltaX : data.deltaY;
      setSize((previousSize) =>
        previousSize === null ? null : previousSize - delta * factor
      );
    },
    [direction, horizontal]
  );

  const containerStyle: CSSProperties = {};
  if (size !== 0) {
    containerStyle.flexGrow = 0;
    containerStyle[horizontal ? "width" : "height"] = "auto";
  }

  const resizeBarClasses =
    borderClass ??
    clsx(
      "z-10 flex place-content-center items-center bg-transparent hover:bg-control-focus",
      {
        "-mx-0.5 w-1 cursor-col-resize": horizontal,
        "-my-0.5 h-1 cursor-row-resize": !horizontal,
      }
    );

  const contentClassName = clsx("flex grow self-stretch", {
    "flex-row": horizontal,
    "flex-col": !horizontal,
  });

  const clipSize = Math.max(minSize, Math.min(size ?? 0, maxSize ?? Infinity));
  const contentStyle =
    size === null
      ? {}
      : horizontal
        ? { width: clipSize + "px" }
        : { height: clipSize + "px" };

  const content = [
    <div
      className={contentClassName}
      key="content"
      ref={contentRef}
      role="region"
      style={contentStyle}
    >
      {React.Children.only(children)}
    </div>,
  ];
  const handleRef = useRef<HTMLDivElement>(null);

  const handle = (
    <Draggable
      key="handle"
      nodeRef={handleRef as React.RefObject<HTMLElement>}
      onDrag={onDrag}
    >
      <div
        aria-orientation={
          direction === ResizeDirection.East ||
          direction === ResizeDirection.West
            ? "vertical"
            : "horizontal"
        }
        className={resizeBarClasses}
        ref={handleRef}
        role="separator"
      />
    </Draggable>
  );

  // Insert the handle at the beginning of the content
  // if our direction is west or north
  if (
    direction === ResizeDirection.West ||
    direction === ResizeDirection.North
  ) {
    content.unshift(handle);
  } else {
    content.push(handle);
  }

  let finalContainerClass = clsx("flex items-stretch", {
    "flex-row flex-nowrap": horizontal,
    "flex-col flex-nowrap": !horizontal,
  });

  if (containerClass) {
    finalContainerClass += ` ${containerClass}`;
  }

  return (
    <div
      className={finalContainerClass}
      ref={wrapperRef}
      style={containerStyle}
    >
      {content}
    </div>
  );
};
