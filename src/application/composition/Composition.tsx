import {
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { dragItem } from "../../animation/file2/drag";
import {
  findParentId,
  PlacementInfo,
  visit,
} from "../../animation/file2/hierarchy";
import {
  addMutation,
  AddMutationDetails,
  iconMapping,
  isShapeMutationVector,
  mutationLabels,
  MutationSettings,
} from "../../animation/file2/mutation";
import { hasPoints } from "../../animation/file2/shapes";
import { GeppettoImage, MutationVector } from "../../animation/file2/types";
import { Vec2 } from "../../types";
import {
  Column,
  ControlledMenu,
  Icon,
  MenuItem,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  Shortcut,
  SubMenu,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
  useMenuState,
} from "../../ui-components";
import { ActionToolButton } from "../actions/ActionToolButton";
import { useFile } from "../applicationMenu/FileContext";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { StartupScreen } from "../applicationMenu/Startup";
import LayerMouseControl, { DragState } from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import { useUpdateMutationValues } from "../contexts/ImageControlContext";
import {
  useScreenTranslation,
  useUpdateScreenTranslation,
} from "../contexts/ScreenTranslationContext";
import { useActionMap } from "../hooks/useActionMap";
import useEvent from "../hooks/useEvent";
import { AppSection, Size, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";
import { imageToPixels, pixelsToImage } from "../webgl/lib/screenCoord";
import {
  calculateVectorValues,
  vectorPositions,
} from "../webgl/lib/vectorPositions";
import { ControlEdit } from "./ControlEdit";
import { ControlTree } from "./ControlTree";
import { Inlay } from "./Inlay";
import { InlayControlPanel, ItemEdit } from "./ItemEdit";
import { ShapeTree } from "./ShapeTree";

type CompositionProps = {
  onSectionChange?: (newSection: AppSection) => void;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

const TOGGLE_INFO_SHORTCUT: Shortcut = {
  ctrlOrCmd: true,
  interaction: "KeyI",
};

const calculateScale = (element: Size, texture: Size) => {
  const landscape =
    texture.width / element.width > texture.height / element.height;
  return landscape
    ? element.width / texture.width
    : element.height / texture.height;
};

const useScaleUpdater = (
  containerRef: RefObject<HTMLDivElement>,
  texture: HTMLImageElement | null
) => {
  const updater = useUpdateScreenTranslation();
  const textureRef = useRef(texture);
  textureRef.current = texture;
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && textureRef.current) {
        const img = textureRef.current;
        const rect = containerRef.current.getBoundingClientRect();
        updater((current) => {
          return {
            ...current,
            scale: calculateScale(rect, img),
          };
        });
      }
    };

    const ref = containerRef.current;
    if (ref === null) return;
    ref.addEventListener("resize", handleResize);
    return () => {
      ref.removeEventListener("resize", handleResize);
    };
  }, [containerRef, updater]);
};

const useMutatorMap = (
  file: GeppettoImage,
  vectorValues: Record<string, Vec2>
) =>
  useMemo(
    () => vectorPositions(file.mutations, file.layerHierarchy, vectorValues),
    [file.mutations, file.layerHierarchy, vectorValues]
  );

