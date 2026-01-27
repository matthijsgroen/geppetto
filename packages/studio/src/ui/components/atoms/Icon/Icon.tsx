import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";

type IconProps = PropsWithChildren<{ colorize?: boolean; active?: boolean }>;

export const Icon: FC<IconProps> = ({
  children,
  colorize = false,
  active = false,
}) => (
  <span
    className={clsx({
      "text-black text-shadow-black text-shadow-xs": !colorize,
      "bg-clip-text text-transparent": colorize,
      "bg-text": colorize && !active,
      "bg-control-active": active && colorize,
    })}
  >
    {children}
  </span>
);
