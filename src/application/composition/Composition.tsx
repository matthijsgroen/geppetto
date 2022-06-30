import {
  RefObject,
  SetStateAction,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { visit } from "../../animation/file2/hierarchy";
import { isShapeMutationVector } from "../../animation/file2/mutation";
import { hasPoints } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import { Vec2 } from "../../types";
import {
  Column,
  Icon,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  Shortcut,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
} from "../../ui-components";
import { ActionToolButton } from "../actions/ActionToolButton";
import { useFile } from "../applicationMenu/FileContext";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { StartupScreen } from "../applicationMenu/Startup";
import LayerMouseControl from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import {
  useScreenTranslation,
  useUpdateScreenTranslation,
} from "../contexts/ScreenTranslationContext";
import { useActionMap } from "../hooks/useActionMap";
import useEvent from "../hooks/useEvent";
import { AppSection, Size, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";
import { imageToPixels } from "../webgl/lib/screenCoord";
import { useVectorValues, vectorPositions } from "../webgl/lib/vectorPositions";
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
  key: "KeyI",
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
) => {
  const deferredVectorValues = useDeferredValue(vectorValues);
  const deferredMutations = useDeferredValue(file.mutations);

  const mutatorMap = useMemo(
    () =>
      vectorPositions(
        deferredMutations,
        file.layerHierarchy,
        deferredVectorValues
      ),
    [deferredMutations, file.layerHierarchy, deferredVectorValues]
  );

  return mutatorMap;
};

export const Composition: React.FC<CompositionProps> = ({
  menu,
  textureState,
  onSectionChange,
}) => {
  const texture = textureState[0];
  const [file] = useFile();
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showWireFrames, setShowWireFrames] = useState(true);

  const maxZoom = maxZoomFactor(texture);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedLayer, setFocusedLayer] = useState<string | undefined>();
  const [activeMutator, setActiveMutator] = useState<string | null>(null);
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const vectorValues = useVectorValues(file);

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
          shortcut: { alt: true, key: "KeyW" } as Shortcut,
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

      return MouseMode.Grab;
    }
  );

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
            <ResizePanel
              direction={ResizeDirection.South}
              minSize={300}
              defaultSize={400}
            >
              <Panel padding={5}>
                <ShapeTree
                  selectedItemsState={[selectedItems, updateSelectedItems]}
                  focusedItemState={[focusedLayer, setFocusedLayer]}
                />
              </Panel>
            </ResizePanel>
            <ControlTree
              selectedControlsState={[selectedControls, setSelectedControls]}
            />
          </Column>
        </ResizePanel>
        <Panel workspace center>
          <StartupScreen file={file} texture={texture} screen={"composition"} />
          {texture && hasPoints(file) && (
            <LayerMouseControl
              mode={MouseMode.Grab}
              maxZoomFactor={maxZoom}
              hoverCursor={hoverCursor}
              onClick={handleClick}
            >
              <CompositionCanvas
                image={texture}
                activeLayers={selectedItems}
                activeMutation={activeMutator}
                showWireFrames={showWireFrames}
                file={file}
                vectorValues={vectorValues}
                ref={containerRef}
              >
                {!showItemDetails && (
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
