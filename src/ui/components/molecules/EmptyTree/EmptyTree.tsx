import type { FC } from "react";
import { type PropsWithChildren } from "react";

export const EmptyTree: FC<PropsWithChildren> = ({ children }) => (
  <div className="bg-panel flex flex-1 flex-col items-center justify-center rounded-control p-4 text-center text-text font-caption">
    {children}
  </div>
);
