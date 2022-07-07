import { useLayoutEffect, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

/**
 * Suppress the warning when using useLayoutEffect with SSR
 * https://reactjs.org/link/uselayouteffect-ssr
 */
const useBrowserLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : () => {};

/**
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */
export function useEvent<TCallback extends AnyFunction>(
  callback: TCallback
): TCallback {
  // Keep track of the latest callback:
  const latestRef = useRef<TCallback>(
    useEvent_shouldNotBeInvokedBeforeMount as any
  );
  useBrowserLayoutEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback that always calls the latest callback:
  const stableRef = useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any, ...args) {
      return latestRef.current.apply(this, args);
    } as TCallback;
  }

  return stableRef.current;
}

/**
 * Render methods should be pure, especially when concurrency is used,
 * so we will throw this error if the callback is called while rendering.
 */
function useEvent_shouldNotBeInvokedBeforeMount() {
  throw new Error(
    "INVALID_USEEVENT_INVOCATION: the callback from useEvent cannot be invoked before the component has mounted."
  );
}

export default useEvent;
