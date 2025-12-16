import { PropsWithChildren } from "react";

type TitleProps = PropsWithChildren;

export const Title: React.FC<TitleProps> = ({ children }) => (
  <h3 className="font-caption text-dimmed uppercase font-normal text-sm m-2">
    {children}
  </h3>
);
