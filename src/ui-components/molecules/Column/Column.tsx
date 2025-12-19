import { type FC, type PropsWithChildren } from "react";

type ColumnProps = PropsWithChildren;

export const Column: FC<ColumnProps> = ({ children }) => (
  <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
);
