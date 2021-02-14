import {
  ItemSelection,
  MutationVector,
  ShapeDefinition,
} from "../../lib/types";
import { verticesFromPoints } from "../../lib/vertices";
import { createProgram, WebGLRenderer } from "../../lib/webgl";
import { flattenShapes, getAnchor } from "./utils";

const compositionVertexShader = `
  uniform vec2 viewport;
  uniform vec3 translate;
  uniform vec4 scale;

  uniform vec3 uMutationVectors[16];
  uniform vec2 uMutationValues[16];

  attribute vec2 coordinates;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  void main() {
    vec2 deform = coordinates;

    for(int i = 0; i < 16; i++) {
      vec3 position = uMutationVectors[i];
      if (position.z > 0.0) {
        float effect = 1.0 - clamp(distance(coordinates, position.xy), 0.0, position.z) / position.z;

        deform = deform + uMutationValues[i] * effect;
      }
    }

    vec4 pos = viewportScale * vec4((deform + translate.xy) * scale.x, translate.z, 1.0);
    gl_Position = vec4((pos.xy + scale.ba) * scale.y, pos.z - 1.0, 1.0);
  }
`;

const compositionFragmentShader = `
  precision mediump float;

  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

export const showCompositionMap = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: ShapeDefinition[]): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setLayerSelected(layer: null | ItemSelection): void;
  renderer: WebGLRenderer;
} => {
  const stride = 2;

  let shapes: ShapeDefinition[] | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let layersSelected: string[] = [];

  let elements: {
    start: number;
    amount: number;
    mutationVectors: MutationVector[];
  }[] = [];
  let zoom = 1.0;
  let pan = [0, 0];

  const populateShapes = () => {
    if (!shapes || !gl || !indexBuffer || !vertexBuffer) return;
    const vertices: number[] = [];
    elements = [];
    const sprites = flattenShapes(shapes);

    sprites.forEach((shape) => {
      const anchor = getAnchor(shape);
      const points = shape.points.map(([x, y]) => [
        x - anchor[0],
        y - anchor[1],
      ]);
      const list = verticesFromPoints(points);
      // const deformationVectors = Object.entries(
      //   shape.mutationVectors || {}
      // ).reduce(
      //   (result, [key, value], index) => ({
      //     ...result,
      //     [key]: { vector: value, index },
      //   }),
      //   {} as Record<string, MutationVector>
      // );
      elements.push({
        start: vertices.length / stride,
        amount: list.length / 2,
        mutationVectors: [],
      });
      vertices.push(...list);
    });
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
    setLayerSelected(layer) {
      if (layer === null || shapes === null) {
        layersSelected = [];
        return;
      }

      const checkMatch = (shape: ShapeDefinition, item: ItemSelection) =>
        (shape.name === item.name && item.type === "layer") ||
        (item.type === "vector" &&
          (shape.type === "sprite" || shape.type === "folder") &&
          shape.mutationVectors &&
          shape.mutationVectors.map((v) => v.name).includes(item.name));

      const collectSpriteNames = (
        s: ShapeDefinition[],
        collect = false
      ): string[] =>
        s.reduce(
          (result, shape) =>
            shape.type === "sprite"
              ? collect || checkMatch(shape, layer)
                ? result.concat(shape.name)
                : result
              : result.concat(
                  collectSpriteNames(
                    shape.items,
                    collect || checkMatch(shape, layer)
                  )
                ),
          [] as string[]
        );

      layersSelected = collectSpriteNames(shapes);
    },
    renderer(initgl: WebGLRenderingContext, { getSize }) {
      gl = initgl;

      vertexBuffer = gl.createBuffer();
      indexBuffer = gl.createBuffer();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        compositionVertexShader,
        compositionFragmentShader
      );

      return {
        render() {
          if (!img || !shapes) {
            return;
          }
          const gl = initgl;
          gl.useProgram(shaderProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          const coord = gl.getAttribLocation(shaderProgram, "coordinates");
          gl.vertexAttribPointer(
            coord,
            2,
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

          gl.uniform2f(
            gl.getUniformLocation(shaderProgram, "viewport"),
            canvasWidth,
            canvasHeight
          );

          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "scale"),
            scale,
            zoom,
            pan[0],
            pan[1]
          );

          const basePosition = [
            canvasWidth / 2 / scale,
            canvasHeight / 2 / scale,
            0.1,
          ];
          const sprites = flattenShapes(shapes);

          const calculatedElements = elements.map((element, index) => {
            const sprite = sprites[index];
            const itemOffset = [
              ...sprite.translate,
              sprites.indexOf(sprite) * 0.1,
            ];

            // const deformationVectorList = Object.values(
            //   element.deformationVectors
            // ).reduce((list, item) => list.concat(item.vector), [] as number[]);

            return {
              name: sprite.name,
              ...element,
              x: basePosition[0] + itemOffset[0],
              y: basePosition[1] + itemOffset[1],
              z: basePosition[2] - itemOffset[2] * 0.001,
              // deformationVectorList,
            };
          });

          calculatedElements.sort((a, b) => (b.z || 0) - (a.z || 0));

          const translate = gl.getUniformLocation(shaderProgram, "translate");
          // const deformation = gl.getUniformLocation(
          //   shaderProgram,
          //   "uMutationVectors"
          // );
          const deformationValues = gl.getUniformLocation(
            shaderProgram,
            "uMutationValues"
          );

          calculatedElements.forEach((element) => {
            if (layersSelected.includes(element.name) && element.amount > 0) {
              gl.uniform3f(translate, element.x, element.y, element.z);

              const deformValues: number[] = Array(16 * 2).fill(0);
              gl.uniform2fv(deformationValues, deformValues);

              gl.drawArrays(initgl.LINE_STRIP, element.start, element.amount);
            }
          });
        },
        cleanup() {
          const gl = initgl;
          gl.deleteBuffer(vertexBuffer);
          gl.deleteBuffer(indexBuffer);
          programCleanup();
        },
      };
    },
  };
};
