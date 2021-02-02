import Delaunator from "delaunator";
import { Keyframe, ShapeDefinition, Vec3 } from "../../lib/types";
import { createProgram, WebGLRenderer } from "../../lib/webgl";
import { flattenShapes, getAnchor } from "./utils";

const compositionVertexShader = `
  attribute vec2 coordinates;
  attribute vec2 aTextureCoord;
  varying lowp vec2 vTextureCoord;
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
    vec2 deform = coordinates;

    for(int i = 0; i < 16; i++) {
      vec3 position = uDeformPositions[i];
      if (position.z > 0.0) {
        float effect = 1.0 - clamp(distance(coordinates, position.xy), 0.0, position.z) / position.z;

        deform = deform + uDeformValues[i] * effect;
      }
    }
    vec4 pos = viewportScale * vec4((deform * moveAndSqueeze.ba + moveAndSqueeze.xy + translate.xy) * scale.x, translate.z, 1.0);
    gl_Position = vec4((pos.xy + scale.ba) * scale.y, pos.z, 1.0);
    vTextureCoord = aTextureCoord.xy;
  }
`;

const compositionFragmentShader = `
  precision mediump float;

  varying mediump vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  void main(void) {
    highp vec2 coord = vTextureCoord.xy / uTextureDimensions;
    mediump vec4 texelColor = texture2D(uSampler, coord);

    gl_FragColor = texelColor * texelColor.w;
  }
`;

type MutationVector = {
  index: number;
  vector: Vec3;
};

export const showComposition = (): {
  setImage(image: HTMLImageElement): void;
  setShapes(s: ShapeDefinition[]): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setKeyframe(frame: Keyframe | null): void;
  renderer: WebGLRenderer;
} => {
  const stride = 4;

  let shapes: ShapeDefinition[] | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let texture: WebGLTexture | null = null;
  let keyframe: Keyframe | null = null;
  let program: WebGLProgram | null = null;

  let elements: {
    start: number;
    amount: number;
    deformationVectors: Record<string, MutationVector>;
  }[] = [];
  let zoom = 1.0;
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
    if (!shapes || !gl || !indexBuffer || !vertexBuffer) return;
    elements = [];

    const indices: number[] = [];
    const vertices: number[] = [];
    elements = [];
    const sprites = flattenShapes(shapes);

    sprites.forEach((shape) => {
      const shapeIndices = Delaunator.from(shape.points).triangles;
      const start = indices.length;
      const anchor = getAnchor(shape);

      const deformationVectors = Object.entries(
        shape.mutationVectors || {}
      ).reduce(
        (result, [key, value], index) => ({
          ...result,
          [key]: { vector: value, index },
        }),
        {} as Record<string, MutationVector>
      );

      elements.push({
        start,
        amount: shapeIndices.length,
        deformationVectors,
      });
      const offset = vertices.length / stride;
      shape.points.forEach(([x, y]) => {
        vertices.push(x - anchor[0], y - anchor[1], x, y);
      });

      shapeIndices.forEach((index) => {
        indices.push(index + offset);
      });
    });

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
      setImageTexture();
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
    setKeyframe(frame) {
      keyframe = frame;
    },
    renderer(initgl: WebGLRenderingContext, { getUnit, getSize }) {
      gl = initgl;

      const unit = getUnit();
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

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
          gl.uniform2f(
            gl.getUniformLocation(shaderProgram, "uTextureDimensions"),
            img.width,
            img.height
          );

          gl.activeTexture(unit.unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);

          const basePosition = [
            canvasWidth / 2 / scale,
            canvasHeight / 2 / scale,
            0.1,
          ];
          const sprites = flattenShapes(shapes);

          const calculatedElements = elements.map((element, index) => {
            const sprite = sprites[index];
            const itemOffset = [
              sprite.baseElementData.translateX || 0,
              sprite.baseElementData.translateY || 0,
            ];

            const deformationVectorList = Object.values(
              element.deformationVectors
            ).reduce((list, item) => list.concat(item.vector), [] as number[]);

            return {
              name: sprite.name,
              ...element,
              x: basePosition[0] + itemOffset[0],
              y: basePosition[1] + itemOffset[1],
              z: sprites.indexOf(sprite) * 0.01,
              deformationVectorList,
            };
          });

          calculatedElements.sort((a, b) => (b.z || 0) - (a.z || 0));

          const translate = gl.getUniformLocation(shaderProgram, "translate");
          const deformation = gl.getUniformLocation(
            shaderProgram,
            "uDeformPositions"
          );
          const deformationValues = gl.getUniformLocation(
            shaderProgram,
            "uDeformValues"
          );
          const moveAndSqueeze = gl.getUniformLocation(
            shaderProgram,
            "moveAndSqueeze"
          );

          calculatedElements.forEach((element) => {
            if (element.amount === 0) {
              return;
            }
            gl.uniform3f(translate, element.x, element.y, element.z);

            const elementData = keyframe && keyframe[element.name];
            const deformValues: number[] = Array(16 * 2).fill(0);
            const moveSquezeValues: number[] = [0, 0, 1, 1];
            if (elementData) {
              Object.entries(elementData.deformations || {}).forEach(
                ([key, value]) => {
                  const index = element.deformationVectors[key].index;

                  deformValues[index * 2] = value[0];
                  deformValues[index * 2 + 1] = value[1];
                }
              );
              if (elementData.stretchX) {
                moveSquezeValues[2] = elementData.stretchX;
              }
              if (elementData.stretchY) {
                moveSquezeValues[3] = elementData.stretchY;
              }
              if (elementData.translateX) {
                moveSquezeValues[0] = elementData.translateX;
              }
              if (elementData.translateY) {
                moveSquezeValues[1] = elementData.translateY;
              }
            }
            gl.uniform4f(
              moveAndSqueeze,
              moveSquezeValues[0],
              moveSquezeValues[1],
              moveSquezeValues[2],
              moveSquezeValues[3]
            );
            gl.uniform3fv(
              deformation,
              element.deformationVectorList
                .concat(Array(16 * 3).fill(0))
                .slice(0, 16 * 3)
            );
            gl.uniform2fv(deformationValues, deformValues);

            gl.drawElements(
              gl.TRIANGLES,
              element.amount,
              gl.UNSIGNED_SHORT,
              element.start * 2
            );
          });
        },
        cleanup() {
          const gl = initgl;
          gl.deleteTexture(texture);
          gl.deleteBuffer(vertexBuffer);
          gl.deleteBuffer(indexBuffer);
          programCleanup();
        },
      };
    },
  };
};
