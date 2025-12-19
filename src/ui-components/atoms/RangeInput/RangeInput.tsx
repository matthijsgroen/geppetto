import clsx from "clsx";
import { type ComponentProps, type FC } from "react";

type RangeInputProps = Omit<ComponentProps<"input">, "type" | "className">;

export const RangeInput: FC<RangeInputProps> = (props) => (
  <input
    type="range"
    className={clsx(
      "w-24 appearance-none bg-transparent py-2 outline-none",
      "track:h-1 track:rounded-full track:bg-workspace track:shadow-inset-sm",
      `thumb:-m-1.5 thumb:size-4 thumb:appearance-none thumb:rounded-full thumb:border-2 thumb:border-panel thumb:bg-panel thumb:shadow-md hover:thumb:border-control-highlight focus:thumb:border-control-active`,
      `hover:track:bg-control-highlight focus:track:bg-control-focus`
    )}
    {...props}
  />
);
