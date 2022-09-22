import {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from "react";

export type ControlEventProps<T> = {
  onClick?: MouseEventHandler<T>;
  onMouseDown?: MouseEventHandler<T>;
  onMouseUp?: MouseEventHandler<T>;

  onKeyPress?: KeyboardEventHandler<T>;
  onKeyUp?: KeyboardEventHandler<T>;
  onKeyDown?: KeyboardEventHandler<T>;

  onFocus?: FocusEventHandler<T>;
  onBlur?: FocusEventHandler<T>;

  onContextMenu?: MouseEventHandler<T>;
};
