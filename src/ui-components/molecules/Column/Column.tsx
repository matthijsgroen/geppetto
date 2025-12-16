import { FC, PropsWithChildren } from "react";

type ColumnProps = PropsWithChildren;

export const Column: FC<ColumnProps> = ({ children }) => (
  <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
);
