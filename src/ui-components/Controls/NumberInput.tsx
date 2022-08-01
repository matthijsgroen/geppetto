import {
  ChangeEvent,
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
} from "react";
import styles from "./Control.module.scss";

enum UpDown {
  UP = "up",
  DOWN = "down",
}

enum StepSize {
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
};

const stepSizes: Record<StepSize, number> = {
  [StepSize.EXTRA_SMALL]: 0.01,
  [StepSize.SMALL]: 0.1,
  [StepSize.MEDIUM]: 1,
  [StepSize.LARGE]: 10,
  [StepSize.EXTRA_LARGE]: 100,
};

const onStep = (input: number, upDown: UpDown, size: StepSize): number =>
  upDown === UpDown.UP ? input + stepSizes[size] : input - stepSizes[size];

const numberStepControl =
  (handler: (value: number) => void): KeyboardEventHandler<HTMLInputElement> =>
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
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.currentTarget.valueAsNumber);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) =>
      numberStepControl((stepValue) => onChange && onChange(stepValue))(e),
    [onChange]
  );

  return (
    <label className={styles.controlShort}>
      {prefix}
      <input
        type="number"
        id={htmlId}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        min={minValue}
        max={maxValue}
      />
      {postfix}
    </label>
  );
};
