import { FC, PropsWithChildren } from "react";
import { Label } from "../../atoms/Label/Label";

type ControlProps = PropsWithChildren<{
  htmlFor?: string;
  label?: string;
}>;

export const Control: FC<ControlProps> = ({ label, htmlFor, children }) => (
  <div className="flex mx-2 justify-between h-fit">
    {label && (
      <div className="py-2 overflow-hidden text-ellipsis whitespace-nowrap self-center">
        <Label htmlFor={htmlFor}>{label}</Label>
      </div>
    )}
    <div className="justify-items-end items-center min-h-12 flex p-2 pr-0 whitespace-nowrap">
      {children}
    </div>
  </div>
);
