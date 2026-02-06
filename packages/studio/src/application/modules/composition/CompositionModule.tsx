import type { GeppettoImage, MutationVector, Vec2 } from "@geppetto/types";
import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { InstallToolButton } from "@/application/modules/application-menu/ui/InstallToolButton";
import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import { useFitToScreenAction } from "@/application/shared/actions/useFitToScreen";
import { useInfoPanel } from "@/application/shared/actions/useInfoPanel";
import { useFileUndoRedo } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import { useGlobalActionMap } from "@/application/state/hooks/useGlobalActionMap";
import { useUpdateMutationValues } from "@/application/state/ImageControlContext";
import { useScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { ActionToolButton } from "@/application/ui/ActionToolButton";
import LayerMouseControl, {
  type DragState,
} from "@/application/ui/LayerMouseControl";
import { MouseMode } from "@/application/ui/MouseControl";
import { SectionSelector } from "@/application/ui/SectionSelector";
import { dragItem } from "@/domain/animation/file2/drag";
import {
  findParentId,
  type PlacementInfo,
  visit,
} from "@/domain/animation/file2/hierarchy";
import {
  updateImageHeight,
  updateImageWidth,
} from "@/domain/animation/file2/metadata";
import {
  addMutation,
  type AddMutationDetails,
  iconMapping,
  isShapeMutationVector,
  mutationLabels,
  type MutationSettings,
} from "@/domain/animation/file2/mutation";
import { hasPoints } from "@/domain/animation/file2/shapes";
import { type AppSection } from "@/dtos/application.dto";
import { maxZoomFactor } from "@/infrastructure/webgl/lib/canvas";
import {
  imageToPixels,
  pixelsToImage,
} from "@/infrastructure/webgl/lib/screenCoord";
import {
  calculateVectorValues,
  vectorPositions,
} from "@/infrastructure/webgl/lib/vectorPositions";
import {
  Column,
  Control,
  ControlledMenu,
  ControlPanel,
  Inlay,
  MenuItem,
  NumberInput,
  Panel,
  PanelTitle,
  ResizeDirection,
  ResizePanel,
  Row,
  type Shortcut,
  SubMenu,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
  useMenuState,
} from "@/ui/components";

import CompositionCanvas from "./ui/CompositionCanvas";
import { ControlEdit, ControlEditSteps } from "./ui/ControlEdit";
import { ControlTree } from "./ui/ControlTree";
import { InlayControlPanel, ItemEdit } from "./ui/ItemEdit";
import { ShapeTree } from "./ui/ShapeTree";

const useMutatorMap = (
  file: GeppettoImage,
  vectorValues: Record<string, Vec2>
) =>
  useMemo(
    () => vectorPositions(file.mutations, file.layerHierarchy, vectorValues),
    [file.mutations, file.layerHierarchy, vectorValues]
  );

type CompositionModuleProps = {
  onSectionChange?: (newSection: AppSection) => void;
  texture: HTMLImageElement | null;
  menu?: React.ReactNode;
};

export const CompositionModule: React.FC<CompositionModuleProps> = ({
  menu,
  texture,
  onSectionChange,
}) => {
  const {
    state: file,
    set: setFile,
    setGrouped: setFileGrouped,
    endGrouping,
  } = useFileUndoRedo();
  const [showWireFrames, setShowWireFrames] = useState(true);
  const [controlEditMode, setControlEditMode] = useState(false);
  const [activeControlStep, setActiveControlStep] = useState<number>(0);

  const maxZoom = maxZoomFactor(texture);

  const [selectedItemsState, setSelectedItems] = useState<string[]>([]);
  // Verify that UI state matches file state
  const selectedItems = selectedItemsState.filter(
    (id) => file.layerHierarchy[id] !== undefined
  );

  const [focusedLayer, setFocusedLayer] = useState<string | undefined>();
  const [activeMutatorState, setActiveMutator] = useState<string | null>(null);
  // Verify that UI state matches file state
  const activeMutator =
    activeMutatorState && file.mutations[activeMutatorState]
      ? activeMutatorState
      : null;

  const [selectedControlsState, setSelectedControls] = useState<string[]>([]);
  const selectedControls = selectedControlsState.filter(
    (id) => file.controls[id] !== undefined
  );
  const updateMutationValues = useUpdateMutationValues();
  const dragDropStatus = useRef<{
    fileDragStart: GeppettoImage;
    dragStart: Vec2;
  }>({
    fileDragStart: file,
    dragStart: [0, 0],
  });

  const vectorValues = calculateVectorValues(
    file,
    file.defaultFrame,
    file.controlValues
  );

  const updateSelectedItems = useEvent(
    (selectedItemsUpdate: SetStateAction<string[]>) => {
      const newValue =
        typeof selectedItemsUpdate === "function"
          ? selectedItemsUpdate(selectedItems)
          : selectedItemsUpdate;

      if (newValue.length === 1) {
        const selectedId = `${newValue[0]}`;
        if (file.mutations[selectedId]) {
          setActiveMutator(selectedId);
        } else {
          setActiveMutator(null);
        }
      } else {
        setActiveMutator(null);
      }
      setSelectedItems(selectedItemsUpdate);
    }
  );

  const fitToScreenAction = useFitToScreenAction();
  const [showItemDetails, toggleInfoAction] = useInfoPanel();

  const actions = useGlobalActionMap(
    useCallback(
      () => ({
        toggleInfo: toggleInfoAction,
        toggleWireFrames: {
          icon: "🩻",
          tooltip: "Toggle wireframes",
          shortcut: { alt: true, interaction: "KeyW" } as Shortcut,
          handler: () => {
            setShowWireFrames((prev) => !prev);
          },
        },
        fitToScreen: fitToScreenAction,
      }),
      [fitToScreenAction, toggleInfoAction]
    )
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const mutatorMap = useMutatorMap(file, vectorValues);
  const translation = useScreenTranslation();
  const visibleMutators = useMemo(() => {
    const result: string[] = [];
    if (selectedItems[0] === undefined) return result;

    visit(
      file.layerHierarchy,
      (node, nodeId) => {
        if (node.type === "layerFolder") {
          const folder = file.layerFolders[nodeId];
          if (!folder.visible) {
            return "SKIP";
          }
          return;
        }
        if (node.type === "layer") {
          const layer = file.layers[nodeId];
          if (!layer.visible) {
            return "SKIP";
          }
          return;
        }
        if (node.type === "mutation") {
          const mutation = file.mutations[nodeId];
          if (isShapeMutationVector(mutation)) {
            result.push(nodeId);
          }
        }
      },
      selectedItems[0]
    );
    return result;
  }, [
    selectedItems,
    file.layerHierarchy,
    file.layers,
    file.mutations,
    file.layerFolders,
  ]);

  const getImageConvert = useEvent(() => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();

    // Calculate the fit scale the same way the shader does
    const landscape =
      file.metadata.width / rect.width > file.metadata.height / rect.height;
    const fitScale = landscape
      ? rect.width / file.metadata.width
      : rect.height / file.metadata.height;

    return imageToPixels(translation, rect, fitScale);
  });

  const [fitScale, setFitScale] = useState<number>(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const landscape =
      file.metadata.width / rect.width > file.metadata.height / rect.height;
    const newFitScale = landscape
      ? rect.width / file.metadata.width
      : rect.height / file.metadata.height;

    const clear = setTimeout(() => {
      setFitScale(newFitScale);
    }, 0);
    return () => clearTimeout(clear);
  }, [file.metadata.width, file.metadata.height, containerRef]);

  const handleClick = useEvent((event: React.MouseEvent<HTMLElement>) => {
    if (selectedItems.length === 1 && containerRef.current) {
      const imageConvert = getImageConvert();
      if (!imageConvert) return;

      const hitRadius = 5; // Scaled to match MUTATION_DOT_SIZE of 2.5
      const rect = containerRef.current.getBoundingClientRect();

      for (const mutatorId of visibleMutators) {
        const position = imageConvert(mutatorMap[mutatorId]);

        const elementX = event.pageX - rect.left;
        const elementY = event.pageY - rect.top - 2;
        if (
          elementX > position[0] - hitRadius &&
          elementX < position[0] + hitRadius &&
          elementY > position[1] - hitRadius &&
          elementY < position[1] + hitRadius
        ) {
          setActiveMutator(mutatorId);
          setFocusedLayer(mutatorId);
          setSelectedItems([mutatorId]);
        }
      }
    }
  });

  const hoverCursor = useEvent(
    (event: React.MouseEvent<HTMLElement>): MouseMode => {
      if (selectedItems.length === 1) {
        const imageConvert = getImageConvert();
        if (!imageConvert)
          return event.shiftKey ? MouseMode.Grab : MouseMode.Normal;

        const hitRadius = 5; // Scaled to match MUTATION_DOT_SIZE of 2.5

        for (const mutatorId of visibleMutators) {
          const position = imageConvert(mutatorMap[mutatorId]);

          const rect = containerRef.current!.getBoundingClientRect();
          const elementX = event.pageX - rect.left;
          const elementY = event.pageY - rect.top - 2;
          if (
            elementX > position[0] - hitRadius &&
            elementX < position[0] + hitRadius &&
            elementY > position[1] - hitRadius &&
            elementY < position[1] + hitRadius
          ) {
            return MouseMode.Target;
          }
        }
      }

      return event.shiftKey ? MouseMode.Grab : MouseMode.Normal;
    }
  );

  const handleDrag = useEvent(
    (
      event: React.MouseEvent<HTMLElement>,
      position: Vec2,
      dragState: DragState
    ): boolean => {
      if (!event.shiftKey) {
        return false;
      }
      const itemId = selectedItems[0];
      if (itemId) {
        if (dragState === "start") {
          dragDropStatus.current.dragStart = position;
          dragDropStatus.current.fileDragStart = file;
        }
        const dragged: Vec2 = [
          position[0] - dragDropStatus.current.dragStart[0],
          position[1] - dragDropStatus.current.dragStart[1],
        ];
        const origin = dragDropStatus.current.fileDragStart;

        setFileGrouped("dragOrigin", dragItem(origin, dragged, itemId));
        if (dragState === "end") {
          endGrouping();
        }
      }
      return true;
    }
  );

  const [menuProps, toggleMenu] = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({
    x: 0,
    y: 0,
  });

  const [contextOffset, setContextOffset] = useState({
    x: 0,
    y: 0,
  });

  const handleContextMenu = useEvent(
    (event: React.MouseEvent<HTMLElement>): void => {
      event.preventDefault();
      setAnchorPoint({
        x: event.clientX,
        y: event.clientY,
      });
      setContextOffset({
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      });
      toggleMenu(true);
    }
  );

  const addMutationHandler = useEvent(
    (e: { value?: MutationVector["type"] }) => {
      if (!e.value || !containerRef.current) return;
      const targetId = selectedItems[0];

      const mutationType: MutationVector["type"] = e.value;
      let position: PlacementInfo | undefined = undefined;
      const folder = file.layerFolders[targetId];
      const layer = file.layers[targetId];
      const mutation = file.mutations[targetId];
      if (selectedItems.length === 1 && (folder || layer)) {
        position = { parent: targetId };
      }
      if (selectedItems.length === 1 && mutation) {
        const parentId = findParentId(file.layerHierarchy, targetId);
        if (parentId) {
          position = { after: targetId, parent: parentId };
        }
      }
      if (!position) return;
      const name = mutationLabels[mutationType];
      const origin = pixelsToImage(
        translation,
        containerRef.current.getBoundingClientRect()
      )([contextOffset.x, contextOffset.y]);
      const settings: MutationSettings<typeof mutationType> = {
        origin,
      };

      const addDetails = {} as AddMutationDetails<typeof mutationType>;
      const updatedImage = addMutation(
        file,
        name,
        mutationType,
        settings,
        position,
        addDetails
      );
      updateMutationValues((values) => ({
        ...values,
        [addDetails.id]: updatedImage.defaultFrame[addDetails.id],
      }));
      setFile(updatedImage);
      setActiveMutator(addDetails.id);
      setFocusedLayer(addDetails.id);
      setSelectedItems([addDetails.id]);
    }
  );

  const editingControl = controlEditMode ? selectedControls[0] : undefined;
  const activeControlId =
    selectedControls.length === 1 ? selectedControls[0] : undefined;

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <SectionSelector
          activeSection="composition"
          onSectionChange={onSectionChange}
        />
        <ToolSeparator />
        <ActionToolButton
          action={actions.toggleWireFrames}
          active={showWireFrames}
        />
        <ActionToolButton action={actions.fitToScreen} />
        <ToolSpacer />
        <ActionToolButton
          action={actions.toggleInfo}
          active={showItemDetails}
        />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <ResizePanel
          defaultSize={250}
          direction={ResizeDirection.East}
          minSize={150}
        >
          <Column>
            <Panel padding="sm">
              <ShapeTree
                editControlId={editingControl}
                focusedItemState={[focusedLayer, setFocusedLayer]}
                onSectionChange={onSectionChange}
                selectedItemsState={[selectedItems, updateSelectedItems]}
              />
            </Panel>
            {!controlEditMode && (
              <ResizePanel
                defaultSize={400}
                direction={ResizeDirection.North}
                minSize={300}
              >
                <Panel padding="sm">
                  <ControlTree
                    onSelectControls={(controlIds: string[]) => {
                      setSelectedControls(controlIds);
                    }}
                    selectedControls={selectedControls}
                  />
                  {activeControlId && !controlEditMode && (
                    <ControlEdit
                      controlId={activeControlId}
                      onEditControlSteps={() => setControlEditMode(true)}
                    />
                  )}
                </Panel>
              </ResizePanel>
            )}
            {controlEditMode && (
              <Panel fitContent padding="sm">
                <ControlEditSteps
                  activeControlStep={activeControlStep}
                  onControlEditDone={() => setControlEditMode(false)}
                  onControlStepSelect={setActiveControlStep}
                  selectedControlIds={selectedControls}
                />
              </Panel>
            )}
          </Column>
        </ResizePanel>
        <Panel center workspace>
          {texture && hasPoints(file) ? (
            <LayerMouseControl
              fitScale={fitScale}
              handleDrag={handleDrag}
              hoverCursor={hoverCursor}
              maxZoomFactor={maxZoom}
              mode={MouseMode.Normal}
              onClick={handleClick}
              onContextMenu={handleContextMenu}
            >
              <CompositionCanvas
                activeLayers={selectedItems}
                activeMutation={activeMutator}
                file={file}
                image={texture}
                ref={containerRef}
                showWireFrames={showWireFrames}
              >
                <ControlledMenu
                  {...menuProps}
                  anchorPoint={anchorPoint}
                  onClose={() => toggleMenu(false)}
                >
                  <SubMenu
                    disabled={selectedItems.length !== 1}
                    label="Add mutation"
                  >
                    {Object.keys(mutationLabels).map((key) => (
                      <MenuItem
                        key={key}
                        onClick={addMutationHandler}
                        value={key}
                      >
                        {iconMapping[key as MutationVector["type"]]}{" "}
                        {mutationLabels[key as MutationVector["type"]]}
                      </MenuItem>
                    ))}
                  </SubMenu>
                  <MenuItem disabled>Zoom to selected item</MenuItem>
                </ControlledMenu>

                {!showItemDetails && activeMutator && (
                  <Inlay>
                    <InlayControlPanel
                      activeMutator={activeMutator}
                      editingControlId={editingControl}
                      editingControlStep={activeControlStep}
                      key={editingControl ? activeControlStep : activeMutator}
                      onSelectControl={(controlId) => {
                        setSelectedControls([controlId]);
                      }}
                    />
                  </Inlay>
                )}
              </CompositionCanvas>
            </LayerMouseControl>
          ) : (
            <StartupScreen file={file} texture={texture} />
          )}
        </Panel>
        {showItemDetails && (
          <ResizePanel
            defaultSize={250}
            direction={ResizeDirection.West}
            minSize={150}
          >
            <Column>
              <Panel padding="sm">
                <PanelTitle>Image Properties</PanelTitle>
                <ControlPanel>
                  <Control label="Width">
                    <NumberInput
                      onBlur={() => endGrouping()}
                      onChange={(newWidth) => {
                        setFileGrouped(
                          "imageWidth",
                          updateImageWidth(newWidth)
                        );
                      }}
                      value={file.metadata.width}
                    />
                  </Control>
                  <Control label="Height">
                    <NumberInput
                      onBlur={() => endGrouping()}
                      onChange={(newHeight) => {
                        setFileGrouped(
                          "imageHeight",
                          updateImageHeight(newHeight)
                        );
                      }}
                      value={file.metadata.height}
                    />
                  </Control>
                </ControlPanel>
                <ItemEdit
                  activeMutator={activeMutator}
                  editingControlId={editingControl}
                  editingControlStep={activeControlStep}
                  onSelectControl={(controlId) => {
                    setSelectedControls([controlId]);
                  }}
                  selectedShapeIds={selectedItems}
                />
              </Panel>
            </Column>
          </ResizePanel>
        )}
      </Row>
    </Column>
  );
};
