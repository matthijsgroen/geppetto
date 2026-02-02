import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  type KeyboardEventHandler,
  useCallback,
} from "react";

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
  onFocus?: () => void;
  onBlur?: () => void;
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

export const NumberInput: FC<NumberInputProps> = ({
  prefix,
  postfix,
  htmlId,
  value,
  minValue,
  maxValue,
  onChange,
  onFocus,
  onBlur,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.currentTarget.valueAsNumber);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) =>
      numberStepControl((stepValue) => onChange?.(stepValue))(e),
    [onChange]
  );

  return (
    <label className="inline-block h-fit cursor-text border-y-2 border-toolbar bg-toolbar p-1 text-dimmed shadow-sm first:rounded-l-control-small first:border-l-2 last:rounded-r-control-small last:border-r-2 focus-within:border-control-focus focus-within:text-text hover:border-control-highlight hover:focus-within:border-control-focus">
      {prefix}
      <input
        className="hide-spinner w-[4ch] border-0 bg-transparent text-dimmed focus:w-[6ch] focus:text-text focus:outline-none"
        id={htmlId}
        max={maxValue}
        min={minValue}
        onBlur={onBlur}
        onChange={handleChange}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        type="number"
        value={value}
      />
      {postfix}
    </label>
  );
};
