import styled from "styled-components";

export const ToolBar = styled.div`
  flex: 0;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 0 0.2rem;
  display: flex;
  flex-direction: row;
`;
