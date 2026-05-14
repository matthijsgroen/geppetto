import { Fragment } from "react/jsx-runtime";

import { useFile } from "@/application/state/FileContext";
import { Control, TextButton } from "@/ui/components";

export const MutationControlled: React.FC<{
  mutationId: string;
  editingControlId?: string;
  onSelectControl?: (controlId: string) => void;
}> = ({ mutationId, editingControlId, onSelectControl }) => {
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
        <p>
          {affectingControls.map(([id, c], idx, list) =>
            idx === list.length - 1 ? (
              <TextButton key={id} onClick={() => onSelectControl?.(id)}>
                {id === editingControlId ? <strong>{c.name}</strong> : c.name}
              </TextButton>
            ) : (
              <Fragment key={id}>
                <TextButton onClick={() => onSelectControl?.(id)}>
                  {id === editingControlId ? <strong>{c.name}</strong> : c.name}
                </TextButton>
                {", "}
              </Fragment>
            )
          )}
        </p>
      </Control>
    );
  }
  return null;
};
