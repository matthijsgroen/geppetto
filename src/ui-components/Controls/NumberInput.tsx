import { ChangeEvent, useCallback } from "react";
import styles from "./Control.module.scss";

type NumberInputProps = {
  prefix?: string;
  postfix?: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (newValue: number) => void;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  prefix,
  postfix,
  value,
  minValue,
  maxValue,
  onChange,
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
        value={value}
        onChange={changeHandler}
        min={minValue}
        max={maxValue}
      />
      {postfix}
    </label>
  );
};