export const Composition: React.FC<CompositionProps> = ({
  menu,
  textureState,
  onSectionChange,
}) => {
  const texture = textureState[0];
  const [file, setFile] = useFile();
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showWireFrames, setShowWireFrames] = useState(true);
  const [controlEditMode, setControlEditMode] = useState(false);

  const maxZoom = maxZoomFactor(texture);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedLayer, setFocusedLayer] = useState<string | undefined>();
  const [activeMutator, setActiveMutator] = useState<string | null>(null);
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
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

  const { actions, triggerKeyboardAction } = useActionMap(
    useCallback(
      () => ({
        toggleInfo: {
          icon: "ℹ",
          tooltip: "toggle info display",
          shortcut: TOGGLE_INFO_SHORTCUT,
          handler: () => {
            setShowItemDetails((prev) => !prev);
          },
        },
        toggleWireFrames: {
          icon: "🩻",
          tooltip: "toggle wireframes",
          shortcut: { alt: true, interaction: "KeyW" } as Shortcut,
          handler: () => {
            setShowWireFrames((prev) => !prev);
          },
        },
      }),
      []
    )
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (triggerKeyboardAction(event)) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [triggerKeyboardAction, actions]);

  const containerRef = useRef<HTMLDivElement>(null);
  useScaleUpdater(containerRef, texture);

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

  const handleClick = useEvent((event: React.MouseEvent<HTMLElement>) => {
    if (selectedItems.length === 1 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const imageConvert = imageToPixels(translation, rect);
      for (const mutatorId of visibleMutators) {
        const position = imageConvert(mutatorMap[mutatorId]);

        const elementX = event.pageX - rect.left;
        const elementY = event.pageY - rect.top - 2;
        if (
          elementX > position[0] - 6 &&
          elementX < position[0] + 6 &&
          elementY > position[1] - 6 &&
          elementY < position[1] + 6
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
      if (selectedItems.length === 1 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const imageConvert = imageToPixels(translation, rect);
        for (const mutatorId of visibleMutators) {
          const position = imageConvert(mutatorMap[mutatorId]);

          const elementX = event.pageX - rect.left;
          const elementY = event.pageY - rect.top - 2;
          if (
            elementX > position[0] - 6 &&
            elementX < position[0] + 6 &&
            elementY > position[1] - 6 &&
            elementY < position[1] + 6
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

        setFile(dragItem(origin, dragged, itemId));
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
      if (mutationType === "deform" || mutationType === "translate") {
        (settings as MutationSettings<"deform">).radius = -1;
      }

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

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <ToolTab
          icon={<Icon>🧬</Icon>}
          label={"Layers"}
          onClick={() => onSectionChange && onSectionChange("layers")}
        />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} active />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} disabled />
        <ToolSeparator />
        <ActionToolButton
          action={actions.toggleWireFrames}
          active={showWireFrames}
        />
        <ToolSpacer />
        <ActionToolButton
          action={actions.toggleInfo}
          active={showItemDetails}
        />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <ResizePanel
          direction={ResizeDirection.East}
          defaultSize={250}
          minSize={150}
        >
          <Column>
            <Panel padding={5}>
              <ShapeTree
                selectedItemsState={[selectedItems, updateSelectedItems]}
                focusedItemState={[focusedLayer, setFocusedLayer]}
                editControlId={editingControl}
              />
            </Panel>
            {!controlEditMode && (
              <ResizePanel
                direction={ResizeDirection.North}
                minSize={300}
                defaultSize={400}
              >
                <ControlTree
                  selectedControlsState={[
                    selectedControls,
                    setSelectedControls,
                  ]}
                  editControlSteps={controlEditMode}
                  onEditControlSteps={setControlEditMode}
                />
              </ResizePanel>
            )}
            {controlEditMode && (
              <Panel padding={5} fitContent={true}>
                <ControlEdit
                  selectedControlIds={selectedControls}
                  editControlSteps={controlEditMode}
                  onEditControlSteps={setControlEditMode}
                />
              </Panel>
            )}
          </Column>
        </ResizePanel>
        <Panel workspace center>
          <StartupScreen file={file} texture={texture} screen={"composition"} />
          {texture && hasPoints(file) && (
            <LayerMouseControl
              mode={MouseMode.Normal}
              maxZoomFactor={maxZoom}
              hoverCursor={hoverCursor}
              handleDrag={handleDrag}
              onClick={handleClick}
              onContextMenu={handleContextMenu}
            >
              <CompositionCanvas
                image={texture}
                activeLayers={selectedItems}
                activeMutation={activeMutator}
                showWireFrames={showWireFrames}
                file={file}
                ref={containerRef}
              >
                {/*activeMutator && containerRef.current && (
                  <DebugMutatorPoint
                    point={imageToPixels(
                      translation,
                      containerRef.current.getBoundingClientRect()
                    )(mutatorMap[activeMutator])}
                  />
                    )*/}
                <ControlledMenu
                  {...menuProps}
                  anchorPoint={anchorPoint}
                  onClose={() => toggleMenu(false)}
                >
                  <SubMenu
                    label="Add mutation"
                    disabled={selectedItems.length !== 1}
                  >
                    {Object.keys(mutationLabels).map((key) => (
                      <MenuItem
                        key={key}
                        value={key}
                        onClick={addMutationHandler}
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
                      selectedShapeIds={selectedItems}
                      selectedControlIds={[]}
                    />
                  </Inlay>
                )}
              </CompositionCanvas>
            </LayerMouseControl>
          )}
        </Panel>
        {showItemDetails && (
          <ResizePanel
            direction={ResizeDirection.West}
            defaultSize={250}
            minSize={150}
          >
            <Column>
              <Panel padding={5}>
                <ItemEdit
                  activeMutator={activeMutator}
                  selectedShapeIds={selectedItems}
                  selectedControlIds={[]}
                />
              </Panel>
            </Column>
          </ResizePanel>
        )}
      </Row>
    </Column>
  );
};
