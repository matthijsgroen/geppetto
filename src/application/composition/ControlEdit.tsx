import produce from "immer";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { Control, ControlPanel, Icon, Title } from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import useEvent from "../hooks/useEvent";

type ControlEditProps = {
  selectedControlIds: string[];
};

export const ControlEdit: React.FC<ControlEditProps> = ({
  selectedControlIds,
}) => {
  const [file, setFile] = useFile();
  const activeControlId =
    selectedControlIds.length === 1 ? selectedControlIds[0] : null;
  const hierarchyItem =
    activeControlId !== null ? file.controlHierarchy[activeControlId] : null;
  const [, startTransition] = useTransition();

  const isNoControl =
    activeControlId === null ||
    !hierarchyItem ||
    hierarchyItem.type !== "control";

  const controlValue = isNoControl ? 0 : file.controlValues[activeControlId];
  const [slideValue, setSlideValue] = useState(controlValue);
  useEffect(() => {
    if (activeControlId) {
      setSlideValue(controlValue);
    }
  }, [activeControlId, controlValue]);
  const onChange = useEvent((e: ChangeEvent<HTMLInputElement>) => {
    if (activeControlId === null) return;
    const value = e.currentTarget.valueAsNumber;
    setSlideValue(value);
    startTransition(() => {
      setFile(
        produce((draft) => {
          draft.controlValues[activeControlId] = value;
        })
      );
    });
  });

  if (isNoControl) {
    return null;
  }
  const control = file.controls[activeControlId];
  return (
    <>
      <Title>
        <Icon>⚙️</Icon> {control.name}
      </Title>
      <ControlPanel>
        <Control label="Value">
          <input
            type={"range"}
            min={0}
            max={control.steps.length - 1}
            step={0.01}
            value={slideValue}
            onChange={onChange}
          />
          <p>{slideValue}</p>
        </Control>
      </ControlPanel>
    </>
  );
};
