import styled from "styled-components";

type PanelProps = {
  padding?: number;
};

const StyledPanel = styled.div<{ padding: number }>`
  padding: ${(props) => props.padding}px;
  background-color: ${(props) => props.theme.colors.controlDefault};
  color: ${(props) => props.theme.colors.textDefault};
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow: hidden;
`;

export const Panel: React.FC<PanelProps> = ({ children, padding = 0 }) => (
  <StyledPanel padding={padding}>{children}</StyledPanel>
);
