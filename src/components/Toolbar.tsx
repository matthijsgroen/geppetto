import styled from "styled-components";

export enum ControlStyle {
  Default,
  Selected,
  Highlighted,
}

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

export const ToolbarLabel = styled.p<{ controlStyle?: ControlStyle }>`
  color: ${({ theme, controlStyle }) =>
    controlStyle === ControlStyle.Selected
      ? theme.colors.textSelected
      : theme.colors.text};
  padding: 0 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  width: fit-content;
  flex: 0 1 auto;
`;

export const ToolbarSpacer = styled.div`
  flex: 1;
`;
