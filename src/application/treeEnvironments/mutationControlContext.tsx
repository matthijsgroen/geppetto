import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
} from "react";
import { useFile } from "../applicationMenu/FileContext";

const MutControlContext = createContext<{
  editControlId: string | undefined;
  mutationIds: string[];
}>({ editControlId: undefined, mutationIds: [] });

export const MutationControlContext: React.FC<
  PropsWithChildren<{ editControlId: string | undefined }>
> = ({ editControlId, children }) => {
  const [file] = useFile();
  const mutationIds = editControlId
    ? Object.keys(file.controls[editControlId].steps[0])
    : [];

  return (
    <MutControlContext.Provider value={{ editControlId, mutationIds }}>
      {children}
    </MutControlContext.Provider>
  );
};

export const ControlEditMode: React.FC<{
  render: (controlMutatorIds: string[]) => ReactElement;
}> = ({ render }) => {
  const { editControlId, mutationIds } = useContext(MutControlContext);
  if (editControlId) {
    return render(mutationIds);
  }
  return null;
};
