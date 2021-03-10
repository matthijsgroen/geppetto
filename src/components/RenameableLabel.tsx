import { useState } from "react";
import styled from "styled-components";

const RenameInput = styled.input.attrs({
  type: "text",
  autoFocus: true,
})`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSelected};
  font-size: 1rem;
  font-weight: normal;
  width: max-content;
  padding: 0.2rem;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.textSelected};
`;

interface RenameableLabelProps {
  label: string;
  name?: string;
  allowRename?: boolean;
  onRename?(newName: string): void;
}

const RenameableLabel: React.VFC<RenameableLabelProps> = ({
  label,
  name = label,
  allowRename,
  onRename,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  return isRenaming ? (
    <RenameInput
      value={newName}
      onChange={(event) => {
        setNewName(event.target.value);
      }}
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          setNewName(name);
          setIsRenaming(false);
        }
        if (e.key === "Enter") {
          if (newName !== name && newName.trim().length > 0) {
            onRename && onRename(newName);
          }
          setIsRenaming(false);
        }
      }}
      onBlur={() => {
        if (newName !== name && newName.trim().length > 0) {
          onRename && onRename(newName);
        }
        setIsRenaming(false);
      }}
    />
  ) : (
    <span
      onDoubleClick={() => {
        allowRename && !isRenaming && setIsRenaming(true);
      }}
    >
      {label}
    </span>
  );
};

export default RenameableLabel;
