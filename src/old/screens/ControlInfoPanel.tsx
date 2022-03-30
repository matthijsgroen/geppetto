import React, { Dispatch, SetStateAction } from "react";
import Menu from "../components/Menu";
import SelectControl, { Option } from "../components/SelectControl";
import SliderControl from "../components/SliderControl";
import { updateValue } from "../lib/definitionHelpers";
import {
  ControlDefinition,
  ImageDefinition,
} from "../../application/animation/file1-types";
import { isControlDefinition, visit } from "../lib/visit";

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
        options={createOptions(10)}
        onChange={(selected) => {
          updateImageDefinition((image) =>
            visit(
              {
                ...image,
                controlValues: updateValue(
                  image.controlValues,
                  controlSelected.name,
                  (value: number) => Math.min(value, selected.value - 1)
                ),
                animations: image.animations.map((anim) => ({
                  ...anim,
                  keyframes: anim.keyframes.map((frame) => ({
                    ...frame,
                    controlValues: updateValue(
                      frame.controlValues,
                      controlSelected.name,
                      (value: number) => Math.min(value, selected.value - 1)
                    ),
                  })),
                })),
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
