import { PropsWithChildren } from "react";

type TitleProps = PropsWithChildren<{}>;

export const Title: React.FC<TitleProps> = ({ children }) => (
  <h3 className="font-caption text-dimmed-light/50 dark:text-dimmed-dark/50 uppercase font-normal text-sm m-2">
    {children}
  </h3>
);
