import { type FC, type PropsWithChildren } from "react";

export const Inlay: FC<PropsWithChildren> = ({ children }) => (
  <div className="absolute top-2.5 right-2.5 z-10 w-62.5 cursor-default">
    {children}
  </div>
);
