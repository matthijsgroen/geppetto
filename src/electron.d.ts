import { ImageDefinition } from "./lib/types";
declare global {
  interface Window {
    electron?: {
      onAnimationFileLoaded(
        callback: (image: ImageDefinition, baseName: string) => void
      ): void;
      onAnimationFileNew(callback: () => void): void;
      onAnimationFileNameChange(callback: (newName: string) => void): void;
      onTextureFileLoaded(
        callback: (base64: string, baseName: string) => void
      ): void;
      onShowFPSChange(callback: (showFPS: boolean) => void): void;
      updateAnimationFile(contents: ImageDefinition): void;
    };
  }
}
