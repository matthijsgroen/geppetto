import styled from "styled-components";

export const Control = styled.div<{ selected?: boolean }>`
  color: ${({ theme, selected }) =>
    selected ? theme.colors.textSelected : theme.colors.text};
  background-color: ${({ theme, selected }) =>
    selected
      ? theme.colors.backgroundSelected
      : theme.colors.itemContainerBackground};
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  display: flex;
`;

export const ControlLabel = styled.p<{ selected?: boolean }>`
  color: ${({ theme, selected }) =>
    selected ? theme.colors.textSelected : theme.colors.text};
  padding: 0 1rem;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;
