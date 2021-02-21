import React from "react";
import { Control } from "src/components/Control";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import SelectControl from "src/components/SelectControl";
import SliderControl from "src/components/SliderControl";
import Vect2InputControl from "src/components/Vec2InputControl";
import { updateVectorData } from "src/lib/definitionHelpers";
import { ImageDefinition, MutationVector, Vec2 } from "src/lib/types";
import { defaultValueForVector } from "src/lib/vertices";
import { isControlDefinition, visit } from "src/lib/visit";

interface VectorInfoPanelProps {
  vectorSelected: MutationVector;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
  image: ImageDefinition;
  vectorValue: Vec2;
  updateVectorValue(newValue: Vec2): void;
  activeControl?: string;
  controlPosition?: "start" | "end";
}

type VectorTypes = MutationVector["type"];

const createVector = (
  name: string,
  origin: Vec2,
  newType: VectorTypes
): MutationVector => {
  switch (newType) {
    case "deform":
      return { type: "deform", origin, name, radius: 10 };
    case "rotate":
      return { type: "rotate", origin, name };
    case "stretch":
      return { type: "stretch", origin, name };
    case "translate":
      return { type: "translate", origin, name };
  }
};

const iconForType = (type: VectorTypes): string =>
  (({
    deform: "🟠",
    rotate: "🔴",
    stretch: "🟣",
    translate: "🟢",
  } as Record<VectorTypes, string>)[type]);

const VectorInfoPanel: React.FC<VectorInfoPanelProps> = ({
  vectorSelected,
  updateImageDefinition,
  image,
  vectorValue,
  updateVectorValue,
  activeControl,
  controlPosition,
}) => {
  const control = activeControl
    ? image.controls.find((c) => c.name === activeControl) || null
    : null;

  const controlUpdateKey = controlPosition === "start" ? "min" : "max";

  const controlValue =
    activeControl && control
      ? control[controlUpdateKey][vectorSelected.name]
      : undefined;

  const activeValue = controlValue || vectorValue;

  return (
    <Menu
      title={`${iconForType(vectorSelected.type)} ${vectorSelected.name}`}
      collapsable={true}
      size="minimal"
      items={[
        <SelectControl
          key={"type"}
          title={"Type"}
          value={vectorSelected.type}
          options={[
            {
              name: "Deformation",
              id: "deform",
              value: "deform" as VectorTypes,
            },
            {
              name: "Translation",
              id: "translate",
              value: "translate" as VectorTypes,
            },
            {
              name: "Rotation",
              id: "rotate",
              value: "rotate" as VectorTypes,
            },
            {
              name: "Stretch",
              id: "stretch",
              value: "stretch" as VectorTypes,
            },
          ]}
          onChange={(newValue) => {
            updateImageDefinition((state) =>
              updateVectorData(state, vectorSelected.name, (vector) =>
                createVector(vector.name, vector.origin, newValue.value)
              )
            );
            updateVectorValue(defaultValueForVector(newValue.value));
          }}
        />,
        <Vect2InputControl
          key={"origin"}
          title={"origin"}
          value={vectorSelected.origin}
          onChange={(newValue) => {
            updateImageDefinition((state) =>
              updateVectorData(state, vectorSelected.name, (vector) => ({
                ...vector,
                origin: newValue,
              }))
            );
          }}
        />,
        ...(vectorSelected.type === "deform"
          ? [
              <NumberInputControl
                key={"radius"}
                title={"radius"}
                value={vectorSelected.radius}
                onChange={(newValue) => {
                  updateImageDefinition((state) =>
                    updateVectorData(state, vectorSelected.name, (vector) => ({
                      ...vector,
                      radius: newValue,
                    }))
                  );
                }}
              />,
              <Vect2InputControl
                key={"value"}
                title={"value"}
                value={activeValue}
                onChange={(newValue) => {
                  updateVectorValue(newValue);
                }}
              />,
            ]
          : []),
        ...(vectorSelected.type === "stretch"
          ? [
              <Vect2InputControl
                key={"value"}
                title={"value"}
                value={activeValue}
                step={0.05}
                onChange={(newValue) => {
                  updateVectorValue(newValue);
                }}
              />,
            ]
          : []),
        ...(vectorSelected.type === "translate"
          ? [
              <Vect2InputControl
                key={"value"}
                title={"value"}
                value={activeValue}
                onChange={(newValue) => {
                  updateVectorValue(newValue);
                }}
              />,
            ]
          : []),
        ...(vectorSelected.type === "rotate"
          ? [
              <SliderControl
                key={"value"}
                title={"value"}
                value={activeValue[0]}
                showValue={true}
                min={-Math.PI * 2}
                max={Math.PI * 2}
                step={Math.PI / 180}
                onChange={(newValue) => {
                  updateVectorValue([newValue, 0]);
                }}
              />,
            ]
          : []),
        ...(activeControl !== null
          ? [
              <Control key="controlSet">
                {!controlValue && (
                  <button
                    type="button"
                    onClick={() => {
                      updateImageDefinition((state) =>
                        visit(state, (item) => {
                          if (
                            isControlDefinition(item) &&
                            item.name === activeControl
                          ) {
                            return {
                              ...item,
                              ...{
                                [controlUpdateKey]: {
                                  ...item[controlUpdateKey],
                                  [vectorSelected.name]: activeValue,
                                },
                              },
                            };
                          }
                        })
                      );
                    }}
                  >
                    Set Value
                  </button>
                )}
                {controlValue && (
                  <button
                    type="button"
                    onClick={() => {
                      updateImageDefinition((state) =>
                        visit(state, (item) => {
                          if (
                            isControlDefinition(item) &&
                            item.name === activeControl
                          ) {
                            const updatedControl = {
                              ...item,
                              ...{
                                [controlUpdateKey]: Object.entries(
                                  item[controlUpdateKey]
                                ).reduce(
                                  (result, [key, value]) =>
                                    key !== vectorSelected.name
                                      ? { ...result, [key]: value }
                                      : result,
                                  {}
                                ),
                              },
                            };
                            return updatedControl;
                          }
                          return undefined;
                        })
                      );
                    }}
                  >
                    Unset Value
                  </button>
                )}
              </Control>,
            ]
          : []),
      ]}
    />
  );
};

export default VectorInfoPanel;
