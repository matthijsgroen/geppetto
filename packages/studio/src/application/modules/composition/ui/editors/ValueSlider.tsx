import type { Vec2 } from "@geppetto/types";
import { produce } from "immer";
import { type ChangeEvent, useCallback } from "react";

import { Column, Control, RangeInput, RangeValue } from "@/ui/components";

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
  onFocus?: () => void;
  onBlur?: () => void;
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
  onFocus,
  onBlur,
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
      <Column>
        <RangeInput
          max={max}
          min={min}
          onBlur={onBlur}
          onChange={sliderChangeHandler}
          onFocus={onFocus}
          step={step}
          value={value[vectorIndex]}
        />
        <RangeValue formatter={valueFormatter} value={value[vectorIndex]} />
      </Column>
    </Control>
  );
};
