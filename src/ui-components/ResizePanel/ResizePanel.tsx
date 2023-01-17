import {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ResizePanel.module.css";
import { className } from "../className";
import React from "react";
import {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableCoreProps,
} from "react-draggable";

const Draggable: React.FC<PropsWithChildren<Partial<DraggableCoreProps>>> = ({
  children,
  ...props
}) => {
  return <DraggableCore {...props}>{children}</DraggableCore>;
};

/**
 * Implementation based on: https://github.com/bjgrosse/react-resize-panel/blob/master/src/ResizePanel.js
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
  style?: CSSProperties;
  borderClass?: string;
  containerClass?: string;
}>;

const isHorizontal = (direction: ResizeDirection) =>
  ResizeDirection.East === direction || direction === ResizeDirection.West;

export const ResizePanel: React.FC<ResizePanelProps> = ({
  children,
  direction,
  style,
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

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }
    const actualContent = (
      content.children[0] as HTMLElement
    ).getBoundingClientRect();
    const initialSize = horizontal ? actualContent.width : actualContent.height;
    setSize(initialSize);
  }, [horizontal]);

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

  const containerStyle = { ...style };
  if (size !== 0) {
    containerStyle.flexGrow = 0;
    containerStyle[horizontal ? "width" : "height"] = "auto";
  }

  const resizeBarClasses =
    borderClass ||
    className({
      [styles.resizeBarHorizontal]: horizontal,
      [styles.resizeBarVertical]: !horizontal,
    });

  const contentClassName = className({
    [styles.resizeContent]: true,
    [styles.resizeContentHorizontal]: horizontal,
    [styles.resizeContentVertical]: !horizontal,
  });

  const clipSize = Math.max(minSize, Math.min(size || 0, maxSize || Infinity));
  const contentStyle =
    size === null
      ? {}
      : horizontal
      ? { width: clipSize + "px" }
      : { height: clipSize + "px" };

  const content = [
    <div
      key="content"
      ref={contentRef}
      className={contentClassName}
      style={contentStyle}
    >
      {React.Children.only(children)}
    </div>,
  ];
  const handleRef = useRef<HTMLDivElement>(null);

  const handle = (
    <Draggable key="handle" onDrag={onDrag} nodeRef={handleRef}>
      <div
        ref={handleRef}
        className={resizeBarClasses}
        role="separator"
        aria-orientation={
          direction === ResizeDirection.East ||
          direction === ResizeDirection.West
            ? "vertical"
            : "horizontal"
        }
      ></div>
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

  let finalContainerClass = className({
    [styles.container]: true,
    [styles.containerHorizontal]: horizontal,
    [styles.containerVertical]: !horizontal,
  });

  if (containerClass) {
    finalContainerClass += ` ${containerClass}`;
  }

  return (
    <div
      ref={wrapperRef}
      style={containerStyle}
      className={finalContainerClass}
    >
      {content}
    </div>
  );
};
