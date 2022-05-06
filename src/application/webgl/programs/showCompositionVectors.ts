import { TranslationVector } from "geppetto-player";
import raw from "raw.macro";
import { collectChildIds, visit } from "../../../animation/file2/hierarchy";
import { isShapeMutationVector } from "../../../animation/file2/shapes";
import {
  GeppettoImage,
  MutationVector,
  Keyframe,
  DeformationVector,
} from "../../../animation/file2/types";
import { flatten } from "../lib/vertices";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import { createShapeMutationList, MAX_MUTATION_VECTORS } from "./utils";

const compositionVertexShader = raw("./showCompositionVectors.vert");
const compositionFragmentShader = raw("./showCompositionVectors.frag");

type Color = [number, number, number];

const orange = [238, 115, 0].map((v) => v / 256.0) as Color;
const red = [230, 0, 0].map((v) => v / 256.0) as Color;
const purple = [187, 0, 255].map((v) => v / 256.0) as Color;
const green = [0, 180, 0].map((v) => v / 256.0) as Color;
const white = [240, 240, 240].map((v) => v / 256.0) as Color;

const EPSILON = 0.00001;

const colorMapping: Record<MutationVector["type"], Color> = {
  deform: orange,
  rotate: red,
  stretch: purple,
  translate: green,
  opacity: white,
  lightness: white,
  colorize: orange,
  saturation: green,
};

const hasRadius = (
  vector: MutationVector
): vector is DeformationVector | TranslationVector =>
  vector.type === "deform" ||
  (vector.type === "translate" && vector.radius !== -1);

