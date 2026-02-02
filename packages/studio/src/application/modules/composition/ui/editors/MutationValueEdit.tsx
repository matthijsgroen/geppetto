import type { Vec2 } from "@geppetto/types";
import React from "react";

import { VectorControl } from "@/application/modules/composition/ui/controls/VectorControl";
import { type MutationVectorTypes } from "@/dtos/animation-file1.dto";
import { ColorPreview, Control, Paragraph } from "@/ui/components";

import { ValueSlider } from "./ValueSlider";

const percentageFormatter = (value: number) => `${Math.round(value * 100)}%`;
const lightnessFormatter = (value: number) =>
  `${Math.round((value - 1) * 100)}%`;
const hueFormatter = (value: number) => `${Math.round(value * 360)} deg`;

type MutationValueEditProps = {
  mutationType: MutationVectorTypes;
  value: Vec2;
  onValueChange: (newValue: Vec2) => void;
};

export const MutationValueEdit: React.FC<MutationValueEditProps> = ({
  mutationType,
  value,
  onValueChange,
}) => {
  if (!value) {
    return (
      <>
        <Paragraph>No value set</Paragraph>
      </>
    );
  }
  if (mutationType === "opacity") {
    return (
      <ValueSlider
        label="Opacity"
        max={1}
        min={0}
        onValueChange={onValueChange}
        step={0.01}
        value={value}
        valueFormatter={percentageFormatter}
      />
    );
  }
  if (mutationType === "saturation") {
    return (
      <ValueSlider
        label="Saturation"
        max={1}
        min={0}
        onValueChange={onValueChange}
        step={0.01}
        value={value}
        valueFormatter={percentageFormatter}
      />
    );
  }
  if (mutationType === "lightness") {
    return (
      <ValueSlider
        label="Lightness"
        max={2}
        min={0}
        onValueChange={onValueChange}
        step={0.01}
        value={value}
        valueFormatter={lightnessFormatter}
      />
    );
  }
  if (mutationType === "rotate") {
    return (
      <ValueSlider
        label="Rotation"
        max={360}
        min={-360}
        onValueChange={onValueChange}
        step={0}
        value={value}
      />
    );
  }
  if (mutationType === "colorize") {
    return (
      <>
        <Control label="Color">
          <ColorPreview hue={value[0]} saturation={value[1]} />
        </Control>
        <ValueSlider
          label="Hue"
          max={1}
          min={0}
          onValueChange={onValueChange}
          step={0.01}
          value={value}
          valueFormatter={hueFormatter}
        />
        <ValueSlider
          label="Saturation"
          max={1}
          min={0}
          onValueChange={onValueChange}
          step={0.01}
          value={value}
          valueFormatter={percentageFormatter}
          vectorIndex={1}
        />
      </>
    );
  }
  return <VectorControl label="Value" onChange={onValueChange} value={value} />;
};
