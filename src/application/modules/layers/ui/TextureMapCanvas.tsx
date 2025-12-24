import React, { useEffect, useMemo } from "react";

import { useScreenTranslation } from "@/application/state/ScreenTranslationContext";
import WebGLCanvas from "@/infrastructure/webgl/WebGLCanvas";
import { type Vec2 } from "@/shared/types/global";

import { showGrid } from "../programs/showGrid";
import { type IDLayer, showLayerPoints } from "../programs/showLayerPoints";
import { showTexture } from "../programs/showTexture";
import { showTextureMap } from "../programs/showTextureMap";

export type GridSettings = {
  size: number;
  enabled: boolean;
  magnetic: boolean;
};

export type TextureMapCanvasProps = {
  image: HTMLImageElement | null;
  layers: IDLayer[];
  grid: GridSettings;
  activeCoord?: Vec2 | null;
  activeLayer?: string;
  onMouseMove?(coordinates: [number, number] | null): void;
};

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
