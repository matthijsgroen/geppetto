import React from "react";
import Menu from "src/components/Menu";
import SliderControl from "src/components/SliderControl";
import { ControlDefinition, ImageDefinition } from "src/lib/types";

interface ControlInfoPanelProps {
  controlSelected: ControlDefinition;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
}

const ControlInfoPanel: React.FC<ControlInfoPanelProps> = ({
  controlSelected,
  //   updateImageDefinition,
}) => (
  <Menu
    title={`⚙️ ${controlSelected.name}`}
    collapsable={true}
    size="minimal"
    items={[
      <SliderControl
        key="control"
        title={"Control"}
        value={0}
        min={0}
        max={1}
        step={0.01}
        onChange={() => {
          // test
        }}
      />,
    ]}
  />
);

export default ControlInfoPanel;
