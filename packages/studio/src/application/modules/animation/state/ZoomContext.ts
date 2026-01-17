import { createContext } from "react";

const ZoomContext = createContext<{
  zoom: number;
}>({ zoom: 1 });

export default ZoomContext;
