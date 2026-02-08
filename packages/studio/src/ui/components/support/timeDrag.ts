import { BASE_FONT_SIZE_PIXELS } from "@/ui/foundations/fontSize";

export type StepSize =
  | "default"
  | "extraSmall"
  | "small"
  | "large"
  | "extraLarge";

/** In Seconds */
export type TimeStamp = number;

export const getStepSize = (e: globalThis.MouseEvent): StepSize => {
  if (e.altKey && e.shiftKey) return "extraSmall";
  if (e.altKey) return "small";
  if (e.ctrlKey || e.metaKey) return "extraLarge";
  if (e.shiftKey) return "large";
  return "default";
};

export const calculateNewLocation = (
  initialLocation: number,
  initialTime: TimeStamp,
  e: globalThis.MouseEvent,
  zoom: number
): TimeStamp => {
  const stepSize = getStepSize(e);

  const deltaPx = e.clientX - initialLocation;
  const deltaTime = deltaPx / (BASE_FONT_SIZE_PIXELS * zoom);
  let newTime = initialTime + deltaTime;
  const stepSizes: Record<string, number> = {
    extraSmall: 0.1,
    small: 0.2,
    default: 0,
    large: 0.5,
    extraLarge: 1,
  };
  const step = stepSizes[stepSize] ?? 0;
  if (step > 0) {
    newTime = Math.round(newTime / step) * step;
  }
  return newTime;
};

export const displayTime = (time: TimeStamp): string => {
  if (time < 1) {
    return `${Math.round(time * 1000)} ms`;
  } else {
    return `${time.toFixed(2)} s`;
  }
};
