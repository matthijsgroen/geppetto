import type { MenuState } from "@szhsin/react-menu";
import type { FC } from "react";

import { AnimationContextMenu } from "@/application/modules/animation/ui/AnimationContextMenu";
import { useFile } from "@/application/state/FileContext";
import {
  deleteControlTrackFromAnimation,
  moveControlTrackToAnimation,
} from "@/domain/animation/file2/animations";
import { getControlIdByName } from "@/domain/animation/file2/testFileBuilder";
import { MenuHeader, MenuItem, SubMenu } from "@/ui/components";

type ControlTrackContextMenuProps = {
  anchorPoint: { x: number; y: number };
  state?: MenuState;
  endTransition?: () => void;
  onClose: () => void;
  animationId: string;
  trackName: string;
};

export const ControlTrackContextMenu: FC<ControlTrackContextMenuProps> = ({
  onClose,
  trackName,
  animationId,
  ...menuProps
}) => {
  const [file, setFile] = useFile();
  const controlId = getControlIdByName(file, trackName);
  const otherAnimations = Object.entries(file.animations).filter(
    ([id]) => id !== animationId
  );

  return (
    <AnimationContextMenu {...menuProps} onClose={onClose}>
      <MenuHeader>{trackName}</MenuHeader>
      <SubMenu label="Move to...">
        {otherAnimations.map(([id, animation]) => (
          <MenuItem
            key={id}
            onClick={() => {
              setFile(moveControlTrackToAnimation(animationId, id, controlId));
            }}
          >
            {animation.name}
          </MenuItem>
        ))}
      </SubMenu>
      <MenuItem
        dangerous
        onClick={() => {
          setFile(deleteControlTrackFromAnimation(animationId, controlId));
        }}
      >
        Delete
      </MenuItem>
    </AnimationContextMenu>
  );
};
