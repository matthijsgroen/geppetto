import styled from "styled-components";

type ToolTabProps = {
  label?: React.ReactChild;
  icon?: React.ReactChild;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const TabButton = styled.button.attrs({ type: "button" })<{
  isActive?: boolean;
}>`
  font: caption;
  display: inline-block;
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.textActive
      : props.theme.colors.textDefault};
  font-size: 1rem;

  height: 42px;

  align-items: center;
  border: none;
  border-bottom: 3px solid
    ${(props) =>
      props.isActive ? props.theme.colors.controlActive : "transparent"};

  outline: 2px solid transparent;
  padding: 0 1rem;

  &:disabled {
    opacity: 0.5;
  }
  &:focus {
    outline-color: ${(props) => props.theme.colors.controlFocus};
  }
  &:hover:enabled {
    background-color: ${(props) => props.theme.colors.controlHighlight};
  }
`;

export const ToolTab: React.VFC<ToolTabProps> = ({
  icon,
  label,
  disabled,
  active,
  onClick,
}) => (
  <TabButton onClick={onClick} disabled={disabled} isActive={active}>
    {icon} {label}
  </TabButton>
);