export const showCompositionVectors = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: GeppettoImage): void;
  setVectorValues(v: Keyframe): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setLayerSelected(layers: string[]): void;
  renderer: WebGLRenderer;
} => {
  const stride = 6;

  let shapes: GeppettoImage | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let program: WebGLProgram | null = null;
  let vectorsSelected: string[] = [];
  let vectorValues: Keyframe = {};

  let vectors: {
    id: string;
    start: number;
    amount: number;
    mutator: number;
    boundToLayerId: string;
    x: number;
    y: number;
    z: number;
  }[] = [];
  let mutators: string[] = [];
  let zoom = 1.0;
  let pan = [0, 0];
  let scale = 1.0;

  const populateShapes = () => {
    if (!shapes || !gl || !indexBuffer || !vertexBuffer || !program) return;
    const vertices: number[] = [];
    const indices: number[] = [];
    gl.useProgram(program);

    vectors = [];
    const file = shapes;
    let index = 0;
    visit(file.layerHierarchy, (node, nodeId) => {
      if (node.type !== "mutation") return;

      const vector = file.mutations[nodeId];
      if (!vector || !isShapeMutationVector(vector)) return;

      const start = indices.length;

      vectors.push({
        id: nodeId,
        mutator: 0,
        boundToLayerId: node.parentId,
        x: vector.origin[0],
        y: vector.origin[1],
        z: EPSILON * index,
        start,
        amount: 6,
      });
      index++;

      const offset = vertices.length / stride;
      const color = colorMapping[vector.type];
      vertices.push(0, -3, ...color, 1);
      vertices.push(1, -3, ...color, 1);
      vertices.push(2, -3, ...color, 1);
      vertices.push(3, -3, ...color, 1);

      indices.push(
        offset,
        offset + 1,
        offset + 2,
        offset + 1,
        offset + 2,
        offset + 3
      );
      if (hasRadius(vector)) {
        const start = indices.length;
        vectors.push({
          id: nodeId,
          mutator: 0,
          boundToLayerId: node.parentId,
          x: vector.origin[0],
          y: vector.origin[1],
          z: 0.2 + EPSILON * index,
          start,
          amount: 6,
        });
        const offset = vertices.length / stride;
        const color = colorMapping[vector.type];
        vertices.push(0, vector.radius, ...color, 0.2);
        vertices.push(1, vector.radius, ...color, 0.2);
        vertices.push(2, vector.radius, ...color, 0.2);
        vertices.push(3, vector.radius, ...color, 0.2);

        indices.push(
          offset,
          offset + 1,
          offset + 2,
          offset + 1,
          offset + 2,
          offset + 3
        );
      }
    });

    const { parentList, vectorSettings, mutatorMapping } =
      createShapeMutationList(shapes);

    vectors.forEach((vector) => {
      vector.mutator = mutatorMapping[vector.id];
    });

    mutators = Object.keys(mutatorMapping);

    const uMutationVectors = gl.getUniformLocation(program, "uMutationVectors");
    gl.uniform4fv(uMutationVectors, flatten(vectorSettings));

    const uMutationParent = gl.getUniformLocation(program, "uMutationParent");
    gl.uniform1iv(uMutationParent, parentList);

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

  let cWidth = 0;
  let cHeight = 0;
  let basePosition = [0, 0, 0.1];

  let onChange: () => void = () => {};

  return {
    setImage(image: HTMLImageElement) {
      img = image;
      onChange();
    },
    setShapes(s: GeppettoImage) {
      shapes = s;
      populateShapes();
      onChange();
    },
    setVectorValues(v) {
      vectorValues = v;
      if (mutators.length === 0 || !program || !gl) return;
      gl.useProgram(program);

      const uMutationValues = gl.getUniformLocation(program, "uMutationValues");
      const mutationValues = new Float32Array(MAX_MUTATION_VECTORS * 2).fill(0);
      Object.entries(vectorValues).forEach(([key, value]) => {
        const index = mutators.indexOf(key);
        if (index === -1) return;
        mutationValues[index * 2] = value[0];
        mutationValues[index * 2 + 1] = value[1];
      });
      gl.uniform2fv(uMutationValues, mutationValues);
      onChange();
    },
    setZoom(newZoom) {
      zoom = newZoom;
      onChange();
    },
    setPan(x: number, y: number) {
      pan = [x, y];
      onChange();
    },
    setLayerSelected(layers) {
      if (layers === null || shapes === null) {
        vectorsSelected = [];
        return;
      }
      vectorsSelected = [];
      for (const layerId of layers) {
        vectorsSelected.push(layerId);
        vectorsSelected.push(
          ...collectChildIds(shapes.layerHierarchy, layerId)
        );
      }
      onChange();
    },
    renderer(initGl: WebGLRenderingContext, { getSize }) {
      gl = initGl;

      vertexBuffer = gl.createBuffer();
      indexBuffer = gl.createBuffer();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        compositionVertexShader,
        compositionFragmentShader
      );
      program = shaderProgram;

      const translate = gl.getUniformLocation(shaderProgram, "translate");
      const mutation = gl.getUniformLocation(shaderProgram, "mutation");
      const uBasePosition = gl.getUniformLocation(
        shaderProgram,
        "basePosition"
      );

      return {
        onChange(listener) {
          onChange = listener;
        },
        render() {
          if (!img || !shapes) {
            return;
          }
          const gl = initGl;
          gl.useProgram(shaderProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          const coord = gl.getAttribLocation(shaderProgram, "coordinates");
          gl.vertexAttribPointer(
            coord,
            2,
            gl.FLOAT,
            false,
            stride * Float32Array.BYTES_PER_ELEMENT,
            /* offset */ 0
          );
          gl.enableVertexAttribArray(coord);

          const colors = gl.getAttribLocation(shaderProgram, "color");
          gl.vertexAttribPointer(
            colors,
            4,
            gl.FLOAT,
            false,
            stride * Float32Array.BYTES_PER_ELEMENT,
            /* offset */ 2 * Float32Array.BYTES_PER_ELEMENT
          );
          gl.enableVertexAttribArray(colors);

          const [canvasWidth, canvasHeight] = getSize();
          if (canvasWidth !== cWidth || canvasHeight !== cHeight) {
            const landscape =
              img.width / canvasWidth > img.height / canvasHeight;

            scale = landscape
              ? canvasWidth / img.width
              : canvasHeight / img.height;

            gl.uniform2f(
              gl.getUniformLocation(shaderProgram, "viewport"),
              canvasWidth,
              canvasHeight
            );

            basePosition = [
              canvasWidth / 2 / scale,
              canvasHeight / 2 / scale,
              0.1,
            ];

            cWidth = canvasWidth;
            cHeight = canvasHeight;
          }

          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "scale"),
            scale,
            zoom,
            pan[0],
            pan[1]
          );

          gl.uniform3f(
            uBasePosition,
            basePosition[0],
            basePosition[1],
            basePosition[2]
          );

          vectors.forEach((vector) => {
            if (vectorsSelected.includes(vector.id)) {
              gl.uniform3f(translate, vector.x, vector.y, vector.z);
              gl.uniform1f(mutation, vector.mutator);
              gl.drawElements(
                gl.TRIANGLES,
                vector.amount,
                gl.UNSIGNED_SHORT,
                vector.start * 2
              );
            }
          });
        },
        cleanup() {
          const gl = initGl;
          gl.deleteBuffer(vertexBuffer);
          gl.deleteBuffer(indexBuffer);
          programCleanup();
        },
      };
    },
  };
};
