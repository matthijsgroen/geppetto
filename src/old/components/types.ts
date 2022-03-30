import { Dispatch, SetStateAction } from "react";

export type State<T> = [T, Dispatch<SetStateAction<T>>];
