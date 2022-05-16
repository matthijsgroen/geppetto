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
import { useActionMap } from "../hooks/useActionMap";
import { AppSection, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";
import {
  calculateVectorValues,
  vectorPositions,
} from "../webgl/lib/vectorPositions";
import { vecAdd, vecScale } from "../webgl/lib/vertices";
import { ControlTree } from "./ControlTree";
import { Inlay } from "./Inlay";
import { InlayControlPanel, ItemEdit } from "./ItemEdit";
import { ShapeTree } from "./ShapeTree";

type CompositionProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  onSectionChange?: (newSection: AppSection) => void;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

const TOGGLE_INFO_SHORTCUT: Shortcut = {
  ctrlOrCmd: true,
  key: "KeyI",
};

interface Size {
  width: number;
  height: number;
}

const calculateScale = (element: Size, texture: Size) => {
  const landscape =
    texture.width / element.width > texture.height / element.height;
  return landscape
    ? element.width / texture.width
    : element.height / texture.height;
};

const useMutatorMap = (
  containerRef: RefObject<HTMLDivElement>,
  texture: HTMLImageElement | null,
  file: GeppettoImage,
  vectorValues: Record<string, Vec2>,
  zoom: number,
  panX: number,
  panY: number
) => {
  const deferredVectorValues = useDeferredValue(vectorValues);
  const deferredMutations = useDeferredValue(file.mutations);
  const [scale, setScale] = useState(1.0);
  const [rect, setRect] = useState<Size>({ width: 1, height: 1 });
  const textureRef = useRef(texture);
  textureRef.current = texture;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && textureRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScale(calculateScale(rect, textureRef.current));
        setRect({ width: rect.width, height: rect.height });
      }
    };

    const ref = containerRef.current;
    if (ref === null) return;
    ref.addEventListener("resize", handleResize);
    return () => {
      ref.removeEventListener("resize", handleResize);
    };
  }, [containerRef]);

  const mutatorMap = useMemo(
    () =>
      vectorPositions(
        deferredMutations,
        file.layerHierarchy,
        deferredVectorValues
      ),
    [deferredMutations, file.layerHierarchy, deferredVectorValues]
  );

  const scaledMutatorMap = useMemo(() => {
    const result: Record<string, Vec2> = {};
    const center: Vec2 = [rect.width / 2, rect.height / 2];
    const panning: Vec2 = [rect.width * panX, -rect.height * panY];
    const vecZoom = vecScale(panning, zoom / 2);

    for (const mutator in mutatorMap) {
      const value = mutatorMap[mutator];

      result[mutator] = vecAdd(
        vecAdd(vecScale(value, zoom * scale), center),
        vecZoom
      );
    }

    return result;
  }, [scale, rect, mutatorMap, panX, panY, zoom]);
  return scaledMutatorMap;
};

export const Composition: React.FC<CompositionProps> = ({
  menu,
  textureState,
  zoomState,
  panXState,
  panYState,
  onSectionChange,
}) => {
  const texture = textureState[0];
  const [file] = useFile();
  const [showItemDetails, setShowItemDetails] = useState(false);

  const maxZoom = maxZoomFactor(texture);

  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const vectorValues = calculateVectorValues(file);

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

  const mutatorMap = useMutatorMap(
    containerRef,
    texture,
    file,
    vectorValues,
    zoom,
    panX,
    panY
  );

  let position: Vec2 = [10, 0];
  if (selectedItems.length === 1) {
    const itemId = selectedItems[0];
    const item = file.layerHierarchy[itemId];
    if (item.type === "mutation") {
      position = mutatorMap[itemId];
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
            <LayerMouseControl
              mode={MouseMode.Grab}
              maxZoomFactor={maxZoom}
              panXState={panXState}
              panYState={panYState}
              zoomState={zoomState}
            >
              <CompositionCanvas
                image={texture}
                activeLayers={selectedItems}
                file={file}
                zoom={zoom}
                panX={panX}
                panY={panY}
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
