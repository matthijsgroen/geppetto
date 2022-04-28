import styled from "styled-components";

const Separator = styled.span`
    display: inline-block;
    height: 1.8rem;
    border-right: 1px solid ${(props) => props.theme.colors.controlEdge};
    font-size 0;
`;

/**
 * Creates a small dividing line between toolbar elements
 */
export const ToolSeparator: React.FC = () => <Separator>|</Separator>;
ToolSeparator.displayName = "ToolSeparator";
