import { Vec2 } from "../../../types";
import { Control } from "../../../ui-components";
import { useFile } from "../../applicationMenu/FileContext";
import { VectorControl } from "../../controls/VectorControl";
import { ValueSlider } from "./ValueSlider";
import styles from "./MutationValueEdit.module.css";
import { MutationVectorTypes } from "../../../animation/file1/types";

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
  if (mutationType === "opacity") {
    return (
      <ValueSlider
        label="Opacity"
        value={value}
        onValueChange={onValueChange}
        min={0}
        max={1}
        step={0.01}
        valueFormatter={percentageFormatter}
      />
    );
  }
  if (mutationType === "saturation") {
    return (
      <ValueSlider
        label="Saturation"
        value={value}
        onValueChange={onValueChange}
        min={0}
        max={1}
        step={0.01}
        valueFormatter={percentageFormatter}
      />
    );
  }
  if (mutationType === "lightness") {
    return (
      <ValueSlider
        label="Lightness"
        value={value}
        onValueChange={onValueChange}
        min={0}
        max={2}
        step={0.01}
        valueFormatter={lightnessFormatter}
      />
    );
  }
  if (mutationType === "rotate") {
    return (
      <ValueSlider
        label="Rotation"
        value={value}
        onValueChange={onValueChange}
        min={-360}
        max={360}
        step={0}
      />
    );
  }
  if (mutationType === "colorize") {
    return (
      <>
        <Control label="Color">
          <div
            className={styles.colorPreview}
            style={{
              backgroundColor: `hsl(${value[0] * 360}deg, ${
                value[1] * 100
              }%, 50%)`,
            }}
          ></div>
        </Control>
        <ValueSlider
          label="Hue"
          value={value}
          onValueChange={onValueChange}
          valueFormatter={hueFormatter}
          min={0}
          max={1}
          step={0.01}
        />
        <ValueSlider
          label="Saturation"
          value={value}
          onValueChange={onValueChange}
          vectorIndex={1}
          valueFormatter={percentageFormatter}
          min={0}
          max={1}
          step={0.01}
        />
      </>
    );
  }
  return <VectorControl label="Value" value={value} onChange={onValueChange} />;
};

export const MutationControlled: React.FC<{ mutationId: string }> = ({
  mutationId,
}) => {
  const [file] = useFile();

  const affectingControls = Object.entries(file.controls).filter(
    ([, control]) =>
      control.steps.some((frame) =>
        Object.keys(frame).some((key) => key === mutationId)
      )
  );
  if (affectingControls.length > 0) {
    return (
      <Control label="Controlled by">
        <p>{affectingControls.map(([, c]) => c.name).join(", ")}</p>
      </Control>
    );
  }
  return null;
};
