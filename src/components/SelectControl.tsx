import React from "react";
import styled from "styled-components";

const Control = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  display: flex;
`;

const ControlLabel = styled.p`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 1rem;
  margin: 0;
  flex: 1;
`;

const SelectInput = styled.select`
  width: 7em;
  flex: 0;
`;

export type Option<T> = {
  name: string;
  id: string;
  value: T;
};

interface SliderControlProps<T> {
  title?: string;
  value: T;
  options: Option<T>[];
  disabled?: boolean;
  onChange(selected: Option<T>): void;
}

const SelectControl = <T,>({
  title,
  value,
  options,
  disabled = false,
  onChange,
}: SliderControlProps<T>): React.ReactElement<SliderControlProps<T>> => (
  <Control>
    {title && <ControlLabel>{title}</ControlLabel>}
    <SelectInput
      disabled={disabled}
      value={options.find((o) => o.value === value)?.id}
      onChange={(e) => {
        const newOption = options.find((o) => o.id === e.currentTarget.value);
        newOption && onChange(newOption);
      }}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </SelectInput>
  </Control>
);

export default SelectControl;
