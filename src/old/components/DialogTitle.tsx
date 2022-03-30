import styled from "styled-components";

const DialogTitle = styled.header`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};

  display: flex;
  flex-direction: row;
`;

export default DialogTitle;
