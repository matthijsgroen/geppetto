import React, { Dispatch, SetStateAction } from "react";
import Menu from "src/components/Menu";
import SelectControl, { Option } from "src/components/SelectControl";
import SliderControl from "src/components/SliderControl";
import { ControlDefinition, ImageDefinition } from "src/lib/types";
import { isControlDefinition, visit } from "src/lib/visit";

interface ControlInfoPanelProps {
  controlSelected: ControlDefinition;
  value: number;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
  onChange?(newValue: number): void;
}

const createOptions = (amount: number): Option<number>[] =>
  new Array(amount)
    .fill(null)
    .map(
      (_e, i) =>
        ({ name: `${i + 1}`, id: `${i + 1}`, value: i + 1 } as Option<number>)
    );

const ControlInfoPanel: React.VFC<ControlInfoPanelProps> = ({
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
            visit(
              {
                ...image,
                controlValues: {
                  ...image.controlValues,
                  [controlSelected.name]: Math.min(
                    image.controlValues[controlSelected.name],
                    selected.value - 1
                  ),
                },
              },
              (node) => {
                if (
                  isControlDefinition(node) &&
                  node.name === controlSelected.name
                ) {
                  if (node.steps.length < selected.value) {
                    return {
                      ...node,
                      steps: node.steps.concat(
                        new Array(selected.value - node.steps.length).fill(
                          node.steps[node.steps.length - 1]
                        )
                      ),
                    };
                  } else {
                    return {
                      ...node,
                      steps: node.steps.slice(0, selected.value),
                    };
                  }
                }
                return undefined;
              }
            )
          );
        }}
      />,
      <SliderControl
        key="control"
        title={"Control"}
        showValue={true}
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
