import { createContext } from "react";

import { type ToolBarSize } from "./ToolBar";

export const ToolbarContext = createContext<{
  size: ToolBarSize;
  vertical: boolean;
}>({ size: "default", vertical: false });
