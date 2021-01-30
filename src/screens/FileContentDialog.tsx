import React, { useEffect, useRef } from "react";
import Backdrop from "../components/Backdrop";
import Dialog from "../components/Dialog";
import DialogBody from "../components/DialogBody";
import DialogTitle from "../components/DialogTitle";
import { ImageDefinition } from "../lib/types";
import styled from "styled-components";

interface FileContentDialogProps {
  imageDefinition: ImageDefinition;
  onClose?(): void;
  onUpdate?(newImageDefinition: ImageDefinition): void;
}

const CodeBox = styled.textarea`
  background-color: ${({ theme }) => theme.colors.itemContainerBackground};
  color: ${({ theme }) => theme.colors.text};
  width: 450px;
  height: 10rem;
  padding: 2px;
`;

const ButtonBar = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};

  padding: 0.75rem 1rem;

  > * + * {
    margin-left: 1rem;
  }
`;

const Button = styled.button`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: none;
  padding: 0.5rem;
  border-radius: 0.2rem;
  box-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 40%);

  &:active {
    box-shadow: none;
    outline: none;
  }
`;

const FileContentDialog: React.FC<FileContentDialogProps> = ({
  imageDefinition,
  onClose,
  onUpdate,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }
    const changeHandler = function (this: HTMLInputElement) {
      const fr = new FileReader();
      fr.onload = function () {
        try {
          onUpdate &&
            typeof fr.result === "string" &&
            onUpdate(JSON.parse(fr.result) as ImageDefinition);
        } catch (e) {
          console.error(e.message);
        }
      };
      if (this.files && this.files[0]) {
        fr.readAsText(this.files[0]);
      }
    };
    ref.current.addEventListener("change", changeHandler);

    return () => {
      ref.current?.removeEventListener("change", changeHandler);
    };
  }, [ref]);

  return (
    <Backdrop>
      <Dialog open>
        <DialogTitle>File Contents</DialogTitle>
        <DialogBody>
          <CodeBox readOnly value={JSON.stringify(imageDefinition, null, 2)} />
        </DialogBody>
        <ButtonBar>
          <Button onClick={() => onClose && onClose()}>Close</Button>
          {onUpdate && (
            <input type="file" ref={ref} accept="application/json" />
          )}
        </ButtonBar>
      </Dialog>
    </Backdrop>
  );
};

export default FileContentDialog;
