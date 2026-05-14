import type { Vec2 } from "@geppetto/types";
import { produce } from "immer";
import { useTransition } from "react";

import { useFile, useFileUndoRedo } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import { useDirectMutationValues } from "@/application/state/ImageControlContext";
import { updateMutationValue } from "@/domain/animation/file2/mutation";
import {
  setLayerOffset,
  toggleVisibility,
} from "@/domain/animation/file2/shapes";
import { defaultValueForVector } from "@/infrastructure/webgl/lib/vertices";
import {
  Control,
  ControlPanel,
  Icon,
  Kbd,
  PanelTitle,
  Paragraph,
  ToggleInput,
} from "@/ui/components";

import { VectorControl } from "./controls";
import { MutationControlled } from "./editors/MutationControlled";
import { MutationEdit } from "./editors/MutationEdit";
import { MutationValueEdit } from "./editors/MutationValueEdit";

type ItemEditProps = {
  activeMutator: string | null;
  editingControlId?: string;
  editingControlStep?: number;
  onSelectControl?: (controlId: string) => void;
};

type EditProps = {
  itemId: string;
  onSelectControl?: (controlId: string) => void;
};

const blankValue: Vec2 = [0, 0];

const LayerFolderEdit: React.FC<EditProps> = ({ itemId }) => {
  const [file, setFile] = useFile();
  const layerFolder = file.layerFolders[itemId];

  const handleClick = useEvent(() => {
    setFile(toggleVisibility(itemId));
  });

  return (
    <>
      <PanelTitle>
        <Icon>📁</Icon> {layerFolder.name}
      </PanelTitle>
      <ControlPanel>
        <Control htmlFor={`${itemId}_visibility`} label="Visible">
          <ToggleInput
            checked={layerFolder.visible}
            id={`${itemId}_visibility`}
            onChange={handleClick}
          />
        </Control>
      </ControlPanel>
      <Paragraph size="small">
        Use
        <Kbd shortcut={{ interaction: "MouseDrag", shift: true }} /> to move the
        folder contents
      </Paragraph>
    </>
  );
};

const LayerEdit: React.FC<EditProps> = ({ itemId }) => {
  const [file, setFile] = useFile();
  const { setGrouped, endGrouping } = useFileUndoRedo();
  const layer = file.layers[itemId];

  const handleClick = useEvent(() => {
    setFile(toggleVisibility(itemId));
  });

  const offsetChangeHandler = useEvent((newValue: Vec2) => {
    setGrouped(`layerOffset-${itemId}`, setLayerOffset(itemId, newValue));
  });

  return (
    <>
      <PanelTitle>
        <Icon>📄</Icon> {layer.name}
      </PanelTitle>
      <ControlPanel>
        <VectorControl
          label="Offset"
          onBlur={endGrouping}
          onChange={offsetChangeHandler}
          value={layer.translate}
        />
        <Control label="Visible">
          <ToggleInput checked={layer.visible} onChange={handleClick} />
        </Control>
      </ControlPanel>
      <Paragraph size="small">
        Use
        <Kbd shortcut={{ interaction: "MouseDrag", shift: true }} /> to change
        the layer offset
      </Paragraph>
    </>
  );
};

export const ItemEdit: React.FC<
  ItemEditProps & { selectedShapeIds: string[] }
> = ({ selectedShapeIds, activeMutator }) => {
  const [file] = useFile();
  const activeShapeId =
    activeMutator ||
    (selectedShapeIds.length === 1 ? selectedShapeIds[0] : null);
  const hierarchyItem =
    activeShapeId !== null ? file.layerHierarchy[activeShapeId] : null;

  if (activeShapeId !== null && hierarchyItem?.type === "layer") {
    return <LayerEdit itemId={activeShapeId} />;
  }
  if (activeShapeId !== null && hierarchyItem?.type === "layerFolder") {
    return <LayerFolderEdit itemId={activeShapeId} />;
  }

  if (activeShapeId !== null && hierarchyItem?.type === "mutation") {
    return <MutationEdit itemId={activeShapeId} key={activeShapeId} />;
  }
  return (
    <>
      <PanelTitle>No selection</PanelTitle>
    </>
  );
};

export const InlayControlPanel: React.FC<ItemEditProps> = ({
  activeMutator,
  editingControlId,
  onSelectControl,
  editingControlStep = 0,
}) => {
  const { state: file, setGrouped: setFile, endGrouping } = useFileUndoRedo();
  const [, startTransition] = useTransition();

  const [mutationValues, updateMutationValues] = useDirectMutationValues();

  const mutationValue: Vec2 = !activeMutator
    ? blankValue
    : editingControlId !== undefined
      ? file.controls[editingControlId].steps[editingControlStep][activeMutator]
      : (mutationValues[activeMutator] ??
        defaultValueForVector(file.mutations[activeMutator].type));

  const valueChangeHandler = useEvent((newValue: Vec2) => {
    if (activeMutator === null) return;
    if (editingControlId === undefined) {
      updateMutationValues((mutations) => ({
        ...mutations,
        [activeMutator]: newValue,
      }));
      startTransition(() => {
        setFile("mutationUpdate", updateMutationValue(activeMutator, newValue));
      });
    } else {
      setFile(
        "controlStepUpdate",
        produce((draft) => {
          draft.controls[editingControlId].steps[editingControlStep][
            activeMutator
          ] = newValue;
        })
      );
    }
  });

  if (activeMutator) {
    const mutationType = file.mutations[activeMutator].type;
    return (
      <ControlPanel shadow>
        <MutationControlled
          editingControlId={editingControlId}
          mutationId={activeMutator}
          onSelectControl={onSelectControl}
        />
        <MutationValueEdit
          mutationType={mutationType}
          onBlur={() => {
            endGrouping();
          }}
          onValueChange={valueChangeHandler}
          value={mutationValue}
        />
      </ControlPanel>
    );
  }
  return null;
};
