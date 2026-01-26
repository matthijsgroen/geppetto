import type { AnimationControlTrack, ControlDefinition } from "@geppetto/types";
import { type FC, useState } from "react";

import { usePlayerControls } from "@/application/modules/animation/state/PlayerControlsProvider";
import { ToggleControl } from "@/application/modules/composition/ui/controls";
import { formatTime } from "@/application/shared/timeFormatter";
import { useFile } from "@/application/state/FileContext";
import {
  getAnimationControlFrame,
  updateControlFrame,
} from "@/domain/animation/file2/animations";
import {
  Column,
  Control,
  ControlPanel,
  Label,
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
  quickEdit?: boolean;
  shadow?: boolean;
}> = ({
  control,
  shadow = false,
  quickEdit = false,
  animationId,
  track,
  actionIndex,
}) => {
  const [file, setFile] = useFile();
  const controlMaxValue = control.steps.length - 1;
  const { setTimestamp, showControlValue } = usePlayerControls();

  const frame = getAnimationControlFrame(
    file,
    animationId,
    track.controlId,
    actionIndex
  );
  if (!frame) throw new Error("Control frame not found");

  const [startValue, setStartValue] = useState(frame.controlStartValue);
  const [endValue, setEndValue] = useState(frame.controlEndValue);
  const speed = file.animations[animationId].speedModifier ?? 1;

  const updateStartValue = () => {
    showControlValue(track.controlId, null);
    setFile(
      updateControlFrame(animationId, track.controlId, actionIndex, {
        startValue: startValue,
      })
    );
    setTimeout(() => {
      setTimestamp(frame.start / speed);
    }, 0);
  };

  const updateEndValue = () => {
    showControlValue(track.controlId, null);
    setFile(
      updateControlFrame(animationId, track.controlId, actionIndex, {
        endValue: endValue,
      })
    );
    setTimeout(() => {
      setTimestamp((frame.start + frame.duration) / speed);
    }, 0);
  };

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
              onBlur={updateStartValue}
              onChange={(e) => {
                setStartValue(e.target.valueAsNumber * controlMaxValue);
                showControlValue(
                  track.controlId,
                  e.target.valueAsNumber * controlMaxValue
                );
              }}
              onFocus={() => {
                setTimestamp(frame.start / speed);
              }}
              onMouseUp={updateStartValue}
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
            onBlur={updateEndValue}
            onChange={(e) => {
              setEndValue(e.target.valueAsNumber * controlMaxValue);
              showControlValue(
                track.controlId,
                e.target.valueAsNumber * controlMaxValue
              );
            }}
            onFocus={() => {
              setTimestamp((frame.start + frame.duration) / speed);
            }}
            onMouseUp={updateEndValue}
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
                  onClick={() => {
                    setFile(
                      updateControlFrame(
                        animationId,
                        track.controlId,
                        actionIndex,
                        {
                          easingFunction: timing,
                        }
                      )
                    );
                  }}
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
      {!quickEdit && (
        <>
          <Control label="Start at">
            <Label>{formatTime(frame.start / speed)}</Label>
          </Control>
          <Control label="Duration">
            <Label>{formatTime(frame.duration / speed)}</Label>
          </Control>
        </>
      )}
    </ControlPanel>
  );
};
