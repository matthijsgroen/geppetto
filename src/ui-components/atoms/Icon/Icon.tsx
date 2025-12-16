import { FC, PropsWithChildren } from "react";

type IconProps = PropsWithChildren;

export const Icon: FC<IconProps> = ({ children }) => (
  <span className="text-black text-shadow-xs text-shadow-black">
    {children}
  </span>
);
