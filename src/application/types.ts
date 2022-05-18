import { Dispatch, SetStateAction } from "react";

export type UpdateState<T> = Dispatch<SetStateAction<T>>;
export type UseState<T> = [T, UpdateState<T>];
export type AppSection = "layers" | "composition" | "animation";

export interface Size {
  readonly width: number;
  readonly height: number;
}

export type ScreenTranslation = {
  readonly zoom: number;
  readonly scale: number;
  readonly panX: number;
  readonly panY: number;
};
