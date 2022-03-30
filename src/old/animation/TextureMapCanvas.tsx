import React, { useEffect, useMemo } from "react";
import { Vec2 } from "../../application/types";
import {
  ItemSelection,
  ShapeDefinition,
} from "../../application/animation/file1-types";
import { showLayerPoints } from "./programs/showLayerPoints";
import { showTexture } from "./programs/showTexture";
import { showGrid } from "./programs/showGrid";
import { showTextureMap } from "./programs/showTextureMap";
import WebGLCanvas from "./WebGLCanvas";

export type GridSettings = {
  size: number;
  enabled: boolean;
  magnetic: boolean;
};

export const GRID_SIZES = [8, 16, 32, 64, 128];

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  shapes: ShapeDefinition[];
  grid: GridSettings;
  zoom?: number;
  panX: number;
  panY: number;
  activeCoord?: Vec2 | null;
  activeLayer?: ItemSelection | null;
  onMouseMove?(coordinates: [number, number] | null): void;
  showFPS?: boolean;
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  shapes,
  zoom = 1.0,
  panX,
  panY,
  grid,
  activeLayer = null,
  activeCoord = null,
  showFPS,
}) => {
  const textureProgram = useMemo(() => showTexture(), []);
  const textureMapProgram = useMemo(() => showTextureMap(), []);
  const pointsProgram = useMemo(() => showLayerPoints(), []);
  const gridProgram = useMemo(() => showGrid(), []);

  const renderers = [
    textureProgram.renderer,
    gridProgram.renderer,
    textureMapProgram.renderer,
    pointsProgram.renderer,
  ];

  useEffect(() => {
    if (image) {
      textureProgram.setImage(image);
      textureMapProgram.setImage(image);
      pointsProgram.setImage(image);
      gridProgram.setImage(image);
    }
  }, [image]);

  useEffect(() => {
    textureMapProgram.setShapes(shapes);
    pointsProgram.setShapes(shapes);
  }, [shapes]);
  textureMapProgram.setZoom(zoom);
  textureProgram.setZoom(zoom);
  pointsProgram.setZoom(zoom);
  gridProgram.setZoom(zoom);
  textureMapProgram.setPan(panX, panY);
  textureProgram.setPan(panX, panY);
  pointsProgram.setPan(panX, panY);
  gridProgram.setPan(panX, panY);
  gridProgram.setGrid(grid.enabled ? GRID_SIZES[grid.size] : 0);
  pointsProgram.setLayerSelected(activeLayer ? activeLayer.name : null);
  pointsProgram.setActiveCoord(activeCoord);

  return <WebGLCanvas renderers={renderers} showFPS={showFPS} />;
};

export default TextureMapCanvas;
