import { ItemEdit } from "./ItemEdit";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  fileBuilder,
  getShapeFolderIdByName,
} from "../../animation/file2/testFileBuilder";
import { renderWithFile } from "../testUtils/renderWithFile";
import { toggleFolderVisibility } from "../../animation/file2/shapes";

describe("ItemEdit", () => {
  describe("when nothing is selected", () => {
    it("mentions that there is no selection", () => {
      render(<ItemEdit selectedShapeIds={[]} activeMutator={null} />);

      expect(screen.getByRole("heading").textContent).toEqual("No selection");
    });
  });

  describe("when a folder is selected folder", () => {
    it("shows the selected folder by name", () => {
      const file = fileBuilder().addFolder("My Folder").build();
      const folderId = getShapeFolderIdByName(file, "My Folder");

      renderWithFile(
        file,
        <ItemEdit selectedShapeIds={[folderId]} activeMutator={null} />
      );

      expect(screen.getByRole("heading").textContent).toEqual("📁 My Folder");
    });

    it("shows visible state unchecked for hidden folder", () => {
      const file = fileBuilder().addFolder("My Folder").build();
      const folderId = getShapeFolderIdByName(file, "My Folder");
      const fileWithFolderVisibility = toggleFolderVisibility(folderId)(file);

      renderWithFile(
        fileWithFolderVisibility,
        <ItemEdit selectedShapeIds={[folderId]} activeMutator={null} />
      );

      const visibilityCheckbox = screen.getByLabelText("Visible");
      expect(visibilityCheckbox).not.toBeChecked();
    });

    it("shows visible state checked for visible folder", () => {
      const file = fileBuilder().addFolder("My Folder").build();
      const folderId = getShapeFolderIdByName(file, "My Folder");

      renderWithFile(
        file,
        <ItemEdit selectedShapeIds={[folderId]} activeMutator={null} />
      );

      const visibilityCheckbox = screen.getByLabelText("Visible");
      expect(visibilityCheckbox).toBeChecked();
    });

    it("allows changing visibility", () => {
      const file = fileBuilder().addFolder("My Folder").build();
      const folderId = getShapeFolderIdByName(file, "My Folder");

      const { getFile } = renderWithFile(
        file,
        <ItemEdit selectedShapeIds={[folderId]} activeMutator={null} />
      );

      const visibilityCheckbox = screen.getByLabelText("Visible");
      fireEvent.click(visibilityCheckbox);

      const updatedFile = getFile();
      expect(updatedFile.layerFolders[folderId].visible).toBe(false);
    });
  });
});
