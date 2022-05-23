import { TranslationVector } from "geppetto-player";
import raw from "raw.macro";
import { collectChildIds, visit } from "../../../animation/file2/hierarchy";
import { isShapeMutationVector } from "../../../animation/file2/mutation";
import {
  GeppettoImage,
  MutationVector,
  Keyframe,
  DeformationVector,
} from "../../../animation/file2/types";
import { flatten } from "../lib/vertices";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import { createShapeMutationList, MAX_MUTATION_VECTORS } from "./utils";
import { colorScheme } from "../../theme/darkMode";
import { ScreenTranslation } from "../../types";

const compositionVertexShader = raw("./showCompositionVectors.vert");
const compositionFragmentShader = raw("./showCompositionVectors.frag");

type Color = [number, number, number];

const orange = [238, 115, 0].map((v) => v / 256.0) as Color;
const red = [230, 0, 0].map((v) => v / 256.0) as Color;
const purple = [187, 0, 255].map((v) => v / 256.0) as Color;
const green = [0, 180, 0].map((v) => v / 256.0) as Color;
const white = [240, 240, 240].map((v) => v / 256.0) as Color;

const EPSILON = 0.00001;
const MUTATION_DOT_SIZE = 3;

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

export const showCompositionVectors = (
  trans: ScreenTranslation
): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: GeppettoImage): void;
  setVectorValues(v: Keyframe): void;
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
  const screenTranslation = trans;
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
      if (node.type === "layerFolder") {
        const folder = file.layerFolders[nodeId];
        if (!folder.visible) {
          return "SKIP";
        }
      }
      if (node.type === "layer") {
        const shape = file.layers[nodeId];
        if (!shape.visible) return "SKIP";
      }
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
      vertices.push(0, -MUTATION_DOT_SIZE, ...color, 1);
      vertices.push(1, -MUTATION_DOT_SIZE, ...color, 1);
      vertices.push(2, -MUTATION_DOT_SIZE, ...color, 1);
      vertices.push(3, -MUTATION_DOT_SIZE, ...color, 1);

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

  const populateVectorValues = () => {
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
      populateVectorValues();
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

      const programInfo = {
        uniforms: {
          translate: gl.getUniformLocation(shaderProgram, "translate"),
          mutation: gl.getUniformLocation(shaderProgram, "mutation"),
          basePosition: gl.getUniformLocation(shaderProgram, "basePosition"),
          viewport: gl.getUniformLocation(shaderProgram, "viewport"),
          scale: gl.getUniformLocation(shaderProgram, "scale"),
          active: gl.getUniformLocation(shaderProgram, "active"),
        },
        attributes: {
          coordinates: gl.getAttribLocation(shaderProgram, "coordinates"),
          colors: gl.getAttribLocation(shaderProgram, "color"),
        },
      };

      populateShapes();
      populateVectorValues();

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

          gl.vertexAttribPointer(
            programInfo.attributes.coordinates,
            2,
            gl.FLOAT,
            false,
            stride * Float32Array.BYTES_PER_ELEMENT,
            /* offset */ 0
          );
          gl.enableVertexAttribArray(programInfo.attributes.coordinates);

          gl.vertexAttribPointer(
            programInfo.attributes.colors,
            4,
            gl.FLOAT,
            false,
            stride * Float32Array.BYTES_PER_ELEMENT,
            /* offset */ 2 * Float32Array.BYTES_PER_ELEMENT
          );
          gl.enableVertexAttribArray(programInfo.attributes.colors);

          const [canvasWidth, canvasHeight] = getSize();
          if (canvasWidth !== cWidth || canvasHeight !== cHeight) {
            const landscape =
              img.width / canvasWidth > img.height / canvasHeight;

            scale = landscape
              ? canvasWidth / img.width
              : canvasHeight / img.height;

            gl.uniform2f(
              programInfo.uniforms.viewport,
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
            programInfo.uniforms.scale,
            scale,
            screenTranslation.zoom,
            screenTranslation.panX,
            screenTranslation.panY
          );

          gl.uniform3f(
            programInfo.uniforms.basePosition,
            basePosition[0],
            basePosition[1],
            basePosition[2]
          );
          gl.uniform1f(
            programInfo.uniforms.active,
            vectorsSelected.length === 1
              ? colorScheme.darkMode
                ? 2.0
                : 1.0
              : 0.0
          );

          vectors.forEach((vector) => {
            if (vectorsSelected.includes(vector.id)) {
              gl.uniform3f(
                programInfo.uniforms.translate,
                vector.x,
                vector.y,
                vector.z
              );
              gl.uniform1f(programInfo.uniforms.mutation, vector.mutator);
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
