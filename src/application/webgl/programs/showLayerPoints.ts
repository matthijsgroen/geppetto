import { Vec2 } from "../../../types";
import { Layer } from "../../../animation/file2/types";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import raw from "raw.macro";
import { colorScheme } from "../../theme/darkMode";
import { ScreenTranslation } from "../../contexts/ScreenTranslationContext";

const layerPointsVertexShader = raw("./showLayerPoints.vert");
const layerPointsFragmentShader = raw("./showLayerPoints.frag");

export type IDLayer = Layer & { id: string };

export const showLayerPoints = (
  trans: ScreenTranslation
): {
  setImage(image: HTMLImageElement): void;
  setLayers(layers: IDLayer[]): void;
  setLayerSelected(layer: undefined | string): void;
  setActiveCoord(coord: null | Vec2): void;
  renderer: WebGLRenderer;
} => {
  const stride = 3;

  let layers: IDLayer[] | null = null;
  let img: HTMLImageElement | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let gl: WebGLRenderingContext | null = null;
  const screenTranslation = trans;
  let layerSelected: string | undefined = undefined;
  let coordSelected: Vec2 | null = null;

  let elements: { start: number; amount: number; id: string }[] = [];

  const populateShapes = () => {
    if (!layers || !gl || !indexBuffer || !vertexBuffer) return;
    elements = [];

    const vertices = layers.reduce<number[]>((coordList, shape) => {
      const list = shape.points.reduce<number[]>(
        (result, point) =>
          result
            .concat(point)
            .concat(
              coordSelected &&
                point[0] === coordSelected[0] &&
                point[1] === coordSelected[1]
                ? 1.0
                : 0.0
            ),
        []
      );
      elements.push({
        start: coordList.length / stride,
        amount: list.length / stride,
        id: shape.id,
      });

      return coordList.concat(list);
    }, []);

    const indices = Array(vertices.length / stride)
      .fill(0)
      .map((_, i) => i);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  };
  let onChange: () => void = () => {};

  return {
    setImage(image) {
      img = image;
      onChange();
    },
    setLayers(s) {
      layers = s;
      populateShapes();
      onChange();
    },
    setLayerSelected(layer) {
      layerSelected = layer;
      onChange();
    },
    setActiveCoord(coord) {
      coordSelected = coord;
      populateShapes();
      onChange();
    },
    renderer(initGl: WebGLRenderingContext, { getSize }) {
      gl = initGl;
      vertexBuffer = gl.createBuffer();
      indexBuffer = gl.createBuffer();
      populateShapes();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        layerPointsVertexShader,
        layerPointsFragmentShader
      );

      const programInfo = {
        uniforms: {
          viewport: gl.getUniformLocation(shaderProgram, "viewport"),
          scale: gl.getUniformLocation(shaderProgram, "scale"),
          darkMode: gl.getUniformLocation(shaderProgram, "darkMode"),
        },
        attributes: {
          coordinates: gl.getAttribLocation(shaderProgram, "coordinates"),
        },
      };

      return {
        onChange(listener) {
          onChange = listener;
        },
        render() {
          if (!layers || !img || !vertexBuffer || !indexBuffer || !gl) {
            return;
          }
          gl.useProgram(shaderProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          gl.vertexAttribPointer(
            programInfo.attributes.coordinates,
            3,
            gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * stride,
            /* offset */ 0
          );
          gl.enableVertexAttribArray(programInfo.attributes.coordinates);
          const [canvasWidth, canvasHeight] = getSize();
          const landscape = img.width / canvasWidth > img.height / canvasHeight;

          const scale = landscape
            ? canvasWidth / img.width
            : canvasHeight / img.height;

          const [x, y] = [
            (canvasWidth - scale * img.width) / 2,
            (canvasHeight - scale * img.height) / 2,
          ];

          gl.uniform4f(
            programInfo.uniforms.viewport,
            canvasWidth,
            canvasHeight,
            x,
            y
          );

          gl.uniform4f(
            programInfo.uniforms.scale,
            scale,
            screenTranslation.zoom,
            screenTranslation.panX,
            screenTranslation.panY
          );
          gl.uniform1f(
            programInfo.uniforms.darkMode,
            colorScheme.darkMode ? 1.0 : 0.0
          );

          elements.forEach((element) => {
            if (element.id === layerSelected && element.amount > 0) {
              initGl.drawArrays(initGl.POINTS, element.start, element.amount);
            }
          });
        },
        cleanup() {
          initGl.deleteBuffer(vertexBuffer);
          initGl.deleteBuffer(indexBuffer);
          programCleanup();
          gl = null;
        },
      };
    },
  };
};
