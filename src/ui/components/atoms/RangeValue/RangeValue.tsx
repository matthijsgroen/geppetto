import type { FC } from "react";

export const RangeValue: FC<{
  value: number;
  formatter?: (value: number) => string;
}> = ({ value, formatter = (v) => v.toString() }) => (
  <p className="text-right text-sm text-dimmed">{formatter(value)}</p>
);
