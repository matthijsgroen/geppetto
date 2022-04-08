import styled from "styled-components";

type PanelProps = {
  padding?: number;
};

const StyledPanel = styled.div<{ padding: number }>`
  padding: ${(props) => props.padding}px;
  background-color: ${(props) => props.theme.colors.controlDefault};
  color: ${(props) => props.theme.colors.textDefault};
  width: calc(100% - ${(props) => props.padding * 2}px);
  height: calc(100% - ${(props) => props.padding * 2}px);
`;

export const Panel: React.FC<PanelProps> = ({ children, padding = 0 }) => (
  <StyledPanel padding={padding}>{children}</StyledPanel>
);
