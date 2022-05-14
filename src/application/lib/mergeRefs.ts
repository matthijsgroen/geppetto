import { ForwardedRef, MutableRefObject, Ref } from "react";

export const mergeRefs =
  <T>(refs: (MutableRefObject<T> | ForwardedRef<T>)[]): Ref<T> =>
  (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
