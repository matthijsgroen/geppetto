import type { FC } from "react";
import { type PropsWithChildren } from "react";

export const EmptyTree: FC<PropsWithChildren> = ({ children }) => (
  <div className="rounded-control bg-control-default text-text font-caption flex flex-1 flex-col items-center justify-center">
    {children}
  </div>
);
