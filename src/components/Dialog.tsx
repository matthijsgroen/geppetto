import styled from "styled-components";

const Dialog = styled.dialog`
  top: 20%;
  padding: 0;
  border-width: 1px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: 1rem 1rem 1rem rgba(0, 0, 0, 40%);
`;

export default Dialog;
