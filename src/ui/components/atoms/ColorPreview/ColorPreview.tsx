import type { FC } from "react";

export const ColorPreview: FC<{
  /**
   * Hue value between 0 and 1
   */
  hue: number;
  /**
   * Saturation value between 0 and 1
   */
  saturation: number;
}> = ({ hue, saturation }) => (
  <div
    className="h-8 w-24 rounded-control-small shadow-sm"
    style={{
      backgroundColor: `hsl(${hue * 360}deg, ${saturation * 100}%, 50%)`,
    }}
  />
);
