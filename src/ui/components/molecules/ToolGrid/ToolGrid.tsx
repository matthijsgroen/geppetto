import { type FC, type PropsWithChildren } from "react";

import { type ToolBarSize } from "../ToolBar/ToolBar";
import { ToolbarContext } from "../ToolBar/ToolBarContext";

type ToolBarProps = PropsWithChildren<{
  size?: ToolBarSize;
}>;

export const ToolGrid: FC<ToolBarProps> = ({ children, size = "default" }) => (
  <ToolbarContext.Provider value={{ size, vertical: false }}>
    <div className="flex flex-wrap gap-1">{children}</div>
  </ToolbarContext.Provider>
);
