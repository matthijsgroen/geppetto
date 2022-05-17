import {
  RefObject,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  ScreenTranslation,
  useScreenTranslation,
  useUpdateScreenTranslation,
} from "../contexts/ScreenTranslationContext";
import { useActionMap } from "../hooks/useActionMap";
import { AppSection, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";
import { useVectorValues, vectorPositions } from "../webgl/lib/vectorPositions";
import { vecAdd, vecScale } from "../webgl/lib/vertices";
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

interface Size {
  readonly width: number;
  readonly height: number;
}

const calculateScale = (element: Size, texture: Size) => {
  const landscape =
    texture.width / element.width > texture.height / element.height;
  return landscape
    ? element.width / texture.width
    : element.height / texture.height;
};

const imageToPercentage = (
  coord: Vec2,
  translation: ScreenTranslation,
  rect: Size
): Vec2 => {
  const center: Vec2 = [0.5 * rect.width, 0.5 * rect.height];
  const panning: Vec2 = [
    translation.panX * rect.width,
    -translation.panY * rect.height,
  ];
  const vecZoom = vecScale(panning, translation.zoom / 2);

  return vecAdd(
    vecAdd(vecScale(coord, translation.zoom * translation.scale), center),
    vecZoom
  );
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

  const maxZoom = maxZoomFactor(texture);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const vectorValues = useVectorValues(file);

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
      }),
      [setShowItemDetails]
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

  let position: Vec2 = [0, 0];
  const translation = useScreenTranslation();
  if (selectedItems.length === 1) {
    const itemId = selectedItems[0];
    const item = file.layerHierarchy[itemId];
    if (item.type === "mutation" && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      position = imageToPercentage(mutatorMap[itemId], translation, rect);
    }
  }

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
                  selectedItemsState={[selectedItems, setSelectedItems]}
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
            <LayerMouseControl mode={MouseMode.Grab} maxZoomFactor={maxZoom}>
              <CompositionCanvas
                image={texture}
                activeLayers={selectedItems}
                file={file}
                vectorValues={vectorValues}
                ref={containerRef}
              >
                {!showItemDetails && (
                  <Inlay>
                    <InlayControlPanel
                      selectedShapeIds={selectedItems}
                      selectedControlIds={[]}
                    />
                  </Inlay>
                )}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    left: position[0],
                    top: position[1] - 4,
                    position: "absolute",
                    backgroundColor: "transparent",
                    border: "2px solid pink",
                    fontSize: "1px",
                    cursor: "pointer",
                    zIndex: 1,
                    transform: "translate(-5px, -5px)",
                  }}
                >
                  V
                </div>
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
