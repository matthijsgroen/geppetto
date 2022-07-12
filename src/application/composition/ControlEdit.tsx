import produce from "immer";
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  Control,
  ControlPanel,
  Icon,
  Title,
  ToolButton,
  ToolGrid,
} from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import {
  useControlValues,
  useUpdateControlValues,
} from "../contexts/ImageControlContext";
import useEvent from "../hooks/useEvent";

type ControlEditProps = {
  selectedControlIds: string[];
  editControlSteps?: boolean;
  onEditControlSteps?: (editing: boolean) => void;
};

const EditStepsToggle: React.FC<{
  editControlSteps?: boolean;
  onEditControlSteps: (editing: boolean) => void;
}> = ({ onEditControlSteps, editControlSteps = false }) => (
  <Control label="Control steps">
    <ToolButton
      label={editControlSteps ? "Done" : "Edit"}
      onClick={useEvent(() => onEditControlSteps(!editControlSteps))}
    />
  </Control>
);

export const ControlEdit: React.FC<ControlEditProps> = ({
  selectedControlIds,
  editControlSteps = false,
  onEditControlSteps,
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
  const controlValues = useControlValues();
  const updateControlValues = useUpdateControlValues();

  const controlValue = isNoControl ? 0 : controlValues.current[activeControlId];
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
    updateControlValues((current) => ({
      ...current,
      [activeControlId]: value,
    }));
    startTransition(() => {
      setFile(
        produce((draft) => {
          draft.controlValues[activeControlId] = value;
        })
      );
    });
  });

  const handleStepSelect = useEvent((e: MouseEvent<HTMLButtonElement>) => {
    if (activeControlId === null) return;
    const value = Number(e.currentTarget.getAttribute("data-value"));
    updateControlValues((current) => ({
      ...current,
      [activeControlId]: value,
    }));
  });

  const handleEditControlSteps = useEvent((active: boolean) => {
    if (activeControlId === null) return;

    updateControlValues((current) => ({
      ...current,
      [activeControlId]: active ? 0 : file.controlValues[activeControlId],
    }));
    onEditControlSteps && onEditControlSteps(active);
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
        {!editControlSteps && (
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
        )}
        {editControlSteps && (
          <Control label="Steps">
            <ToolGrid size="small">
              {control.steps.map((_step, index) => (
                <ToolButton
                  label={`${index + 1}`}
                  data-value={index}
                  active={index === 0}
                  key={index}
                  onClick={handleStepSelect}
                />
              ))}
              <ToolButton label="+" disabled />
            </ToolGrid>
          </Control>
        )}
        {onEditControlSteps && (
          <EditStepsToggle
            onEditControlSteps={handleEditControlSteps}
            editControlSteps={editControlSteps}
          />
        )}
      </ControlPanel>
    </>
  );
};
