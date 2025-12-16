import clsx from "clsx";
import { ComponentProps, FC } from "react";

type RangeInputProps = Omit<ComponentProps<"input">, "type" | "className">;

export const RangeInput: FC<RangeInputProps> = (props) => (
  <input
    type="range"
    className={clsx(
      "w-24 bg-transparent appearance-none outline-none py-2",
      "track:bg-workspace track:h-1 track:rounded-full track:shadow-inset-sm",
      "thumb:appearance-none thumb:size-4 thumb:-m-1.5 thumb:bg-panel thumb:rounded-full thumb:shadow-md thumb:border-2 thumb:border-panel hover:thumb:border-control-highlight focus:thumb:border-control-active",
      "hover:track:bg-control-highlight focus:track:bg-control-focus"
    )}
    {...props}
  />
);
