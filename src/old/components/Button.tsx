import styled from "styled-components";

export enum ButtonType {
  Normal,
  Destructive,
}

export default styled.button.attrs({
  type: "button",
})<{ buttonType?: ButtonType }>`
  padding: 0.5rem;
  color: ${({ theme, buttonType }) =>
    buttonType === ButtonType.Destructive
      ? theme.colors.textDestructive
      : theme.colors.textSelected};
  background-color: ${({ theme, buttonType }) =>
    buttonType === ButtonType.Destructive
      ? theme.colors.backgroundDestructive
      : theme.colors.backgroundSecondary};
  border: none;
  border-radius: 0.5rem;
`;
