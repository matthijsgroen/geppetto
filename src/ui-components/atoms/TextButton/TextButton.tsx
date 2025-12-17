import { FC, MouseEventHandler, PropsWithChildren } from "react";

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
    onClick={onClick}
    className="inline border-none bg-transparent p-0 text-text enabled:hover:text-active focus-visible:outline-control-focus focus-visible:outline-2 rounded-control-small cursor-pointer"
    type="button"
  >
    {children}
  </button>
);
