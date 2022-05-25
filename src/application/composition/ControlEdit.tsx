import produce from "immer";
import { ChangeEvent, useCallback, useTransition } from "react";
import { Control, ControlPanel, Icon, Title } from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";

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

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (activeControlId === null) return;
      const value = e.currentTarget.valueAsNumber;
      startTransition(() => {
        setFile(
          produce((draft) => {
            draft.controlValues[activeControlId] = value;
          })
        );
      });
    },
    [setFile, activeControlId]
  );

  if (
    activeControlId === null ||
    !hierarchyItem ||
    hierarchyItem.type !== "control"
  ) {
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
            value={file.controlValues[activeControlId]}
            onChange={onChange}
          />
          <p>{file.controlValues[activeControlId]}</p>
        </Control>
      </ControlPanel>
    </>
  );
};
