import { useCallback, useRef, useEffect } from "react";
import { Icon, Menu, MenuItem, ToolButton } from "../../ui-components";
import { UseState } from "../types";
import { verifyFile as verifyVersion1 } from "../../animation/file1/verifyFile";
import { verifyFile as verifyVersion2 } from "../../animation/file2/verifyFile";
import { convertFromV1 } from "../../animation/file2/convert";
import { GeppettoImage } from "../../animation/file2/types";
import {
  isEvent,
  Shortcut,
  shortcutStr,
} from "../../ui-components/Menu/shortcut";

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

  textureFileNameState: UseState<string | null>;
  textureFileState: UseState<HTMLImageElement | null>;
};

const loadGeppettoImage = async (
  file: FileSystemFileHandle
): Promise<[filename: string, image: GeppettoImage]> => {
  const fileData = await file.getFile();
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const image = JSON.parse(reader.result as string);
      if (verifyVersion1(image)) {
        const version2 = convertFromV1(image);
        resolve([file.name, version2]);
      }
      if (verifyVersion2(image)) {
        resolve([file.name, image]);
      }
    });
    reader.readAsText(fileData, "utf8");
  });
};

const loadTextureImage = async (
  file: FileSystemFileHandle
): Promise<[filename: string, image: HTMLImageElement]> => {
  const fileData = await file.getFile();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.src = reader.result as string;
      resolve([file.name, image]);
    });
    reader.readAsDataURL(fileData);
  });
};

const FILE_OPEN: Shortcut = { key: "KeyO", ctrlOrCmd: true };
const TEXTURE_OPEN: Shortcut = { key: "KeyO", shift: true, ctrlOrCmd: true };

export const ApplicationMenu: React.FC<ApplicationMenuProps> = ({
  fileNameState,
  fileState,
  textureFileNameState,
  textureFileState,
}) => {
  const fileRef = useRef<null | FileSystemFileHandle>(null);
  const textureFileRef = useRef<null | FileSystemFileHandle>(null);

  const openImageFile = useCallback(async () => {
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
        const [filename, image] = await loadGeppettoImage(file);
        fileNameState[1](filename);
        fileState[1](image);
      } catch (e) {
        // user abort
      }
    } else {
      alert("Sorry no support for local filesystem");
    }
  }, [fileNameState, fileState]);

  const openTextureFile = useCallback(async () => {
    if (window.showOpenFilePicker) {
      try {
        const [file] = await window.showOpenFilePicker({
          multiple: false,
          excludeAcceptAllOption: true,
          types: [
            {
              description: "Texture File",
              accept: { "image/png": [".png"] },
            },
          ],
        });
        textureFileRef.current = file;
        const [filename, image] = await loadTextureImage(file);
        textureFileNameState[1](filename);
        textureFileState[1](image);
      } catch (e) {
        // user abort
      }
    } else {
      alert("Sorry no support for local filesystem");
    }
  }, [textureFileNameState, textureFileState]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEvent(FILE_OPEN, event)) {
        openImageFile();
        event.preventDefault();
      }
      if (isEvent(TEXTURE_OPEN, event)) {
        openTextureFile();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openImageFile, openTextureFile]);

  return (
    <Menu
      portal={true}
      transition
      menuButton={({ open }) => (
        <ToolButton icon={<Icon>🍔</Icon>} active={open} />
      )}
    >
      {/* <MenuItem>New</MenuItem> */}
      <MenuItem onClick={openImageFile} shortcut={shortcutStr(FILE_OPEN)}>
        Open
      </MenuItem>
      <MenuItem onClick={openTextureFile} shortcut={shortcutStr(TEXTURE_OPEN)}>
        Load texture
      </MenuItem>
      {/* <MenuItem>Reload texture</MenuItem>
      <MenuItem disabled>Save</MenuItem>
      <MenuItem>Save as...</MenuItem> */}
    </Menu>
  );
};
