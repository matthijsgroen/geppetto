import { type FC, type MouseEventHandler, type PropsWithChildren } from "react";

type TextButtonProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: MouseEventHandler<HTMLButtonElement>;
}>;

export const TextButton: FC<TextButtonProps> = ({
  onClick,
  onDoubleClick,
  children,
  ...props
}) => (
  <button
    {...props}
    className="inline cursor-pointer rounded-control-small border-none bg-transparent p-0 text-base/tight text-text focus-visible:outline-2 focus-visible:outline-control-focus enabled:hover:text-active"
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    type="button"
  >
    {children}
  </button>
);
