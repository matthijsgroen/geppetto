import type { FC, PropsWithChildren } from "react";

export const TodoList: FC<PropsWithChildren> = ({ children }) => (
  <ul className="my-4 ml-6 space-y-1">{children}</ul>
);
