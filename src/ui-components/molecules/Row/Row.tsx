import { FC, PropsWithChildren } from "react";

type RowProps = PropsWithChildren;

export const Row: FC<RowProps> = ({ children }) => (
  <div className="flex flex-row flex-1 overflow-hidden">{children}</div>
);
