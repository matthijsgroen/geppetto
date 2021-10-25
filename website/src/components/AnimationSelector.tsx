import React from "react";
import styled from "styled-components";

type Props<T> = {
  active: T;
  options: T[];
  onSelect: (selected: T) => void;
};

type BaseType = {
  id: string;
  label: string;
};

const AnimationSelector = <T extends BaseType>({
  active,
  options,
  onSelect,
}: Props<T>): React.ReactElement<Props<T>> => {
  return (
    <div>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            onSelect(option);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default AnimationSelector;
