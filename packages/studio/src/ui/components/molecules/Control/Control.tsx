import { type FC, type PropsWithChildren } from "react";

import { Label } from "@/ui/components/atoms/Label/Label";

type ControlProps = PropsWithChildren<{
  htmlFor?: string;
  label?: string;
}>;

export const Control: FC<ControlProps> = ({ label, htmlFor, children }) => (
  <div className="mx-2 flex h-fit justify-between">
    {label && (
      <div className="self-center truncate py-2">
        <Label htmlFor={htmlFor}>{label}</Label>
      </div>
    )}
    <div className="flex min-h-12 items-center justify-items-end p-2 pr-0 whitespace-nowrap">
      {children}
    </div>
  </div>
);
