import clsx from "clsx";
import { type ComponentProps, type FC } from "react";

type ToggleInputProps = Omit<ComponentProps<"input">, "type" | "className">;

export const ToggleInput: FC<ToggleInputProps> = (props) => (
  <input
    type="checkbox"
    className={clsx(
      `bg-workspace shadow-inset-sm checked:bg-control-active hover:checked:bg-control-highlight relative inline-block h-6 w-12 appearance-none rounded-full outline-0 transition-colors`,
      `after:border-panel after:bg-panel hover:after:border-control-highlight focus:after:border-control-active after:m-0.5 after:inline-block after:size-5 after:rounded-full after:border-2 after:shadow-md after:transition-[margin-left] after:content-['']`,
      "checked:after:ml-6"
    )}
    {...props}
  />
);
