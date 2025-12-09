import { PropsWithChildren } from "react";

export const Icon: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <span className="text-black text-shadow-xs text-shadow-black">
    {children}
  </span>
);
