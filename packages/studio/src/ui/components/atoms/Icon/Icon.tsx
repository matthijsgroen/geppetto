import { type FC, type PropsWithChildren } from "react";

type IconProps = PropsWithChildren;

export const Icon: FC<IconProps> = ({ children }) => (
  <span className="text-black text-shadow-black text-shadow-xs">
    {children}
  </span>
);
