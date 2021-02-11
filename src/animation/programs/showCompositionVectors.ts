import {
  ItemSelection,
  Keyframe,
  MutationVector,
  ShapeDefinition,
  Vec2,
} from "../../lib/types";
import { createProgram, WebGLRenderer } from "../../lib/webgl";
import { flattenTree } from "./utils";

const compositionVertexShader = `
  attribute vec3 coordinates;
  attribute vec4 color;
  varying mediump vec4 vColor;
  uniform vec2 viewport;
  uniform vec3 translate;
  uniform vec4 scale;

  uniform vec3 uDeformPositions[16];
  uniform vec2 uDeformValues[16];
  uniform vec4 moveAndSqueeze;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  void main() {
    vec2 deform = coordinates.xy;

    for(int i = 0; i < 16; i++) {
      vec3 position = uDeformPositions[i];
      if (position.z > 0.0) {
        float effect = 1.0 - clamp(distance(coordinates.xy, position.xy), 0.0, position.z) / position.z;

        deform = deform + uDeformValues[i] * effect;
      }
    }

    vec4 pos = viewportScale * vec4((deform * moveAndSqueeze.ba + moveAndSqueeze.xy + translate.xy) * scale.x, translate.z, 1.0);
    gl_Position = vec4((pos.xy + scale.ba) * scale.y, pos.z - 1.0, 1.0);
    if (color.a == 1.0) {
      gl_PointSize = coordinates.z * scale.x;
    } else {
      gl_PointSize = coordinates.z * scale.x * scale.y;
    }
    vColor = color;
  }
`;

const compositionFragmentShader = `
  precision mediump float;
  varying mediump vec4 vColor;

  void main(void) {
    lowp vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
		lowp float distSquared = dot(pos, pos);

		if (distSquared < 0.15) {
      gl_FragColor = vec4(vColor.rgb * vColor.a, vColor.a);
    } else {
      if (distSquared < 0.25) {
        gl_FragColor = vec4(vColor.rgb * vColor.a * 0.5, vColor.a);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
		}

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
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setLayerSelected(layer: null | ItemSelection): void;
  setKeyframe(frame: Keyframe | null): void;
  renderer: WebGLRenderer;
} => {
  const stride = 7;

  let shapes: ShapeDefinition[] | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let vectorsSelected: string[] = [];
  let keyframe: Keyframe | null = null;

  let vectors: {
    name: string;
    boundToLayer: string;
    origin: Vec2;
    start: number;
    amount: number;
  }[] = [];
  let zoom = 1.0;
  let pan = [0, 0];

  const populateShapes = () => {
    if (!shapes || !gl || !indexBuffer || !vertexBuffer) return;
    const vertices: number[] = [];
    vectors = [];
    const items = flattenTree(shapes);

    items.forEach((shape) => {
      if (!shape.mutationVectors) {
        return;
      }
      shape.mutationVectors.forEach((vector) => {
        vectors.push({
          name: vector.name,
          boundToLayer: shape.name,
          origin: vector.origin,
          start: vertices.length / stride,
          amount: vector.type === "deform" ? 2 : 1,
        });
        const color = colorMapping[vector.type];
        vertices.push(...vector.origin, 8, ...color, 1);
        if (vector.type === "deform") {
          vertices.push(...vector.origin, vector.radius, ...color, 0.2);
        }
      });
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
        vectorsSelected = [];
        return;
      }

      const checkMatch = (shape: ShapeDefinition, item: ItemSelection) =>
        (shape.name === item.name && item.type === "layer") ||
        (item.type === "vector" &&
          shape.type === "sprite" &&
          shape.mutationVectors &&
          shape.mutationVectors.map((v) => v.name).includes(item.name));

      const vectorNamesFromShape = (shape: ShapeDefinition): string[] =>
        shape.mutationVectors ? shape.mutationVectors.map((e) => e.name) : [];

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
                    (n) => layer.type === "vector" && n === layer.name
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
    setKeyframe(frame) {
      keyframe = frame;
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
            3,
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
            /* offset */ 3 * Float32Array.BYTES_PER_ELEMENT
          );
          gl.enableVertexAttribArray(colors);

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

          const calculatedElements = vectors.map((element, index) => {
            return {
              ...element,
              x: basePosition[0],
              y: basePosition[1],
              z: index * 0.0001,
            };
          });

          calculatedElements.sort((a, b) => (b.z || 0) - (a.z || 0));

          const translate = gl.getUniformLocation(shaderProgram, "translate");
          // const deformation = gl.getUniformLocation(
          //   shaderProgram,
          //   "uDeformPositions"
          // );
          const deformationValues = gl.getUniformLocation(
            shaderProgram,
            "uDeformValues"
          );
          const moveAndSqueeze = gl.getUniformLocation(
            shaderProgram,
            "moveAndSqueeze"
          );

          calculatedElements.forEach((element) => {
            if (vectorsSelected.includes(element.name)) {
              gl.uniform3f(translate, element.x, element.y, element.z);

              const elementData = keyframe && keyframe[element.boundToLayer];
              const deformValues: number[] = Array(16 * 2).fill(0);
              const moveSquezeValues: number[] = [0, 0, 1, 1];

              if (elementData) {
                if (elementData.translate) {
                  moveSquezeValues[0] = elementData.translate[0];
                }
                if (elementData.translate) {
                  moveSquezeValues[1] = elementData.translate[1];
                }
              }

              gl.uniform4f(
                moveAndSqueeze,
                moveSquezeValues[0],
                moveSquezeValues[1],
                moveSquezeValues[2],
                moveSquezeValues[3]
              );
              // gl.uniform3fv(
              //   deformation,
              //   element.deformationVectorList
              //     .concat(Array(16 * 3).fill(0))
              //     .slice(0, 16 * 3)
              // );
              gl.uniform2fv(deformationValues, deformValues);

              gl.drawArrays(initgl.POINTS, element.start, element.amount);
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
