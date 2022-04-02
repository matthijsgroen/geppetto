import styled from "styled-components";

export const ToolBar = styled.div`
  flex: 0;
  background-color: ${({ theme }) => theme.colors.controlDefault};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;

  padding: 0 0.2rem;
  > * + * {
    margin-left: 0.25rem;
  }
`;
