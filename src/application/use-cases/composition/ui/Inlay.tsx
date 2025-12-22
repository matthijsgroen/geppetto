import { type FC, type PropsWithChildren } from "react";

export const Inlay: FC<PropsWithChildren> = ({ children }) => (
  <div className="absolute top-2.5 right-2.5 z-10 cursor-default w-62.5">{children}</div>
);
