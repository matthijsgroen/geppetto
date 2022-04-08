import { createContext } from "react";
import { ToolBarSize } from "./ToolBar";

export const ToolbarContext = createContext<ToolBarSize>("default");
