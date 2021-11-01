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

const Tab = styled.li.attrs({ role: "tab" })`
  margin-top: 0 !important;
`;

const AnimationSelector = <T extends BaseType>({
  active,
  options,
  onSelect,
}: Props<T>): React.ReactElement<Props<T>> => {
  return (
    <ul role="tablist" className="tabs">
      {options.map((option) => (
        <Tab
          className={["tabs__item", active === option && "tabs__item--active"]
            .filter(Boolean)
            .join(" ")}
          key={option.id}
          aria-selected={active === option ? "yes" : "no"}
          onClick={() => {
            onSelect(option);
          }}
        >
          {option.label}
        </Tab>
      ))}
    </ul>
  );
};

export default AnimationSelector;
