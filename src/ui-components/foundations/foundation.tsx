import type { FC, PropsWithChildren } from "react";

export const FoundationList: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div>
    <h1 className="font-caption text-3xl font-bold">{title}</h1>
    <div className="flex flex-row flex-wrap gap-8 self-start p-8">
      {children}
    </div>
  </div>
);

export const FoundationItem: FC<PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => (
  <div className="flex w-60 flex-row items-center gap-2">
    <div className="flex flex-1 items-center justify-end">
      <p className="text-end">{label}</p>
    </div>
    <div>{children}</div>
  </div>
);
