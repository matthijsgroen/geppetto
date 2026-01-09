import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";

type IconProps = PropsWithChildren<{ colorize?: boolean }>;

export const Icon: FC<IconProps> = ({ children, colorize = false }) => (
  <span
    className={clsx({
      "text-black text-shadow-black text-shadow-xs": !colorize,
      "bg-text bg-clip-text text-transparent": colorize,
    })}
  >
    {children}
  </span>
);
