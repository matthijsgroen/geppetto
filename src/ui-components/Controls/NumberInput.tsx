import { ChangeEvent, KeyboardEventHandler, useCallback } from "react";
import styles from "./Control.module.scss";

export enum UpDown {
  UP = "up",
  DOWN = "down",
}

export enum StepSize {
  EXTRA_SMALL = "xs",
  SMALL = "s",
  MEDIUM = "m",
  LARGE = "l",
  EXTRA_LARGE = "xl",
}

type NumberInputProps = {
  prefix?: string;
  postfix?: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  htmlId?: string;
  onChange?: (newValue: number) => void;
  onStep?: (value: number, upDown: UpDown, size: StepSize) => number;
};

const stepSize = (size: StepSize): number =>
  ({
    [StepSize.EXTRA_SMALL]: 0.01,
    [StepSize.SMALL]: 0.1,
    [StepSize.MEDIUM]: 1,
    [StepSize.LARGE]: 10,
    [StepSize.EXTRA_LARGE]: 100,
  }[size]);

const defaultStepFn = (input: number, upDown: UpDown, size: StepSize): number =>
  upDown === UpDown.UP ? input + stepSize(size) : input - stepSize(size);

const numberStepControl =
  (
    handler: (value: number) => void,
    onStep = defaultStepFn
  ): KeyboardEventHandler<HTMLInputElement> =>
  (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const dir = e.key === "ArrowDown" ? UpDown.DOWN : UpDown.UP;
      let size: StepSize = StepSize.MEDIUM;
      if (e.shiftKey) {
        size = StepSize.LARGE;
      }
      if (e.metaKey || e.ctrlKey) {
        size = StepSize.EXTRA_LARGE;
      }
      if (e.altKey) {
        size = StepSize.SMALL;
      }
      if (e.altKey && e.shiftKey) {
        size = StepSize.EXTRA_SMALL;
      }

      handler(onStep(e.currentTarget.valueAsNumber, dir, size));
      e.preventDefault();
    }
  };

export const NumberInput: React.FC<NumberInputProps> = ({
  prefix,
  postfix,
  htmlId,
  value,
  minValue,
  maxValue,
  onChange,
  onStep = defaultStepFn,
}) => {
  const changeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.currentTarget.valueAsNumber);
    },
    [onChange]
  );

  return (
    <label className={styles.controlShort}>
      {prefix}
      <input
        type="number"
        id={htmlId}
        value={value}
        onChange={changeHandler}
        onKeyDown={numberStepControl(
          (stepValue) => onChange && onChange(stepValue),
          onStep
        )}
        min={minValue}
        max={maxValue}
      />
      {postfix}
    </label>
  );
};
