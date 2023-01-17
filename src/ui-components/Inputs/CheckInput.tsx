import { ChangeEvent, useCallback } from "react";
import styles from "./CheckInput.module.scss";

type CheckInputProps = {
  value: boolean;
  htmlId?: string;
  onChange?: (newValue: boolean) => void;
};

export const CheckInput: React.FC<CheckInputProps> = ({
  htmlId,
  value,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.currentTarget.checked);
    },
    [onChange]
  );

  return (
    <input
      type="checkbox"
      className={styles.checkInput}
      id={htmlId}
      checked={value}
      onChange={handleChange}
    />
  );
};
