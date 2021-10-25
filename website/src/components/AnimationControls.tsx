import {
  AnimationControls as GeppettoAnimationControls,
  PreparedImageDefinition,
} from "geppetto-player";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

type Props = {
  controls: GeppettoAnimationControls;
  animation: PreparedImageDefinition;
};

const AnimationGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, 15em);
  grid-auto-columns: 15em;
  grid-auto-rows: 2em;
  gap: 0.5em;
  padding: 0;
  margin: 1em 0;
  list-style: none;
  & > li + li {
    margin-top: 0;
  }
`;

const AnimationButton = styled.button`
  display: block;
  width: 100%;
  height: 100%;
`;

const AnimationControls: FunctionComponent<Props> = ({
  animation,
  controls,
}) => {
  return (
    <div>
      <h3>Interactions</h3>
      <h4>Animations</h4>
      <AnimationGrid>
        {animation.animations.map((a) => (
          <li key={a.name}>
            <AnimationButton>{a.name}</AnimationButton>
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
