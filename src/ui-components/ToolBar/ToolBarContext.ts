import { createContext } from "react";
import { ToolBarSize } from "./ToolBar";

export const ToolbarContext = createContext<{
  size: ToolBarSize;
  vertical: boolean;
}>({ size: "default", vertical: false });
