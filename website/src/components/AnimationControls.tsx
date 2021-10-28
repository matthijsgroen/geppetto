import {
  AnimationControls as GeppettoAnimationControls,
  PreparedImageDefinition,
} from "geppetto-player";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled, { css } from "styled-components";

type Props = {
  controls?: GeppettoAnimationControls;
  animation?: PreparedImageDefinition;
  width: number;
};

const AnimationGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, 7em);
  grid-auto-rows: 1.5em;
  gap: 0.5em;
  padding: 0;
  margin: 1em 0;
  list-style: none;
  & > li + li {
    margin-top: 0;
  }
`;

const ControlGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, 7em);
  grid-auto-rows: 3em;
  gap: 0.5em;
  padding: 0;
  margin: 1em 0;
  list-style: none;
  & > li + li {
    margin-top: 0;
  }
`;

export type PlayState = "playing" | "stopped";

const AnimationButton = styled.button<{ playstate: PlayState }>`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  padding-left: 2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--ifm-color-info-contrast-background);
  border: 1px solid var(--ifm-menu-color-background-active);

  &::before {
    content: "▶️ ";
    display: block;
    position: absolute;
    top: 0;
    margin-left: -1.5em;
    margin-top: -0.1em;
  }

  ${(props) =>
    props.playstate === "playing" &&
    css`
      box-shadow: 0px 0px 9px var(--ifm-color-success);

      &::before {
        content: "⏹ ";
      }
    `}
`;

const AnimationControl = styled.li`
  border: 1px solid var(--ifm-menu-color-background-active);
  background: var(--ifm-color-info-contrast-background);
  border-radius: 2px;
  font-size: 0.8em;
  padding: 0 0.2em;
`;

const ControlSlider = styled.input.attrs(() => ({
  type: "range",
  min: 0,
  max: 1,
  step: 0.01,
}))`
  width: calc(100% - 0.2em);
`;

const SidePanel = styled.aside`
  position: absolute;
  top: 0;
  right: 0;
  width: 9em;
  height: calc(100% - 0.5em);
  padding: 0.5em;
  background: rgba(96, 96, 96, 0.5);
  overflow: scroll;

  & h4 {
    color: white;
  }
`;

const createInitialControlValues = (
  animation: PreparedImageDefinition,
  controls: GeppettoAnimationControls
): Record<string, number> => {
  const initialControlValues = {};
  animation.controls.map((c) => {
    initialControlValues[c.name] = controls.getControlValue(c.name);
  });
  return initialControlValues;
};

const AnimationControls: FunctionComponent<Props> = ({
  animation,
  controls,
  width,
  children,
}) => {
  const [trackStates, setTrackStates] = useState<Record<string, boolean>>({});
  const [controlValues, setControlValues] = useState<Record<string, number>>(
    () =>
      animation && controls
        ? createInitialControlValues(animation, controls)
        : {}
  );
  useEffect(() => {
    if (!controls) return;
    setControlValues(createInitialControlValues(animation, controls));

    return controls.onTrackStopped((trackName) => {
      setTrackStates((state) => ({ ...state, [trackName]: false }));
    });
  }, [controls]);

  useEffect(() => {
    if (!animation || !controls) return;
    const initialControlValues = {};
    if (animation.controls) {
      animation.controls.map((c) => {
        initialControlValues[c.name] = controls.getControlValue(c.name);
      });
    }
    setControlValues(initialControlValues);
  }, [animation, controls]);

  return (
    <div
      style={{
        position: "relative",
        width: `min(100%, ${width}px)`,
        overflow: "hidden",
      }}
    >
      {children}
      {controls && animation && (
        <SidePanel>
          <h4>Animations</h4>
          <AnimationGrid>
            {animation.animations.map((a) => (
              <li key={a.name}>
                <AnimationButton
                  playstate={
                    trackStates[a.name] === true ? "playing" : "stopped"
                  }
                  onClick={() => {
                    if (trackStates[a.name] === true) {
                      controls.stopTrack(a.name);
                      setTrackStates((state) => ({
                        ...state,
                        [a.name]: false,
                      }));
                    } else {
                      controls.startTrack(a.name);
                      setTrackStates((state) => ({ ...state, [a.name]: true }));
                    }
                  }}
                  title={a.name}
                >
                  {a.name}
                </AnimationButton>
              </li>
            ))}
          </AnimationGrid>

          <h4>Controls</h4>
          <ControlGrid>
            {animation.controls.map((c) => (
              <AnimationControl key={c.name}>
                {c.name}
                <ControlSlider
                  value={
                    controlValues[c.name] === undefined
                      ? 0
                      : (controlValues[c.name] ?? 0.0) / (c.steps - 1)
                  }
                  onChange={(value) => {
                    const sliderValue = value.currentTarget.valueAsNumber;
                    const controlValue = sliderValue * (c.steps - 1);
                    setControlValues((state) => ({
                      ...state,
                      [c.name]: controlValue,
                    }));
                    controls.setControlValue(c.name, controlValue);
                  }}
                />
              </AnimationControl>
            ))}
          </ControlGrid>
        </SidePanel>
      )}
    </div>
  );
};

export default AnimationControls;
