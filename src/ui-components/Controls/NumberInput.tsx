import { ChangeEvent, useCallback } from "react";
import styles from "./Control.module.css";

type NumberInputProps = {
  prefix?: string;
  postfix?: string;
  value: number;
  onChange?: (newValue: number) => void;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  prefix,
  value,
  postfix,
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
      <input type="number" value={value} onChange={changeHandler} />
      {postfix}
    </label>
  );
};
