import { type FC, type PropsWithChildren } from "react";

type PanelTitleProps = PropsWithChildren;

export const PanelTitle: FC<PanelTitleProps> = ({ children }) => (
  <h3 className="m-2 text-sm font-normal text-dimmed uppercase font-caption">
    {children}
  </h3>
);
