import { vectorNamesFromShape } from "src/lib/definitionHelpers";
import { isShapeDefinition, visitShapes } from "src/lib/visit";
import {
  ItemSelection,
  Keyframe,
  MutationVector,
  ShapeDefinition,
} from "../../lib/types";
import { createProgram, WebGLRenderer } from "../../lib/webgl";
import {
  assignMutatorToVectors,
  createMutationTree,
  MAX_MUTATION_VECTORS,
  mutationShader,
} from "./mutatePoint";

const compositionVertexShader = `
  varying mediump vec4 vColor;
  varying mediump vec3 vCircle;
  varying mediump vec2 vViewport;

  uniform vec2 viewport;
  uniform vec3 translate;
  uniform vec3 basePosition;
  uniform vec4 scale;

  attribute vec2 coordinates;
  attribute vec4 color;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  ${mutationShader}

  void main() {
    vec2 deform = mutatePoint(translate.xy, int(mutation));

    vec4 pos = viewportScale * vec4((deform.xy + basePosition.xy) * scale.x, translate.z, 1.0);

    int pointIndex = int(coordinates.x);
    float radius = abs(coordinates.y);

    // if (pointIndex == 0) {
    vec4 spec = vec4(vec2(-1.0, -1.0) * radius, 1.0, 1.0) * viewportScale;
    // }

    if (pointIndex == 1) {
      spec = vec4(vec2(1.0, -1.0) * radius, 1.0, 1.0) * viewportScale;
    }

    if (pointIndex == 2) {
      spec = vec4(vec2(-1.0, 1.0) * radius, 1.0, 1.0) * viewportScale;
    }

    if (pointIndex == 3) {
      spec = vec4(vec2(1.0, 1.0) * radius, 1.0, 1.0) * viewportScale;
    }

    vec2 size = spec.xy;
    if (coordinates.y > 0.0) {
      size *= scale.y;
    }

    vec2 center = (pos.xy + scale.ba) * scale.y;

    gl_Position = vec4(center + size, pos.z - 1.0, 1.0);

    vCircle = vec3(center, min(abs(size.y), abs(size.x)));

    vColor = color;
    vViewport = viewport;
  }
`;

const compositionFragmentShader = `
  precision mediump float;
  varying mediump vec4 vColor;
  varying mediump vec3 vCircle;
  varying mediump vec2 vViewport;

  void main(void) {
    vec2 screenPos = ((gl_FragCoord.xy / (vViewport / 2.0)) - 1.0);
    float dist = distance(vCircle.xy, screenPos);

    if (dist > vCircle.z) discard;

    gl_FragColor = vec4(vColor.rgb * vColor.a, vColor.a);
  }
`;

type Color = [number, number, number];

const orange = [238, 115, 0].map((v) => v / 256.0) as Color;
const red = [230, 0, 0].map((v) => v / 256.0) as Color;
const purple = [187, 0, 255].map((v) => v / 256.0) as Color;
const green = [0, 180, 0].map((v) => v / 256.0) as Color;

type VectorTypes = MutationVector["type"];

const colorMapping: Record<VectorTypes, Color> = {
  deform: orange,
  rotate: red,
  stretch: purple,
  translate: green,
};

export const showCompositionVectors = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: ShapeDefinition[]): void;
  setVectorValues(v: Keyframe): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setLayerSelected(layer: null | ItemSelection): void;
  renderer: WebGLRenderer;
} => {
  const stride = 6;

  let shapes: ShapeDefinition[] | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let program: WebGLProgram | null = null;
  let vectorsSelected: string[] = [];
  let vectorValues: Keyframe = {};

  let vectors: {
    name: string;
    start: number;
    amount: number;
    mutator: number;
    boundToLayer: string;
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
    visitShapes(shapes, (shape) => {
      if (!isShapeDefinition(shape)) {
        return undefined;
      }

      shape.mutationVectors.forEach((vector, i) => {
        const start = indices.length;
        vectors.push({
          name: vector.name,
          mutator: 0,
          boundToLayer: shape.name,
          x: vector.origin[0],
          y: vector.origin[1],
          z: 0.00001 * i,
          start,
          amount: 6,
        });
        const offset = vertices.length / stride;
        const color = colorMapping[vector.type];
        vertices.push(0, -10, ...color, 1);
        vertices.push(1, -10, ...color, 1);
        vertices.push(2, -10, ...color, 1);
        vertices.push(3, -10, ...color, 1);

        indices.push(
          offset,
          offset + 1,
          offset + 2,
          offset + 1,
          offset + 2,
          offset + 3
        );

        if (vector.type === "deform") {
          const start = indices.length;
          vectors.push({
            name: vector.name,
            mutator: 0,
            boundToLayer: shape.name,
            x: vector.origin[0],
            y: vector.origin[1],
            z: 0.2 + 0.00001 * i,
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
      return undefined;
    });

    const [
      newMutators,
      vectorSettings,
      treeData,
      shapeVectorInfo,
    ] = createMutationTree(shapes);
    assignMutatorToVectors(shapes, vectors, treeData, shapeVectorInfo);
    mutators = newMutators;

    const uMutationVectors = gl.getUniformLocation(program, "uMutationVectors");
    gl.uniform4fv(uMutationVectors, vectorSettings);

    const uMutationTree = gl.getUniformLocation(program, "uMutationTree");
    gl.uniform1fv(uMutationTree, treeData);

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

  return {
    setImage(image: HTMLImageElement) {
      img = image;
    },
    setShapes(s: ShapeDefinition[]) {
      shapes = s;
      populateShapes();
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
    },
    setZoom(newZoom) {
      zoom = newZoom;
    },
    setPan(x: number, y: number) {
      pan = [x, y];
    },
    setLayerSelected(layer) {
      if (layer === null || shapes === null) {
        vectorsSelected = [];
        return;
      }

      const checkMatch = (shape: ShapeDefinition, item: ItemSelection) =>
        (shape.name === item.name && item.type === "layer") ||
        (item.type === "vector" &&
          (shape.type === "sprite" || shape.type === "folder") &&
          shape.mutationVectors &&
          shape.mutationVectors.map((v) => v.name).includes(item.name));

      const collectVectorNames = (
        s: ShapeDefinition[],
        collect = false
      ): string[] =>
        s.reduce(
          (result, shape) =>
            shape.type === "sprite"
              ? collect || checkMatch(shape, layer)
                ? result.concat(vectorNamesFromShape(shape))
                : result.concat(
                    vectorNamesFromShape(shape).filter(
                      (n) => layer.type === "vector" && n === layer.name
                    )
                  )
              : result.concat(
                  vectorNamesFromShape(shape).filter(
                    (n) =>
                      (layer.type === "vector" && n === layer.name) ||
                      collect ||
                      checkMatch(shape, layer)
                  ),
                  collectVectorNames(
                    shape.items,
                    collect || checkMatch(shape, layer)
                  )
                ),
          [] as string[]
        );

      vectorsSelected = collectVectorNames(shapes);
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
      program = shaderProgram;

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

          vectors.forEach((element) => {
            if (vectorsSelected.includes(element.name)) {
              gl.uniform3f(translate, element.x, element.y, element.z);
              gl.uniform1f(mutation, element.mutator);
              gl.drawElements(
                gl.TRIANGLES,
                element.amount,
                gl.UNSIGNED_SHORT,
                element.start * 2
              );
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
