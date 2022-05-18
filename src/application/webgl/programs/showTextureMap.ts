import raw from "raw.macro";
import { Layer } from "../../../animation/file2/types";
import { ScreenTranslation } from "../../types";
import { verticesFromPoints } from "../lib/vertices";
import { createProgram, WebGLRenderer } from "../lib/webgl";

const textureMapVertexShader = raw("./showTextureMap.vert");
const textureMapFragmentShader = raw("./showTextureMap.frag");

type Element = { start: number; amount: number };
const STRIDE = 2;

export const showTextureMap = (
  trans: ScreenTranslation
): {
  setImage(image: HTMLImageElement): void;
  setLayers(layers: Layer[]): void;
  renderer: WebGLRenderer;
} => {
  let shapes: Layer[] | null = null;

  let img: HTMLImageElement | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let gl: WebGLRenderingContext | null = null;
  const screenTranslation = trans;

  let elements: Element[] = [];

  const populateShapes = () => {
    if (!shapes || !gl || !indexBuffer || !vertexBuffer) return;
    elements = [];

    const vertices = shapes.reduce((coordList, shape) => {
      const list = verticesFromPoints(shape.points);
      elements.push({
        start: coordList.length / STRIDE,
        amount: list.length / 2,
      });

      return coordList.concat(list);
    }, [] as number[]);

    const indices = Array(vertices.length / STRIDE)
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
    setImage(image: HTMLImageElement) {
      img = image;
      onChange();
    },
    setLayers(s: Layer[]) {
      shapes = s;
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
        textureMapVertexShader,
        textureMapFragmentShader
      );

      return {
        onChange(listener) {
          onChange = listener;
        },
        render() {
          if (!shapes || !img || !vertexBuffer || !indexBuffer || !gl) {
            return;
          }
          gl.useProgram(shaderProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          const coord = gl.getAttribLocation(shaderProgram, "coordinates");
          gl.vertexAttribPointer(
            coord,
            2,
            gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * STRIDE,
            /* offset */ 0
          );
          gl.enableVertexAttribArray(coord);
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
            gl.getUniformLocation(shaderProgram, "viewport"),
            canvasWidth,
            canvasHeight,
            x,
            y
          );

          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "scale"),
            scale,
            screenTranslation.zoom,
            screenTranslation.panX,
            screenTranslation.panY
          );

          elements.forEach((element) => {
            if (element.amount > 0) {
              for (let i = 0; i < element.amount; i += 3) {
                initGl.drawArrays(initGl.LINE_LOOP, element.start + i, 3);
              }
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
