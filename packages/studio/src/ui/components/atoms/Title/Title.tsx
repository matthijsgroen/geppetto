import { clsx } from "clsx";
import type { FC, PropsWithChildren } from "react";

export const Title: FC<PropsWithChildren<{ selectable?: boolean }>> = ({
  children,
  selectable = true,
}) => (
  <h1
    className={clsx("mt-2 text-2xl font-semibold text-text font-caption", {
      "select-text": selectable,
    })}
  >
    {children}
  </h1>
);
