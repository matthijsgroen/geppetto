import React, { useCallback, useContext, useEffect, useRef } from "react";

import { ApplicationContext } from "@/application/state/ApplicationContext";
import { useFile } from "@/application/state/FileContext";
import { useActionMap } from "@/application/state/hooks/useActionMap";
import { useAppInstall } from "@/application/state/hooks/useAppInstall";
import { useAppUpdate } from "@/application/state/hooks/useAppUpdate";
import {
  useUpdateControlValues,
  useUpdateMutationValues,
} from "@/application/state/ImageControlContext";
import { ActionMenuItem } from "@/application/ui/ActionMenuItem";
import sceneryDemoImg from "@/demos/scenery.json";
import sceneryDemoImage from "@/demos/scenery.png";
import { verifyFile as verifyVersion2 } from "@/domain/animation/file2/verifyFile";
import { type GeppettoImage } from "@/dtos/animation-file2.dto";
import { type UseState } from "@/dtos/application.dto";
import { loadGeppettoFile, saveGeppettoFile } from "@/dtos/geppetto-file";
import {
  LogoIcon,
  Menu,
  MenuDivider,
  MenuItem,
  type Shortcut,
  SubMenu,
  ToolButton,
} from "@/ui/components";

const sceneryDemo: GeppettoImage = sceneryDemoImg as unknown as GeppettoImage;

type ApplicationMenuProps = {
  fileNameState: UseState<string | null>;
  textureFileNameState: UseState<string | null>;
  textureFileState: UseState<HTMLImageElement | null>;
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

const FILE_OPEN: Shortcut = { interaction: "KeyO", ctrlOrCmd: true };
const TEXTURE_OPEN: Shortcut = {
  interaction: "KeyO",
  shift: true,
  ctrlOrCmd: true,
};
const FILE_SAVE_AS: Shortcut = {
  interaction: "KeyS",
  shift: true,
  ctrlOrCmd: true,
};
const FILE_SAVE: Shortcut = { interaction: "KeyS", ctrlOrCmd: true };

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
                const [filename, image] = await loadGeppettoFile(fileHandle);
                fileNameState[1](filename);
                setFile(image);
                controlUpdate(() => image.controlValues);
                mutationUpdate(() => image.defaultFrame);
              } catch (_ignore) {
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
                await saveGeppettoFile(fileHandle, file);
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
                await saveGeppettoFile(fileRef.current, file);
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
      portal
      transition
      menuButton={({ open }) => (
        <ToolButton
          icon={<LogoIcon />}
          label="Geppetto"
          active={open}
          notificationBadge={hasAppUpdate}
          tooltip="Application menu"
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
