import { createContext } from "react";

export const AnimationTrackContext = createContext<{
  activeTrack: boolean;
}>({ activeTrack: false });
