import React, { FunctionComponent } from "react";
import styled from "styled-components";

type Area = {
  id: string;
  top: number;
  left: number;
  bottom: number;
  right: number;
  onClick: () => void;
  cursor: string;
};

type Props = {
  width: number;
  areas: Area[];
};

const ClickableArea = styled.div<Omit<Area, "id">>`
  position: absolute;
  top: ${(props) => props.top * 100}%;
  right: ${(props) => (1 - props.right) * 100}%;
  bottom: ${(props) => (1 - props.bottom) * 100}%;
  left: ${(props) => props.left * 100}%;
  cursor: ${(props) => props.cursor};
`;

const ClickableContainer = styled.div<{ width: number }>`
  position: relative;
  width: min(${(props) => props.width}, 100%);
`;

const ClickableAreas: FunctionComponent<Props> = ({
  children,
  areas,
  width,
}) => {
  return (
    <ClickableContainer width={width}>
      {children}
      {areas.map(({ id, ...area }) => (
        <ClickableArea key={id} {...area} />
      ))}
    </ClickableContainer>
  );
};

export default ClickableAreas;
