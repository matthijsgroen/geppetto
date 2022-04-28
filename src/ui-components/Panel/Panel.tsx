import { PropsWithChildren } from "react";
import styled, { css } from "styled-components";

type PanelProps = PropsWithChildren<{
  padding?: number;
  workspace?: boolean;
  center?: boolean;
}>;

const StyledPanel = styled.div<{
  padding: number;
  workspace: boolean;
  center: boolean;
}>`
  padding: ${(props) => props.padding}px;
  background-color: ${(props) =>
    props.workspace
      ? props.theme.colors.backgroundWorkspace
      : props.theme.colors.backgroundPanel};
  color: ${(props) => props.theme.colors.textDefault};
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow: hidden;
  ${(props) =>
    props.center
      ? css`
          align-items: center;
          justify-content: center;
        `
      : ""}
`;

/**
 * Basic component that applies the proper theme color as background,
 * supports padding and supports centralizing elements.
 */
export const Panel: React.FC<PanelProps> = ({
  children,
  padding = 0,
  workspace = false,
  center = false,
}) => (
  <StyledPanel padding={padding} workspace={workspace} center={center}>
    {children}
  </StyledPanel>
);
