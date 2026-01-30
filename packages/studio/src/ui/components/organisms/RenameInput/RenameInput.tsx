import type { FC } from "react";
import { useState } from "react";

import { TextButton } from "@/ui/components/atoms/TextButton/TextButton";
import type { TextInputProps } from "@/ui/components/atoms/TextInput/TextInput";
import { TextInput } from "@/ui/components/atoms/TextInput/TextInput";

type RenameInputProps = {
  value: string;
  onRename: (newName: string) => void;
  align: TextInputProps["align"];
};

export const RenameInput: FC<RenameInputProps> = ({
  value,
  onRename,
  align,
}) => {
  const [renaming, setRenaming] = useState(false);

  return renaming ? (
    <TextInput
      align={align}
      autoFocus
      defaultValue={value}
      onBlur={(e) => {
        const newName = e.target.value.trim();
        if (newName.length > 0 && newName !== value) {
          onRename(newName);
        }
        setRenaming(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          setRenaming(false);
        }
      }}
      size="small"
      transparent
    />
  ) : (
    <TextButton onDoubleClick={() => setRenaming(true)}>{value}</TextButton>
  );
};
