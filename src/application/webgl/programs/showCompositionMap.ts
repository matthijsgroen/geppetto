import raw from "raw.macro";
import { collectChildIds, visit } from "../../../animation/file2/hierarchy";
import { GeppettoImage, Keyframe } from "../../../animation/file2/types";
import { flatten, verticesFromPoints } from "../lib/vertices";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import {
  createShapeMutationList,
  getAnchor,
  MAX_MUTATION_VECTORS,
} from "./utils";

const compositionVertexShader = raw("./showCompositionMap.vert");
const compositionFragmentShader = raw("./showCompositionMap.frag");

export const showCompositionMap = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: GeppettoImage): void;
  setVectorValues(v: Keyframe): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setLayerSelected(layers: string[]): void;
  renderer: WebGLRenderer;
} => {
  const stride = 2;

  let shapes: GeppettoImage | null = null;

  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let layersSelected: string[] = [];
  let vectorValues: Keyframe = {};

  let elements: {
    id: string;
    start: number;
    amount: number;
    mutator: number;
    x: number;
    y: number;
    z: number;
  }[] = [];
  let mutMapping: Record<string, number> = {};
  let zoom = 1.0;
  let pan = [0, 0];
  let scale = 1.0;

  const populateShapes = () => {
    if (!shapes || !gl || !vertexBuffer || !program) return;
    const vertices: number[] = [];
    elements = [];
    mutMapping = {};

    gl.useProgram(program);

    const image = shapes;
    let index = 0;
    visit(image.layerHierarchy, (node, nodeId) => {
      if (node.type !== "layer") {
        return;
      }
      const shape = image.layers[nodeId];
      const anchor = getAnchor(shape);
      const itemOffset = [...shape.translate, index * 0.1];
      index++;
      const points = shape.points.map(([x, y]) => [
        x - anchor[0],
        y - anchor[1],
      ]);
      const list = verticesFromPoints(points);

      elements.push({
        id: nodeId,
        start: vertices.length / stride,
        amount: list.length / 2,
        mutator: 0,
        x: itemOffset[0],
        y: itemOffset[1],
        z: itemOffset[2] * 0.001,
      });
      vertices.push(...list);
    });

    const { parentList, vectorSettings, mutatorMapping, shapeMutatorMapping } =
      createShapeMutationList(shapes);

    for (const element of elements) {
      element.mutator = shapeMutatorMapping[element.id];
    }

    mutMapping = mutatorMapping;

    elements.sort((a, b) => (b.z || 0) - (a.z || 0));

    const uMutationVectors = gl.getUniformLocation(program, "uMutationVectors");
    gl.uniform4fv(uMutationVectors, flatten(vectorSettings));

    const uMutationParent = gl.getUniformLocation(program, "uMutationParent");
    gl.uniform1iv(uMutationParent, parentList);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };

  let cWidth = 0;
  let cHeight = 0;
  let basePosition = [0, 0, 0.1];

  let onChange: () => void = () => {};

  return {
    setImage(image) {
      img = image;
      onChange();
    },
    setShapes(s) {
      shapes = s;
      populateShapes();
      onChange();
    },
    setVectorValues(v) {
      vectorValues = v;
      if (Object.keys(mutMapping).length === 0 || !program || !gl) return;
      gl.useProgram(program);

      const uMutationValues = gl.getUniformLocation(program, "uMutationValues");
      const mutationValues = new Float32Array(MAX_MUTATION_VECTORS * 2).fill(0);
      for (const [key, value] of Object.entries(vectorValues)) {
        const index = mutMapping[key];
        if (index === -1) return;
        mutationValues[index * 2] = value[0];
        mutationValues[index * 2 + 1] = value[1];
      }
      gl.uniform2fv(uMutationValues, mutationValues);
      onChange();
    },
    setZoom(newZoom) {
      zoom = newZoom;
      onChange();
    },
    setPan(x, y) {
      pan = [x, y];
      onChange();
    },
    setLayerSelected(layers) {
      if (layers.length === 0 || shapes === null) {
        layersSelected = [];
        return;
      }
      layersSelected = [];
      for (const layerId of layers) {
        const treeNode = shapes.layerHierarchy[layerId];
        if (treeNode.type === "mutation") {
          layersSelected.push(treeNode.parentId);
          continue;
        }
        layersSelected.push(layerId);
        layersSelected.push(...collectChildIds(shapes.layerHierarchy, layerId));
      }
      onChange();
    },
    renderer(initGl: WebGLRenderingContext, { getSize }) {
      gl = initGl;

      vertexBuffer = gl.createBuffer();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        compositionVertexShader,
        compositionFragmentShader
      );
      program = shaderProgram;
      populateShapes();

      return {
        onChange(listener) {
          onChange = listener;
        },
        render() {
          if (!img || !shapes || !gl) {
            return;
          }
          gl.useProgram(shaderProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

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

          const translate = gl.getUniformLocation(shaderProgram, "translate");
          const uBasePosition = gl.getUniformLocation(
            shaderProgram,
            "basePosition"
          );
          gl.uniform3f(
            uBasePosition,
            basePosition[0],
            basePosition[1],
            basePosition[2]
          );
          const mutation = gl.getUniformLocation(shaderProgram, "mutation");

          for (const element of elements) {
            if (layersSelected.includes(element.id) && element.amount > 0) {
              // if (element.amount > 0) {
              gl.uniform3f(translate, element.x, element.y, element.z);
              gl.uniform1f(mutation, element.mutator);

              for (let i = 0; i < element.amount; i += 3) {
                gl.drawArrays(initGl.LINE_LOOP, element.start + i, 3);
              }
            }
          }
        },
        cleanup() {
          if (gl) {
            gl.deleteBuffer(vertexBuffer);
            gl = null;
          }
          programCleanup();
        },
      };
    },
  };
};
