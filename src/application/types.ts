import { Dispatch, SetStateAction } from "react";

export type UpdateState<T> = Dispatch<SetStateAction<T>>;
export type UseState<T> = [T, UpdateState<T>];
export type AppSection = "layers" | "composition" | "animation";
