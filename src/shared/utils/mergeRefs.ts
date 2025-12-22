import { type ForwardedRef, type Ref, type RefObject } from "react";

export const mergeRefs =
  <T>(refs: (RefObject<T> | ForwardedRef<T>)[]): Ref<T> =>
  (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
