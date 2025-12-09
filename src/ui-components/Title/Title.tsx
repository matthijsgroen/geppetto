import { PropsWithChildren } from "react";

type TitleProps = PropsWithChildren<{}>;

export const Title: React.FC<TitleProps> = ({ children }) => (
  <h3 className="text-zinc-800/50 dark:text-neutral-400/80 uppercase font-normal text-sm m-2">
    {children}
  </h3>
);
