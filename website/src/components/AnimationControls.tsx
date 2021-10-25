import {
  AnimationControls as GeppettoAnimationControls,
  PreparedImageDefinition,
} from "geppetto-player";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled, { css } from "styled-components";

type Props = {
  controls: GeppettoAnimationControls;
  animation: PreparedImageDefinition;
};

const AnimationGrid = styled.ul`
  display: grid;
  font-size: 0.25rem;
  grid-template-columns: repeat(auto-fill, 30em);
  grid-auto-rows: 6em;
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

const AnimationControls: FunctionComponent<Props> = ({
  animation,
  controls,
}) => {
  const [trackStates, setTrackStates] = useState<Record<string, boolean>>({});
  useEffect(() => {
    return controls.onTrackStopped((trackName) => {
      setTrackStates((state) => ({ ...state, [trackName]: false }));
    });
  }, []);

  return (
    <div>
      <h3>Interactions</h3>
      <h4>Animations</h4>
      <AnimationGrid>
        {animation.animations.map((a) => (
          <li key={a.name}>
            <AnimationButton
              playstate={trackStates[a.name] === true ? "playing" : "stopped"}
              onClick={() => {
                if (trackStates[a.name] === true) {
                  controls.stopTrack(a.name);
                  setTrackStates((state) => ({ ...state, [a.name]: false }));
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
      {animation.controls.map((c) => (
        <li key={c.name}>{c.name}</li>
      ))}
    </div>
  );
};

export default AnimationControls;
