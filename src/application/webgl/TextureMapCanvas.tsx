import React, { useEffect, useMemo } from "react";
import { Vec2 } from "../../types";
import { IDLayer, showLayerPoints } from "./programs/showLayerPoints";
import { showTexture } from "./programs/showTexture";
import { showGrid } from "./programs/showGrid";
import { showTextureMap } from "./programs/showTextureMap";
import WebGLCanvas from "./WebGLCanvas";
import { useScreenTranslation } from "../contexts/ScreenTranslationContext";

export type GridSettings = {
  size: number;
  enabled: boolean;
  magnetic: boolean;
};

export interface TextureMapCanvasProps {
  image: HTMLImageElement | null;
  layers: IDLayer[];
  grid: GridSettings;
  activeCoord?: Vec2 | null;
  activeLayer?: string;
  onMouseMove?(coordinates: [number, number] | null): void;
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({
  image,
  layers,
  grid,
  activeLayer,
  activeCoord = null,
}) => {
  const translate = useScreenTranslation();

  const textureProgram = useMemo(() => showTexture(translate), [translate]);
  const textureMapProgram = useMemo(
    () => showTextureMap(translate),
    [translate]
  );
  const pointsProgram = useMemo(() => showLayerPoints(translate), [translate]);
  const gridProgram = useMemo(() => showGrid(translate), [translate]);

  const renderers = useMemo(
    () => [
      textureProgram.renderer,
      gridProgram.renderer,
      textureMapProgram.renderer,
      pointsProgram.renderer,
    ],
    [
      textureProgram.renderer,
      gridProgram.renderer,
      textureMapProgram.renderer,
      pointsProgram.renderer,
    ]
  );

  useEffect(() => {
    if (image) {
      textureProgram.setImage(image);
      textureMapProgram.setImage(image);
      pointsProgram.setImage(image);
      gridProgram.setImage(image);
    }
  }, [image, textureProgram, textureMapProgram, pointsProgram, gridProgram]);

  useEffect(() => {
    textureMapProgram.setLayers(layers);
    pointsProgram.setLayers(layers);
  }, [layers, textureMapProgram, pointsProgram]);

  // textureMapProgram.setZoom(zoom);
  // textureProgram.setZoom(zoom);
  // pointsProgram.setZoom(zoom);
  // gridProgram.setZoom(zoom);
  // textureMapProgram.setPan(panX, panY);
  // textureProgram.setPan(panX, panY);
  // pointsProgram.setPan(panX, panY);
  // gridProgram.setPan(panX, panY);

  gridProgram.setGrid(grid.enabled ? grid.size : 0);
  pointsProgram.setLayerSelected(activeLayer);
  pointsProgram.setActiveCoord(activeCoord);

  return <WebGLCanvas renderers={renderers} />;
};

export default TextureMapCanvas;
