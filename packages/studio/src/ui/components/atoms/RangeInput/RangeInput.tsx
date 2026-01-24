import clsx from "clsx";
import { type ComponentProps, type FC } from "react";

type RangeInputProps = Omit<ComponentProps<"input">, "type" | "className">;

// TODO: Enhance keyboard support to use shift, alt for finer/coarser control

export const RangeInput: FC<RangeInputProps> = (props) => (
  <input
    className={clsx(
      "w-24 appearance-none bg-transparent px-1 py-2 outline-none",
      "track:h-1 track:rounded-full track:bg-workspace track:shadow-inset-sm",
      `thumb:-mt-1.5 thumb:size-4 thumb:appearance-none thumb:rounded-full thumb:border-2 thumb:border-control-interaction thumb:bg-control-interaction thumb:shadow-md hover:thumb:border-control-highlight focus:thumb:border-control-focus`,
      `hover:track:bg-control-highlight focus:track:bg-control-focus`
    )}
    type="range"
    {...props}
  />
);
