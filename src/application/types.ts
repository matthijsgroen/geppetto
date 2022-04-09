import { Dispatch, SetStateAction } from "react";

export type UseState<T> = [T, Dispatch<SetStateAction<T>>];
