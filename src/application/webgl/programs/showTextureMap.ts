import { ShapeDefinition } from "../../../animation/file1/types";
import { verticesFromPoints } from "../lib/vertices";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import { flattenShapes } from "./utils";

const textureMapVertexShader = `
  attribute vec2 coordinates;
  uniform vec4 viewport;
  uniform vec4 scale;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  void main() {
    vec4 pos = viewportScale * vec4((coordinates * scale.x) + viewport.ba, 0.0, 1.0);
    gl_Position = vec4((pos.xy  + scale.ba) * scale.y, pos.z, 1.0);
  }
`;

const textureMapFragmentShader = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
  }
`;

type Element = { start: number; amount: number };
const STRIDE = 2;

export const showTextureMap = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(shapes: ShapeDefinition[]): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  renderer: WebGLRenderer;
} => {
  let shapes: ShapeDefinition[] | null = null;
  let img: HTMLImageElement | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let gl: WebGLRenderingContext | null = null;
  let zoom = 1.0;
  let pan = [0, 0];

  let elements: Element[] = [];

  const populateShapes = () => {
    if (!shapes || !gl || !indexBuffer || !vertexBuffer) return;
    elements = [];
    const sprites = flattenShapes(shapes);

    const vertices = sprites.reduce((coordList, shape) => {
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

  return {
    setImage(image: HTMLImageElement) {
      img = image;
    },
    setShapes(s: ShapeDefinition[]) {
      shapes = s;
      populateShapes();
    },
    setZoom(newZoom) {
      zoom = newZoom;
    },
    setPan(x: number, y: number) {
      pan = [x, y];
    },
    renderer(initgl: WebGLRenderingContext, { getSize }) {
      gl = initgl;
      vertexBuffer = gl.createBuffer();
      indexBuffer = gl.createBuffer();
      populateShapes();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        textureMapVertexShader,
        textureMapFragmentShader
      );

      return {
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
            zoom,
            pan[0],
            pan[1]
          );

          elements.forEach((element) => {
            if (element.amount > 0) {
              for (let i = 0; i < element.amount; i += 3) {
                initgl.drawArrays(initgl.LINE_LOOP, element.start + i, 3);
              }
            }
          });
        },
        cleanup() {
          initgl.deleteBuffer(vertexBuffer);
          initgl.deleteBuffer(indexBuffer);
          programCleanup();
        },
      };
    },
  };
};
