import { type FC, type PropsWithChildren } from "react";

type RowProps = PropsWithChildren;

export const Row: FC<RowProps> = ({ children }) => (
  <div className="flex flex-1 flex-row overflow-hidden">{children}</div>
);
