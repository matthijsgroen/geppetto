import produce from "immer";
import { ChangeEvent, useCallback } from "react";
import { Vec2 } from "../../../types";
import { Control } from "../../../ui-components";

const defaultFormatter = (value: number) => `${value}`;

type ValueSliderProps = {
  min: number;
  max: number;
  step: number;
  label: string;
  vectorIndex?: number;
  valueFormatter?: (value: number) => string;
  value: Vec2;
  onValueChange: (newValue: Vec2) => void;
};

export const ValueSlider: React.FC<ValueSliderProps> = ({
  min,
  max,
  step,
  label,
  vectorIndex = 0,
  valueFormatter = defaultFormatter,
  value,
  onValueChange,
}) => {
  const sliderChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.valueAsNumber;
      onValueChange(
        produce(value, (v) => {
          v[vectorIndex] = newValue;
        })
      );
    },
    [onValueChange, vectorIndex, value]
  );
  return (
    <Control label={label}>
      <input
        type="range"
        value={value[vectorIndex]}
        onChange={sliderChangeHandler}
        min={min}
        max={max}
        step={step}
      />
      <p>{valueFormatter(value[vectorIndex])}</p>
    </Control>
  );
};
