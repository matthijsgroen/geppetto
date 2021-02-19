import { isMutationVector, isShapeDefintion, visitShapes } from "src/lib/visit";
import { ItemSelection, ShapeDefinition, Vec2 } from "../../lib/types";
import { verticesFromPoints } from "../../lib/vertices";
import { createProgram, WebGLRenderer } from "../../lib/webgl";
import { flattenShapes, getAnchor } from "./utils";

const MAX_MUTATION_VECTORS = 20;
const MAX_TREE_SIZE = 128;

const vectorTypeMapping = {
  translate: 1,
  stretch: 2,
  rotate: 3,
  deform: 4,
};

const compositionVertexShader = `
  uniform vec2 viewport;
  uniform vec3 translate;
  uniform vec4 scale;
  uniform float mutation; 

  // x = type, yz = origin, a = radius
  uniform vec4 uMutationVectors[${MAX_MUTATION_VECTORS}];
  uniform vec2 uMutationValues[${MAX_MUTATION_VECTORS}];
  uniform float uMutationTree[${MAX_TREE_SIZE}];

  attribute vec2 coordinates;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  vec2 mutatePoint(vec2 startValue, int treeIndex) {
    if (treeIndex == 0) {
      return startValue;
    }
    int mutationIndex = int(uMutationTree[treeIndex]);
    if (mutationIndex == 0) {
      // TODO, iterate higher into tree until treeIndex == 0
      return startValue;
    }
    vec4 mutation = uMutationVectors[mutationIndex - 1];
    vec2 mutationValue = uMutationValues[mutationIndex - 1];
    int mutationType = int(mutation.x);

    if (mutationType == 1) { // Translate
      return startValue + mutationValue;
    }

    return startValue;
  }


  void main() {
    vec2 deform = mutatePoint(coordinates, int(mutation));

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
  setVectorValues(v: Record<string, Vec2>): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setLayerSelected(layer: null | ItemSelection): void;
  renderer: WebGLRenderer;
} => {
  const stride = 2;

  let shapes: ShapeDefinition[] | null = null;

  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let layersSelected: string[] = [];
  let vectorValues: Record<string, Vec2> = {};

  let elements: {
    name: string;
    start: number;
    amount: number;
    mutator: number;
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
    elements = [];
    mutators = [];

    gl.useProgram(program);

    const uMutationVectors = gl.getUniformLocation(program, "uMutationVectors");
    const vectorSettings: number[] = Array(MAX_MUTATION_VECTORS * 4).fill(0);

    const treeInfo: { mutator: number; shape: ShapeDefinition }[][] = [];

    visitShapes(shapes, (item, parents) => {
      if (isMutationVector(item)) {
        const index = mutators.length;
        mutators.push(item.name);
        vectorSettings[index * 4] = vectorTypeMapping[item.type];
        vectorSettings[index * 4 + 1] = item.origin[0];
        vectorSettings[index * 4 + 2] = item.origin[1];
        if (item.type === "deform") {
          vectorSettings[index * 4 + 3] = item.radius;
        }

        const existingBranch = treeInfo.find((branch) =>
          branch.find((node) => parents.includes(node.shape))
        );
        if (existingBranch) {
          existingBranch.push({
            mutator: index + 1,
            shape: parents
              .reverse()
              .find((e) => isShapeDefintion(e)) as ShapeDefinition,
          });
        } else {
          treeInfo.push([
            {
              mutator: index + 1,
              shape: parents
                .reverse()
                .find((e) => isShapeDefintion(e)) as ShapeDefinition,
            },
          ]);
        }
      }
      return undefined;
    });

    let level = 1;
    while (Math.pow(2, level) < treeInfo.length) {
      level++;
    }

    // const parentOf = (node: number): number => Math.floor(node / 2.0);
    const childrenOf = (node: number): [number, number] => [
      node * 2,
      node * 2 + 1,
    ];

    const treeData = new Float32Array(MAX_TREE_SIZE).fill(0);
    const startElement = Math.pow(2, level);

    if (mutators.length >= MAX_MUTATION_VECTORS) {
      throw new Error("More vectors than shader permits");
    }

    gl.uniform4fv(uMutationVectors, vectorSettings);
    console.log("uMutationVectors", vectorSettings);

    const sprites = flattenShapes(shapes);

    sprites.forEach((shape, index) => {
      const anchor = getAnchor(shape);
      const itemOffset = [...shape.translate, index * 0.1];
      const points = shape.points.map(([x, y]) => [
        x - anchor[0],
        y - anchor[1],
      ]);
      const list = verticesFromPoints(points);

      elements.push({
        name: shape.name,
        start: vertices.length / stride,
        amount: list.length / 2,
        mutator: 0,
        x: itemOffset[0],
        y: itemOffset[1],
        z: -itemOffset[2] * 0.001,
      });
      vertices.push(...list);
    });

    treeInfo.forEach((vectors, index) => {
      let nodeIndex = startElement + index;
      vectors.forEach((item, branchIndex) => {
        if (branchIndex > 0) {
          nodeIndex = childrenOf(nodeIndex)[0];
        }
        treeData[nodeIndex] = item.mutator;
        elements.forEach((e) => {
          if (
            (e.name === item.shape.name ||
              (item.shape.type === "folder" &&
                item.shape.items.find(
                  (c) => c.type === "sprite" && c.name === e.name
                ))) &&
            e.mutator < nodeIndex
          ) {
            e.mutator = nodeIndex;
          }
        });
      });
    });

    elements.sort((a, b) => (b.z || 0) - (a.z || 0));
    console.log(treeData);
    console.log(elements);

    // // -- DEBUG PRINT
    // elements.forEach((e) => {
    //   const mutatorNames = [];
    //   let treeNode = e.mutator;
    //   while (treeNode > 0) {
    //     const index = treeData[treeNode];
    //     if (index > 0) mutatorNames.push(mutators[index - 1]);
    //     treeNode = parentOf(treeNode);
    //   }

    //   console.log("Element: ", e.name, "Mutators", mutatorNames);
    // });
    // -- END DEBUG PRINT

    const uMutationTree = gl.getUniformLocation(program, "uMutationTree");
    gl.uniform1fv(uMutationTree, treeData);
    console.log("uMutationTree", treeData);
    console.log("elements", elements);

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

  let cWidth = 0;
  let cHeight = 0;
  let basePosition = [0, 0, 0.1];

  return {
    setImage(image) {
      img = image;
    },
    setShapes(s) {
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
    setPan(x, y) {
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
          const mutation = gl.getUniformLocation(shaderProgram, "mutation");

          elements.forEach((element) => {
            // if (layersSelected.includes(element.name) && element.amount > 0) {
            if (element.amount > 0) {
              gl.uniform3f(
                translate,
                basePosition[0] + element.x,
                basePosition[1] + element.y,
                basePosition[2] + element.z
              );
              gl.uniform1f(mutation, element.mutator);
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
