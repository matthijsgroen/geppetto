import React from "react";
import Backdrop from "../components/Backdrop";
import Dialog from "../components/Dialog";
import DialogBody from "../components/DialogBody";
import DialogTitle from "../components/DialogTitle";
import { ImageDefinition } from "../lib/types";
import styled from "styled-components";

interface FileContentDialogProps {
  imageDefinition: ImageDefinition;
  onClose?(): void;
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
}) => (
  <Backdrop>
    <Dialog open>
      <DialogTitle>File Contents</DialogTitle>
      <DialogBody>
        <CodeBox readOnly>{JSON.stringify(imageDefinition)}</CodeBox>
      </DialogBody>
      <ButtonBar>
        <Button onClick={() => onClose && onClose()}>Close</Button>
      </ButtonBar>
    </Dialog>
  </Backdrop>
);

export default FileContentDialog;
