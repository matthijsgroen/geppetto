import type { Vec2 } from "@geppetto/types";
import { useState, useTransition } from "react";

import { NumberControl } from "@/application/modules/composition/ui/controls/NumberControl";
import { ToggleControl } from "@/application/modules/composition/ui/controls/ToggleControl";
import { VectorControl } from "@/application/modules/composition/ui/controls/VectorControl";
import { useFile } from "@/application/state/FileContext";
import { useEvent } from "@/application/state/hooks/useEvent";
import {
  useMutationValues,
  useUpdateMutationValues,
} from "@/application/state/ImageControlContext";
import {
  hasRadius,
  iconMapping,
  isShapeMutationVector,
  setMutationOrigin,
  toggleMutationRadius,
  updateMutationRadius,
  updateMutationValue,
} from "@/domain/animation/file2/mutation";
import { defaultValueForVector } from "@/infrastructure/webgl/lib/vertices";
import {
  ControlPanel,
  Icon,
  Kbd,
  PanelTitle,
  Paragraph,
} from "@/ui/components";

import { MutationControlled } from "./MutationControlled";
import { MutationValueEdit } from "./MutationValueEdit";

type EditProps = {
  itemId: string;
  onSelectControl?: (controlId: string) => void;
};

const blankValue: Vec2 = [0, 0];

export const MutationEdit: React.FC<EditProps> = ({
  itemId,
  onSelectControl,
}) => {
  const [file, setFile] = useFile();
  const mutation = file.mutations[itemId];
  const updateMutations = useUpdateMutationValues();
  const [, startTransition] = useTransition();

  const mutationValues = useMutationValues();

  const mutationValue: Vec2 = !itemId
    ? blankValue
    : (mutationValues.current[itemId] ?? defaultValueForVector(mutation.type));
  const [slideValue, setSlideValue] = useState(mutationValue);

  const radiusChange = useEvent((newRadius: number) => {
    setFile(updateMutationRadius(itemId, newRadius));
  });

  const toggleRadius = useEvent((newValue: boolean) => {
    setFile(toggleMutationRadius(itemId, newValue));
  });

  const originChangeHandler = useEvent((newValue: Vec2) => {
    setFile(setMutationOrigin(itemId, newValue));
  });

  const valueChangeHandler = useEvent((newValue: Vec2) => {
    updateMutations((mutations) => ({ ...mutations, [itemId]: newValue }));
    setSlideValue(newValue);
    startTransition(() => {
      setFile(updateMutationValue(itemId, newValue));
    });
  });

  return (
    <>
      <PanelTitle>
        <Icon>{iconMapping[mutation.type]}</Icon> {mutation.name}
      </PanelTitle>
      <ControlPanel>
        {isShapeMutationVector(mutation) && (
          <VectorControl
            label="Origin"
            onChange={originChangeHandler}
            value={mutation.origin}
          />
        )}
        {hasRadius(mutation) && (
          <>
            <ToggleControl
              label="Use radius"
              onChange={toggleRadius}
              value={mutation.radius !== -1}
            />
            {mutation.radius !== -1 && (
              <NumberControl
                label="Radius"
                minValue={0}
                onChange={radiusChange}
                value={mutation.radius}
              />
            )}
          </>
        )}
        <MutationControlled
          mutationId={itemId}
          onSelectControl={onSelectControl}
        />
        <MutationValueEdit
          mutationType={mutation.type}
          onValueChange={valueChangeHandler}
          value={slideValue}
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
