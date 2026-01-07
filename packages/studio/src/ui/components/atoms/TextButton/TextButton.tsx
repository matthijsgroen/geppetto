import { type FC, type MouseEventHandler, type PropsWithChildren } from "react";

type TextButtonProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

export const TextButton: FC<TextButtonProps> = ({
  onClick,
  children,
  ...props
}) => (
  <button
    {...props}
    className="inline cursor-pointer rounded-control-small border-none bg-transparent p-0 text-text focus-visible:outline-2 focus-visible:outline-control-focus enabled:hover:text-active"
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);
