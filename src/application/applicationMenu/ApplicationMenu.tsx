import React, { useCallback, useRef, useEffect, useContext } from "react";
import {
  Menu,
  ToolButton,
  SubMenu,
  Shortcut,
  MenuDivider,
  MenuItem,
  LogoIcon,
} from "../../ui-components";
import { UseState } from "../types";
import { verifyFile as verifyVersion1 } from "../../animation/file1/verifyFile";
import { verifyFile as verifyVersion2 } from "../../animation/file2/verifyFile";
import { convertFromV1 } from "../../animation/file2/convert";
import { GeppettoImage } from "../../animation/file2/types";
import { useActionMap } from "../hooks/useActionMap";
import { ActionMenuItem } from "../actions/ActionMenuItem";
import { useAppUpdate } from "../hooks/useAppUpdate";
import { ApplicationContext } from "../contexts/ApplicationContext";
import { useAppInstall } from "../hooks/useAppInstall";
import { useFile } from "./FileContext";

import sceneryDemoImg from "../../demos/scenery.json";
import sceneryDemoImage from "../../demos/scenery.png";
import {
  useUpdateControlValues,
  useUpdateMutationValues,
} from "../contexts/ImageControlContext";

const sceneryDemo: GeppettoImage = sceneryDemoImg as unknown as GeppettoImage;

