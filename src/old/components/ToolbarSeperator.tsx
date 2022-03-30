import styled from "styled-components";

const ToolbarSeperator = styled.span`
  display: inline-block;
  margin: 0 0.3rem;
  border-left: 1px solid
    ${(props) => props.theme.colors.itemContainerBackground};
`;

export default ToolbarSeperator;
