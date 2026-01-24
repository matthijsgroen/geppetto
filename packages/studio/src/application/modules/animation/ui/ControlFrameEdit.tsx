import type { AnimationControlTrack, ControlDefinition } from "@geppetto/types";
import { type FC, useState } from "react";

import { usePlayerControls } from "@/application/modules/animation/state/PlayerControlsProvider";
import { ToggleControl } from "@/application/modules/composition/ui/controls";
import { useFile } from "@/application/state/FileContext";
import {
  getAnimationControlFrame,
  updateControlFrame,
} from "@/domain/animation/file2/animations";
import {
  Column,
  Control,
  ControlPanel,
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
  control: ControlDefinition;
  actionIndex: number;
  shadow?: boolean;
}> = ({ control, shadow = false, animationId, track, actionIndex }) => {
  const [file, setFile] = useFile();
  const controlMaxValue = control.steps.length - 1;
  const { setTimestamp } = usePlayerControls();

  const frame = getAnimationControlFrame(
    file,
    animationId,
    track.controlId,
    actionIndex
  );
  if (!frame) throw new Error("Control frame not found");

  const [startValue, setStartValue] = useState(frame.controlStartValue);
  const [endValue, setEndValue] = useState(frame.controlEndValue);

  return (
    <ControlPanel shadow={shadow}>
      <Control label="Start with current value">
        <ToggleControl
          onChange={(newValue) => {
            setStartValue(newValue ? undefined : 0);
            setFile(
              updateControlFrame(animationId, track.controlId, actionIndex, {
                startValue: newValue ? null : 0,
              })
            );
          }}
          value={frame.controlStartValue === undefined}
        />
      </Control>
      {startValue !== undefined && (
        <Control label="Start value">
          <Column>
            <RangeInput
              max={1}
              min={0}
              onChange={(e) => {
                setStartValue(e.target.valueAsNumber * controlMaxValue);
                // showControlValue(
                //   track.controlId,
                //   e.target.valueAsNumber * controlMaxValue
                // );
              }}
              onFocus={() => {
                setTimestamp(frame.start);
              }}
              onMouseUp={() => {
                // showControlValue(track.controlId, null);
                setFile(
                  updateControlFrame(
                    animationId,
                    track.controlId,
                    actionIndex,
                    {
                      startValue: startValue,
                    }
                  )
                );
                setTimestamp(frame.start);
              }}
              step={0.01}
              value={startValue / controlMaxValue}
            />
            <RangeValue
              formatter={(v) => v.toFixed(2)}
              value={startValue / controlMaxValue}
            />
          </Column>
        </Control>
      )}
      <Control label="End value">
        <Column>
          <RangeInput
            max={1}
            min={0}
            onChange={(e) => {
              setEndValue(e.target.valueAsNumber * controlMaxValue);
              // showControlValue(
              //   track.controlId,
              //   e.target.valueAsNumber * controlMaxValue
              // );
            }}
            onFocus={() => {
              setTimestamp(frame.start + frame.duration);
            }}
            onMouseUp={() => {
              // showControlValue(track.controlId, null);
              setFile(
                updateControlFrame(animationId, track.controlId, actionIndex, {
                  endValue: endValue,
                })
              );
              setTimestamp(frame.start + frame.duration);
            }}
            step={0.01}
            value={endValue / controlMaxValue}
          />
          <RangeValue
            formatter={(v) => v.toFixed(2)}
            value={endValue / controlMaxValue}
          />
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
    </ControlPanel>
  );
};
