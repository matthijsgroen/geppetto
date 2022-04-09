import { useCallback, useRef } from "react";
import { Icon, Menu, MenuItem, ToolButton } from "../../ui-components";
import { UseState } from "../types";
import { verifyFile as verifyVersion1 } from "../../animation/file1/verifyFile";
import { verifyFile as verifyVersion2 } from "../../animation/file2/verifyFile";
import { convertFromV1 } from "src/animation/file2/convert";
import { GeppettoImage } from "src/animation/file2/types";

declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
      types?: { description?: string; accept: Record<string, string[]> }[];
    }) => Promise<FileSystemFileHandle[]>;
  }
}

type ApplicationMenuProps = {
  fileNameState: UseState<string | null>;
  fileState: UseState<GeppettoImage>;
};

export const ApplicationMenu: React.VFC<ApplicationMenuProps> = ({
  fileNameState,
  fileState,
}) => {
  const fileRef = useRef<null | FileSystemFileHandle>(null);

  const openFile = useCallback(async () => {
    if (window.showOpenFilePicker) {
      try {
        const [file] = await window.showOpenFilePicker({
          multiple: false,
          excludeAcceptAllOption: true,
          types: [
            {
              description: "JSON File",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        fileRef.current = file;
        const fileData = await file.getFile();
        const reader = new FileReader();

        reader.readAsText(fileData, "utf8");
        reader.addEventListener("load", () => {
          const image = JSON.parse(reader.result as string);
          if (verifyVersion1(image)) {
            const version2 = convertFromV1(image);
            fileState[1](version2);
            fileNameState[1](file.name);
            return;
          }
          if (verifyVersion2(image)) {
            fileState[1](image);
            fileNameState[1](file.name);
            return;
          }

          // console.log(image);
        });
      } catch (e) {
        // user abort
      }
    } else {
      alert("Sorry no support for local filesystem");
    }
  }, []);
  return (
    <Menu
      portal={true}
      transition
      menuButton={({ open }) => (
        <ToolButton icon={<Icon>🍔</Icon>} active={open} />
      )}
    >
      <MenuItem>New</MenuItem>
      <MenuItem onClick={openFile}>Open</MenuItem>
      <MenuItem>Load texture</MenuItem>
      <MenuItem>Reload texture</MenuItem>
      <MenuItem disabled>Save</MenuItem>
      <MenuItem>Save as...</MenuItem>
    </Menu>
  );
};
