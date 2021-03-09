import styled from "styled-components";

export const Toolbar = styled.div`
  flex: 0;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  font-weight: normal;
  display: flex;
  flex-direction: row;

  padding: 0 0.2rem;
  > * + * {
    margin-left: 0.25rem;
  }
`;
