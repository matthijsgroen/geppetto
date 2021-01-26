import styled from "styled-components";

const IconContainer = styled.aside`
  flex: 0 0 42px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  width: 100%;
`;

interface IconBarProps {
  topIcons: React.ReactElement[];
}

const IconBar: React.FC<IconBarProps> = ({ topIcons }) => (
  <IconContainer>{topIcons}</IconContainer>
);

export default IconBar;
