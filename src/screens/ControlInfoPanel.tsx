import React from "react";
import Menu from "src/components/Menu";
import SelectControl, { Option } from "src/components/SelectControl";
import SliderControl from "src/components/SliderControl";
import { ControlDefinition, ImageDefinition, Keyframe } from "src/lib/types";
import { isControlDefinition, visit } from "src/lib/visit";

interface ControlInfoPanelProps {
  controlSelected: ControlDefinition;
  value: number;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
  onChange?(newValue: number): void;
}

const createOptions = (amount: number): Option<number>[] =>
  new Array(amount)
    .fill(null)
    .map(
      (_e, i) =>
        ({ name: `${i + 1}`, id: `${i + 1}`, value: i + 1 } as Option<number>)
    );

const ControlInfoPanel: React.FC<ControlInfoPanelProps> = ({
  controlSelected,
  value,
  onChange,
  updateImageDefinition,
}) => (
  <Menu
    title={`⚙️ ${controlSelected.name}`}
    collapsable={true}
    size="minimal"
    items={[
      <SelectControl
        key="frames"
        title="Steps"
        value={controlSelected.steps.length}
        options={createOptions(20)}
        onChange={(selected) => {
          updateImageDefinition((image) =>
            visit(image, (node) => {
              if (
                isControlDefinition(node) &&
                node.name === controlSelected.name
              ) {
                if (node.steps.length < selected.value) {
                  return {
                    ...node,
                    steps: node.steps.concat(
                      new Array(selected.value - node.steps.length).fill(
                        {} as Keyframe
                      )
                    ),
                  };
                }
              }

              return undefined;
            })
          );
        }}
      />,
      <SliderControl
        key="control"
        title={"Control"}
        value={value}
        min={0}
        max={controlSelected.steps.length - 1}
        step={0.01 * (controlSelected.steps.length - 1)}
        onChange={(newValue) => onChange && onChange(newValue)}
      />,
    ]}
  />
);

export default ControlInfoPanel;
