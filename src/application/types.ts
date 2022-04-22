import { Dispatch, SetStateAction } from "react";

export type UseState<T> = [T, Dispatch<SetStateAction<T>>];
export type AppSection = "layers" | "composition" | "animation";
