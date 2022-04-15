import { Vec2 } from "../../../types";
import { Layer } from "../../../animation/file2/types";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import raw from "raw.macro";

const layerPointsVertexShader = raw("./showLayerPoints.vert");
const layerPointsFragmentShader = raw("./showLayerPoints.frag");

export type IDLayer = Layer & { id: string };

export const showLayerPoints = (): {
  setImage(image: HTMLImageElement): void;
  setLayers(layers: IDLayer[]): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
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
  let zoom = 1.0;
  let pan = [0, 0];
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

  return {
    setImage(image) {
      img = image;
    },
    setLayers(s) {
      layers = s;
      populateShapes();
    },
    setZoom(newZoom) {
      zoom = newZoom;
    },
    setPan(x, y) {
      pan = [x, y];
    },
    setLayerSelected(layer) {
      layerSelected = layer;
    },
    setActiveCoord(coord) {
      coordSelected = coord;
      populateShapes();
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

      return {
        render() {
          if (!layers || !img || !vertexBuffer || !indexBuffer || !gl) {
            return;
          }
          gl.useProgram(shaderProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          const coord = gl.getAttribLocation(shaderProgram, "coordinates");
          gl.vertexAttribPointer(
            coord,
            3,
            gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * stride,
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
            zoom,
            pan[0],
            pan[1]
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
        },
      };
    },
  };
};