type ApplicationMenuProps = {
  fileNameState: UseState<string | null>;
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
const FILE_SAVE_AS: Shortcut = { key: "KeyS", shift: true, ctrlOrCmd: true };
const FILE_SAVE: Shortcut = { key: "KeyS", ctrlOrCmd: true };

export const ApplicationMenu: React.FC<ApplicationMenuProps> = ({
  fileNameState,
  textureFileNameState,
  textureFileState,
}) => {
  const fileRef = useRef<null | FileSystemFileHandle>(null);
  const textureFileRef = useRef<null | FileSystemFileHandle>(null);
  const [hasAppUpdate, updater] = useAppUpdate();
  const [canInstall, installer] = useAppInstall();
  const [file, setFile] = useFile();
  const [, setTextureFile] = textureFileState;
  const [, setTextureFileName] = textureFileNameState;
  const controlUpdate = useUpdateControlValues();
  const mutationUpdate = useUpdateMutationValues();

  const { actions, triggerKeyboardAction } = useActionMap(
    useCallback(
      () => ({
        openImageFile: {
          caption: "Open...",
          shortcut: FILE_OPEN,
          handler: async () => {
            if (window.showOpenFilePicker) {
              try {
                const [fileHandle] = await window.showOpenFilePicker({
                  multiple: false,
                  excludeAcceptAllOption: true,
                  types: [
                    {
                      description: "JSON File",
                      accept: { "application/json": [".json"] },
                    },
                  ],
                });
                fileRef.current = fileHandle;
                const [filename, image] = await loadGeppettoImage(fileHandle);
                fileNameState[1](filename);
                setFile(image);
                controlUpdate(() => image.controlValues);
                mutationUpdate(() => image.defaultFrame);
              } catch (e) {
                // user abort
              }
            } else {
              alert("Sorry no support for local filesystem");
            }
          },
        },
        saveImageFileAs: {
          caption: "Save as...",
          shortcut: FILE_SAVE_AS,
          handler: async () => {
            if (window.showSaveFilePicker) {
              try {
                const fileHandle = await window.showSaveFilePicker({
                  suggestedName: "animation.json",
                  excludeAcceptAllOption: true,
                  types: [
                    {
                      description: "JSON File",
                      accept: { "application/json": [".json"] },
                    },
                  ],
                });
                fileRef.current = fileHandle;
                fileNameState[1](fileHandle.name);
                const writable = await fileHandle.createWritable();
                await writable.write(JSON.stringify(file));
                writable.close();
              } catch (e) {
                // user abort
              }
            } else {
              alert("Sorry no support for local filesystem");
            }
          },
        },
        saveImageFile: {
          caption: "Save",
          shortcut: FILE_SAVE,
          handler: async () => {
            if (!fileRef.current && window.showSaveFilePicker) {
              try {
                const fileHandle = await window.showSaveFilePicker({
                  suggestedName: "animation.json",
                  excludeAcceptAllOption: true,
                  types: [
                    {
                      description: "JSON File",
                      accept: { "application/json": [".json"] },
                    },
                  ],
                });
                fileRef.current = fileHandle;
                fileNameState[1](fileHandle.name);
              } catch (e) {
                // user abort
              }
            }
            if (fileRef.current) {
              try {
                const writable = await fileRef.current.createWritable();
                await writable.write(JSON.stringify(file));
                writable.close();
              } catch (e) {
                // user abort
              }
            }
          },
        },
        openTextureFile: {
          caption: "Load texture...",
          shortcut: TEXTURE_OPEN,
          handler: async () => {
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
                setTextureFileName(filename);
                setTextureFile(image);
              } catch (e) {
                // user abort
              }
            } else {
              alert("Sorry no support for local filesystem");
            }
          },
        },
      }),
      [
        fileNameState,
        file,
        setFile,
        setTextureFile,
        setTextureFileName,
        controlUpdate,
        mutationUpdate,
      ]
    )
  );

  const { onMessage } = useContext(ApplicationContext);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (triggerKeyboardAction(event)) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const unsubscribe = onMessage((message) => {
      if (message === "textureOpen") {
        actions.openTextureFile.handler();
      }
      if (message === "fileOpen") {
        actions.openImageFile.handler();
      }
      if (message === "demoOpenScenery") {
        if (verifyVersion2(sceneryDemo)) {
          setFile(sceneryDemo);
          controlUpdate(() => sceneryDemo.controlValues);
          mutationUpdate(() => sceneryDemo.defaultFrame);
        }

        const image = new Image();
        image.addEventListener("load", () => {
          setTextureFile(image);
          setTextureFileName("scenery.png");
        });
        image.crossOrigin = "anonymous";
        image.src = sceneryDemoImage;
      }
    });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unsubscribe();
    };
  }, [
    triggerKeyboardAction,
    actions,
    onMessage,
    setFile,
    setTextureFile,
    setTextureFileName,
    controlUpdate,
    mutationUpdate,
  ]);

  return (
    <Menu
      portal={true}
      transition
      menuButton={({ open }) => (
        <ToolButton
          icon={<LogoIcon />}
          active={open}
          notificationBadge={hasAppUpdate}
          tooltip={"Application menu"}
        />
      )}
    >
      {hasAppUpdate && (
        <MenuItem onClick={updater}>↻ Restart for app update...</MenuItem>
      )}
      {canInstall && (
        <MenuItem onClick={installer}>⇣ Install application locally</MenuItem>
      )}
      <SubMenu label="File">
        {/* <MenuItem>New</MenuItem> */}
        <ActionMenuItem action={actions.openImageFile} />
        <ActionMenuItem action={actions.openTextureFile} />
        <MenuDivider />
        <MenuItem disabled>Reload texture</MenuItem>
        <MenuDivider />
        <ActionMenuItem action={actions.saveImageFile} />
        <ActionMenuItem action={actions.saveImageFileAs} />
        <MenuDivider />
        <MenuItem disabled>Revert file</MenuItem>
      </SubMenu>
      <SubMenu label="Help">
        <MenuItem disabled>Documentation</MenuItem>
        <MenuItem disabled>Release notes</MenuItem>
        <MenuDivider />
        <MenuItem disabled>Report an issue</MenuItem>
        <MenuDivider />
        <MenuItem disabled>Support the developer</MenuItem>
        <MenuItem disabled>About</MenuItem>
      </SubMenu>
    </Menu>
  );
};
