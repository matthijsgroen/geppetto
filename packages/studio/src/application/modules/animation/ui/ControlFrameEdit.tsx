import type {
  AnimationControlTrack,
  FrameControlAction,
} from "@geppetto/types";
import type { FC } from "react";

import { ToggleControl } from "@/application/modules/composition/ui/controls";
import { useFile } from "@/application/state/FileContext";
import {
  Column,
  Control,
  ControlPanel,
  Inlay,
  Menu,
  MenuItem,
  MenuRadioGroup,
  RangeInput,
  RangeValue,
  TimeCurve,
  ToolButton,
} from "@/ui/components";

export const ControlFrameEdit: FC<{
  animationId: string;
  track: AnimationControlTrack;
  frame: FrameControlAction;
  actionIndex: number;
}> = ({ track, frame }) => {
  const [file] = useFile();

  return (
    <Inlay>
      <ControlPanel>
        <Control label="Control">
          <select value={track.controlId}>
            {Object.entries(file.controls).map(([controlId, control]) => (
              <option key={controlId} value={controlId}>
                {control.name}
              </option>
            ))}
          </select>
        </Control>
        <Control label="Start with current value">
          <ToggleControl value={frame.controlStartValue === undefined} />
        </Control>
        {frame.controlStartValue !== undefined && (
          <Control label="Start value">
            <Column>
              <RangeInput
                max={1}
                min={0}
                step={0.01}
                value={frame.controlStartValue}
              />
              <RangeValue value={frame.controlStartValue} />
            </Column>
          </Control>
        )}
        <Control label="End value">
          <Column>
            <RangeInput
              max={1}
              min={0}
              step={0.01}
              value={frame.controlEndValue}
            />
            <RangeValue value={frame.controlEndValue} />
          </Column>
        </Control>
        <Control label="Easing function">
          <Menu
            align="center"
            arrow
            direction="bottom"
            menuButton={({ open }) => (
              <ToolButton
                active={open}
                label={
                  <>
                    <TimeCurve size="option" variant={frame.easingFunction} />{" "}
                    {frame.easingFunction}
                  </>
                }
              />
            )}
            portal
            transition
          >
            <MenuRadioGroup value={frame.easingFunction}>
              {(["linear", "easeIn", "easeOut", "easeInOut"] as const).map(
                (timing) => (
                  <MenuItem
                    key={`timing${timing}`}
                    onClick={() => {}}
                    type="radio"
                    value={timing}
                  >
                    <TimeCurve size="option" variant={timing} /> {timing}
                  </MenuItem>
                )
              )}
            </MenuRadioGroup>
          </Menu>
        </Control>
        <Control>
          <ToolButton disabled label="Done" standAlone />
        </Control>
      </ControlPanel>
    </Inlay>
  );
};
