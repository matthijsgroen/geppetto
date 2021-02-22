import React from "react";
import Menu from "src/components/Menu";
import SliderControl from "src/components/SliderControl";
import { ControlDefinition } from "src/lib/types";

interface ControlInfoPanelProps {
  controlSelected: ControlDefinition;
  value: number;
  onChange?(newValue: number): void;
}

const ControlInfoPanel: React.FC<ControlInfoPanelProps> = ({
  controlSelected,
  value,
  onChange,
}) => (
  <Menu
    title={`⚙️ ${controlSelected.name}`}
    collapsable={true}
    size="minimal"
    items={[
      <SliderControl
        key="control"
        title={"Control"}
        value={value}
        min={0}
        max={1}
        step={0.01}
        onChange={(newValue) => onChange && onChange(newValue)}
      />,
    ]}
  />
);

export default ControlInfoPanel;
