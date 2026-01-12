import clsx from "clsx";
import type { FC, InputHTMLAttributes } from "react";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  type?: string;
  align?: "left" | "right" | "center";
  size?: "default" | "small";
  transparent?: boolean;
};

export const TextInput: FC<TextInputProps> = ({
  type = "text",
  align = "left",
  size = "default",
  transparent = false,
  ...props
}) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-control-small border-control-edge text-text focus:outline-2 focus:outline-control-focus",
      {
        "bg-toolbar": !transparent,
        "p-1": size === "default",
        "text-base/tight": size === "small",
        "text-left": align === "left",
        "text-right": align === "right",
        "text-center": align === "center",
      }
    )}
    type={type}
  />
);
