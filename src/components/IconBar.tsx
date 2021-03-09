import styled from "styled-components";

const IconContainer = styled.aside`
  flex: 0 0 42px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

interface IconBarProps {
  topIcons?: React.ReactElement[];
  bottomIcons?: React.ReactElement[];
}

const Spacer = styled.div`
  flex: 1;
  height: 100%;
`;

const IconBar: React.VFC<IconBarProps> = ({ topIcons, bottomIcons }) => (
  <IconContainer>
    {topIcons}
    <Spacer />
    {bottomIcons}
  </IconContainer>
);

export default IconBar;
