import React, { KeyboardEventHandler } from "react";
import styled from "styled-components";
import { Control, ControlLabel } from "./Control";

export const NumberInput = styled.input.attrs({ type: "number", size: 6 })`
  text-align: right;
  width: 5em;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  border: 1px solid ${({ theme }) => theme.colors.backgroundSecondary};
  flex: 0;
`;

export enum UpDown {
  UP = "up",
  DOWN = "down",
}

export enum StepSize {
  MEDIUM = "medium",
  LARGE = "large",
}

const stepSize = (size: StepSize): number =>
  size === StepSize.MEDIUM ? 10 : 100;

export const defaultStepFn = (
  input: number,
  upDown: UpDown,
  size: StepSize
): number =>
  upDown === UpDown.UP ? input + stepSize(size) : input - stepSize(size);

export const numberStepControl = (
  handler: (value: number) => void,
  onStep = defaultStepFn
): KeyboardEventHandler<HTMLInputElement> => (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const dir = e.key === "ArrowDown" ? UpDown.DOWN : UpDown.UP;
    if (e.shiftKey === true) {
      handler(onStep(e.currentTarget.valueAsNumber, dir, StepSize.MEDIUM));
      e.preventDefault();
    }
    if (e.metaKey === true || e.ctrlKey === true) {
      handler(onStep(e.currentTarget.valueAsNumber, dir, StepSize.LARGE));
      e.preventDefault();
    }
  }
};

interface SliderControlProps {
  title?: string;
  value: number;
  disabled?: boolean;
  onChange(newValue: number): void;
  onStep?(value: number, upDown: UpDown, size: StepSize): number;
}

const NumberInputControl: React.VFC<SliderControlProps> = ({
  title,
  value,
  disabled = false,
  onChange,
  onStep,
}) => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <NumberInput
      disabled={disabled}
      value={value}
      onChange={(e) =>
        onChange(e.currentTarget.value ? e.currentTarget.valueAsNumber : 0)
      }
      onKeyDown={numberStepControl((stepValue) => onChange(stepValue), onStep)}
    />
  </Control>
);

export default NumberInputControl;
