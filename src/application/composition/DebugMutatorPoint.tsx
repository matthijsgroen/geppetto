import styled from "styled-components";
import { Vec2 } from "../../types";

const Point = styled.div`
  position: absolute;
  z-index: 10;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid black;
  background-color: #eee8;
`;

export const DebugMutatorPoint: React.FC<{ point: Vec2 }> = ({ point }) => {
  return <Point style={{ left: point[0] - 6, top: point[1] - 6 }} />;
};
