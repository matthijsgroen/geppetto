import { PropsWithChildren } from "react";

export const EmptyTree: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="rounded-control text-text font-caption bg-control-default flex flex-1 flex-col items-center justify-center">
    {children}
  </div>
);
