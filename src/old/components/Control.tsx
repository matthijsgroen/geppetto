import styled from "styled-components";
import { ControlStyle, ToolbarLabel } from "./Toolbar";
export { ControlStyle } from "./Toolbar";

export const Control = styled.div<{ controlStyle?: ControlStyle }>`
  color: ${({ theme, controlStyle }) =>
    controlStyle === ControlStyle.Selected
      ? theme.colors.textSelected
      : theme.colors.text};
  background-color: ${({ theme, controlStyle }) =>
    controlStyle === ControlStyle.Selected
      ? theme.colors.backgroundSelected
      : controlStyle === ControlStyle.Highlighted
      ? theme.colors.background
      : theme.colors.itemContainerBackground};
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  display: flex;
`;

export const ControlLabel = styled(ToolbarLabel)`
  padding: 0 1rem;
  flex: 1;
  align-self: center;
`;
