// import {
//   createShapeMutationList,
//   MAX_MUTATION_VECTORS,
//   mutationShader,
//   mutationValueShader,
// } from "./mutatePoint";
import raw from "raw.macro";
import { visit } from "../../../animation/file2/hierarchy";
import { GeppettoImage, Keyframe } from "../../../animation/file2/types";
import { filteredTriangles, flatten } from "../lib/vertices";
import { createProgram, WebGLRenderer } from "../lib/webgl";
import {
  createShapeMutationList,
  getAnchor,
  MAX_MUTATION_VECTORS,
} from "./utils";

const compositionVertexShader = raw("./showComposition.vert");
const compositionFragmentShader = raw("./showComposition.frag");

export const showComposition = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: GeppettoImage): void;
  setVectorValues(v: Keyframe): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  renderer: WebGLRenderer;
} => {
  const stride = 4;

  let shapes: GeppettoImage | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let texture: WebGLTexture | null = null;
  let program: WebGLProgram | null = null;

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
  let mutators: string[] = [];
  let zoom = 1.0;
  let scale = 1.0;
  let pan = [0, 0];

  const setImageTexture = (): void => {
    if (img === null || texture === null || gl === null || program === null) {
      return;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.uniform2f(
      gl.getUniformLocation(program, "uTextureDimensions"),
      img.width,
      img.height
    );
  };

  const populateShapes = () => {
    if (!shapes || !gl || !indexBuffer || !vertexBuffer || !program) return;
    const vertices: number[] = [];
    const indices: number[] = [];
    elements = [];

    gl.useProgram(program);

    const image = shapes;
    let index = 0;

    visit(image.layerHierarchy, (node, nodeId) => {
      if (node.type !== "layer") {
        return;
      }
      const shape = image.layers[nodeId];
      const anchor = getAnchor(shape);
      const shapeIndices = filteredTriangles(shape.points);
      const start = indices.length;

      const itemOffset = [...shape.translate, index * 0.1];
      index++;

      elements.push({
        id: nodeId,
        start,
        amount: shapeIndices.length,
        mutator: 0,
        x: itemOffset[0],
        y: itemOffset[1],
        z: -0.5 + itemOffset[2] * 0.001,
      });
      const offset = vertices.length / stride;
      for (const [x, y] of shape.points) {
        vertices.push(x - anchor[0], y - anchor[1], x, y);
      }

      for (const index of shapeIndices) {
        indices.push(index + offset);
      }
    });

    const { parentList, vectorSettings, mutatorMapping, shapeMutatorMapping } =
      createShapeMutationList(shapes);

    for (const element of elements) {
      element.mutator = shapeMutatorMapping[element.id];
    }

    mutators = Object.keys(mutatorMapping);

    elements.sort((a, b) => (b.z || 0) - (a.z || 0));

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

  return {
    setImage(image: HTMLImageElement) {
      img = image;
      setImageTexture();
    },
    setShapes(s: GeppettoImage) {
      shapes = s;
      populateShapes();
    },
    setVectorValues(v) {
      vectorValues = v;
      populateVectorValues();
    },
    setZoom(newZoom) {
      zoom = newZoom;
    },
    setPan(x: number, y: number) {
      pan = [x, y];
    },
    renderer(initGl: WebGLRenderingContext, { getUnit, getSize }) {
      gl = initGl;

      const unit = getUnit();
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      vertexBuffer = gl.createBuffer();
      indexBuffer = gl.createBuffer();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        compositionVertexShader,
        compositionFragmentShader
      );
      program = shaderProgram;

      gl.useProgram(shaderProgram);
      gl.uniform1i(
        gl.getUniformLocation(shaderProgram, "uSampler"),
        unit.index
      );
      setImageTexture();
      populateShapes();
      populateVectorValues();
      const translate = gl.getUniformLocation(shaderProgram, "translate");
      const mutation = gl.getUniformLocation(shaderProgram, "mutation");

      const uBasePosition = gl.getUniformLocation(
        shaderProgram,
        "basePosition"
      );

      return {
        render() {
          if (!img || !shapes || !gl) {
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
            Float32Array.BYTES_PER_ELEMENT * stride,
            /* offset */ 0
          );
          gl.enableVertexAttribArray(coord);
          const texCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
          gl.vertexAttribPointer(
            texCoord,
            2,
            gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * stride,
            /* offset */ 2 * Float32Array.BYTES_PER_ELEMENT
          );
          gl.enableVertexAttribArray(texCoord);

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

            gl.uniform2f(
              gl.getUniformLocation(shaderProgram, "uTextureDimensions"),
              img.width,
              img.height
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

          gl.activeTexture(unit.unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);

          gl.uniform3f(
            uBasePosition,
            basePosition[0],
            basePosition[1],
            basePosition[2]
          );

          for (const element of elements) {
            if (element.amount === 0) {
              return;
            }
            gl.uniform3f(translate, element.x, element.y, element.z);
            gl.uniform1f(mutation, element.mutator);

            gl.drawElements(
              gl.TRIANGLES,
              element.amount,
              gl.UNSIGNED_SHORT,
              element.start * 2
            );
          }
        },
        cleanup() {
          const gl = initGl;
          gl.deleteTexture(texture);
          gl.deleteBuffer(vertexBuffer);
          gl.deleteBuffer(indexBuffer);
          programCleanup();
        },
      };
    },
  };
};
