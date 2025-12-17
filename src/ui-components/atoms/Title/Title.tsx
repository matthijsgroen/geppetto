import { type FC, type PropsWithChildren } from "react";

type TitleProps = PropsWithChildren;

export const Title: FC<TitleProps> = ({ children }) => (
  <h3 className="m-2 text-sm font-normal text-dimmed uppercase font-caption">
    {children}
  </h3>
);
