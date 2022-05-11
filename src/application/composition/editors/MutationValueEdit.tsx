import { Vec2 } from "../../../types";
import { Control } from "../../../ui-components";
import { useFile } from "../../applicationMenu/FileContext";
import { VectorControl } from "../../controls/VectorControl";
import { ValueSlider } from "./ValueSlider";
import styles from "./MutationValueEdit.module.css";

const percentageFormatter = (value: number) => `${Math.round(value * 100)}%`;
const lightnessFormatter = (value: number) =>
  `${Math.round((value - 1) * 100)}%`;
const hueFormatter = (value: number) => `${Math.round(value * 360)} deg`;

type MutationValueEditProps = {
  mutationId: string;
  value: Vec2;
  onValueChange: (newValue: Vec2) => void;
};

export const MutationValueEdit: React.FC<MutationValueEditProps> = ({
  mutationId,
  value,
  onValueChange,
}) => {
  const [file] = useFile();
  const mutation = file.mutations[mutationId];
  if (mutation.type === "opacity") {
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
  if (mutation.type === "saturation") {
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
  if (mutation.type === "lightness") {
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
  if (mutation.type === "rotate") {
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
  if (mutation.type === "colorize") {
    const activeValue = file.defaultFrame[mutationId];
    return (
      <>
        <Control label="Color">
          <div
            className={styles.colorPreview}
            style={{
              backgroundColor: `hsl(${activeValue[0] * 360}deg, ${
                activeValue[1] * 100
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
