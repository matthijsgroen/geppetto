import clsx from "clsx";
import { ComponentProps, FC } from "react";

type ToggleInputProps = Omit<ComponentProps<"input">, "type" | "className">;

export const ToggleInput: FC<ToggleInputProps> = (props) => (
  <input
    type="checkbox"
    className={clsx(
      "appearance-none w-12 h-6 inline-block bg-workspace relative rounded-full transition-colors shadow-inset-sm checked:bg-control-active outline-0",
      "after:content-[''] after:inline-block after:bg-panel after:size-5 after:m-0.5 after:border-2 after:rounded-full after:shadow-md after:border-panel after:transition-[margin-left] hover:after:border-control-highlight focus:after:border-control-active",
      "checked:after:ml-6"
    )}
    {...props}
  />
);
