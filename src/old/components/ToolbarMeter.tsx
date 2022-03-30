import React from "react";
import { ToolbarLabel } from "./Toolbar";

interface ToolbarMeterProps {
  title?: string;
  value: number;
  low?: number;
  high?: number;
  min?: number;
  max: number;
  optimum: number;
}

const ToolbarMeter: React.VFC<ToolbarMeterProps> = ({
  value,
  min = 0,
  max,
  low,
  high,
  optimum,
}) => (
  <ToolbarLabel>
    <meter
      min={min}
      optimum={optimum}
      max={max}
      low={low}
      high={high}
      value={value}
      title={`${value} / ${max}`}
    >
      {value}/{max}
    </meter>
  </ToolbarLabel>
);

export default ToolbarMeter;
