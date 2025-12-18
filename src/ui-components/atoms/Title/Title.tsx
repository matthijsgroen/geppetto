import type { FC, PropsWithChildren } from "react";

export const Title: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="mt-2 text-2xl font-semibold text-text font-caption">
    {children}
  </h1>
);
