import produce from "immer";
import { useEffect, useState, useTransition } from "react";
import {
  hasRadius,
  iconMapping,
  isShapeMutationVector,
} from "../../animation/file2/mutation";
import { Vec2 } from "../../types";
import { Control, ControlPanel, Icon, Kbd, Title } from "../../ui-components";
import { Paragraph } from "../../ui-components/Paragraph/Paragraph";
import { useFile } from "../applicationMenu/FileContext";
import {
  useMutationValues,
  useUpdateMutationValues,
} from "../contexts/ImageControlContext";
import { BooleanControl } from "../controls/CheckControl";
import { NumberControl } from "../controls/NumberControl";
import { VectorControl } from "../controls/VectorControl";
import useEvent from "../hooks/useEvent";
import {
  MutationControlled,
  MutationValueEdit,
} from "./editors/MutationValueEdit";

type ItemEditProps = {
  activeMutator: string | null;
  editingControlId?: string;
  editingControlStep?: number;
};

type EditProps = {
  itemId: string;
};

const blankValue: Vec2 = [0, 0];

const LayerFolderEdit: React.FC<EditProps> = ({ itemId }) => {
  const [file, setFile] = useFile();
  const layerFolder = file.layerFolders[itemId];

  const handleClick = useEvent(() => {
    setFile(
      produce((draft) => {
        draft.layerFolders[itemId].visible =
          !draft.layerFolders[itemId].visible;
      })
    );
  });

  return (
    <>
      <Title>
        <Icon>📁</Icon> {layerFolder.name}
      </Title>
      <ControlPanel>
        <Control label="Visible">
          <input
            type="checkbox"
            checked={layerFolder.visible}
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
  const layer = file.layers[itemId];

  const handleClick = useEvent(() => {
    setFile(
      produce((draft) => {
        draft.layers[itemId].visible = !draft.layers[itemId].visible;
      })
    );
  });

  const offsetChangeHandler = useEvent((newValue: Vec2) => {
    setFile(
      produce((draft) => {
        draft.layers[itemId].translate = newValue;
      })
    );
  });

  return (
    <>
      <Title>
        <Icon>📄</Icon> {layer.name}
      </Title>
      <ControlPanel>
        <VectorControl
          label="Offset"
          value={layer.translate}
          onChange={offsetChangeHandler}
        />
        <Control label="Visible">
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={handleClick}
          />
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

const MutationEdit: React.FC<EditProps> = ({ itemId }) => {
  const [file, setFile] = useFile();
  const mutation = file.mutations[itemId];
  const updateMutations = useUpdateMutationValues();
  const [, startTransition] = useTransition();

  const mutationValues = useMutationValues();

  const mutationValue: Vec2 = !itemId
    ? blankValue
    : mutationValues.current[itemId];
  const [slideValue, setSlideValue] = useState(mutationValue);

  useEffect(() => {
    if (itemId) {
      setSlideValue(mutationValues.current[itemId]);
    }
  }, [itemId, mutationValues]);

  const radiusChange = useEvent((newRadius: number) => {
    setFile(
      produce((draft) => {
        const mutation = draft.mutations[itemId];
        if (hasRadius(mutation)) {
          mutation.radius = newRadius;
        }
      })
    );
  });

  const toggleRadius = useEvent((newValue: boolean) => {
    setFile(
      produce((draft) => {
        const mutation = draft.mutations[itemId];
        if (hasRadius(mutation)) {
          mutation.radius = newValue ? 10 : -1;
        }
      })
    );
  });

  const originChangeHandler = useEvent((newValue: Vec2) => {
    setFile(
      produce((draft) => {
        const mutation = draft.mutations[itemId];
        mutation.origin = newValue;
      })
    );
  });

  const valueChangeHandler = useEvent((newValue: Vec2) => {
    updateMutations((mutations) => ({ ...mutations, [itemId]: newValue }));
    setSlideValue(newValue);
    startTransition(() => {
      setFile(
        produce((draft) => {
          draft.defaultFrame[itemId] = newValue;
        })
      );
    });
  });

  return (
    <>
      <Title>
        <Icon>{iconMapping[mutation.type]}</Icon> {mutation.name}
      </Title>
      <ControlPanel>
        {isShapeMutationVector(mutation) && (
          <VectorControl
            label="Origin"
            value={mutation.origin}
            onChange={originChangeHandler}
          />
        )}
        {hasRadius(mutation) && (
          <>
            <BooleanControl
              label="Use radius"
              value={mutation.radius !== -1}
              onChange={toggleRadius}
            />
            {mutation.radius !== -1 && (
              <NumberControl
                label="Radius"
                value={mutation.radius}
                minValue={0}
                onChange={radiusChange}
              />
            )}
          </>
        )}
        <MutationControlled mutationId={itemId} />
        <MutationValueEdit
          mutationType={mutation.type}
          value={slideValue}
          onValueChange={valueChangeHandler}
        />
      </ControlPanel>
      {isShapeMutationVector(mutation) && (
        <Paragraph size="small">
          Use
          <Kbd shortcut={{ interaction: "MouseDrag", shift: true }} /> to move
          the mutator origin
        </Paragraph>
      )}
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

  if (
    activeShapeId !== null &&
    hierarchyItem &&
    hierarchyItem.type === "layer"
  ) {
    return <LayerEdit itemId={activeShapeId} />;
  }
  if (
    activeShapeId !== null &&
    hierarchyItem &&
    hierarchyItem.type === "layerFolder"
  ) {
    return <LayerFolderEdit itemId={activeShapeId} />;
  }

  if (
    activeShapeId !== null &&
    hierarchyItem &&
    hierarchyItem.type === "mutation"
  ) {
    return <MutationEdit itemId={activeShapeId} />;
  }
  return (
    <>
      <Title>No selection</Title>
    </>
  );
};

export const InlayControlPanel: React.FC<ItemEditProps> = ({
  activeMutator,
  editingControlId,
  editingControlStep = 0,
}) => {
  const [file, setFile] = useFile();
  const [, startTransition] = useTransition();

  const mutationValues = useMutationValues();
  const updateMutationValues = useUpdateMutationValues();

  const mutationValue: Vec2 = !activeMutator
    ? blankValue
    : editingControlId !== undefined
    ? file.controls[editingControlId].steps[editingControlStep][activeMutator]
    : mutationValues.current[activeMutator];
  const [slideValue, setSlideValue] = useState(mutationValue);

  useEffect(() => {
    if (activeMutator) {
      const mutationValue: Vec2 = editingControlId
        ? file.controls[editingControlId].steps[editingControlStep][
            activeMutator
          ]
        : mutationValues.current[activeMutator];
      setSlideValue(mutationValue);
    }
  }, [
    activeMutator,
    mutationValues,
    editingControlId,
    editingControlStep,
    file.controls,
  ]);

  const valueChangeHandler = useEvent((newValue: Vec2) => {
    if (activeMutator === null) return;
    setSlideValue(newValue);
    if (editingControlId === undefined) {
      updateMutationValues((mutations) => ({
        ...mutations,
        [activeMutator]: newValue,
      }));
      startTransition(() => {
        setFile(
          produce((draft) => {
            draft.defaultFrame[activeMutator] = newValue;
          })
        );
      });
    } else {
      setFile(
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
          mutationId={activeMutator}
          editingControlId={editingControlId}
        />
        <MutationValueEdit
          mutationType={mutationType}
          value={slideValue}
          onValueChange={valueChangeHandler}
        />
      </ControlPanel>
    );
  }
  return null;
};
