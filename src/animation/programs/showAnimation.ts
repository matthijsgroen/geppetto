import Delaunator from "delaunator";
import {
  ControlDefinition,
  ControlValues,
  ImageDefinition,
  Vec2,
} from "../../lib/types";
import { createProgram, WebGLRenderer } from "../../lib/webgl";
import {
  assignMutatorToElements,
  createMutationTree,
  MAX_CONTROLS,
  MAX_MUTATION_VECTORS,
  mutationControlShader,
  mutationShader,
} from "./mutatePoint";
import { flattenShapes, getAnchor } from "./utils";

const animationVertexShader = `
  uniform vec2 viewport;
  uniform vec3 basePosition;
  uniform vec3 translate;
  uniform vec4 scale;

  attribute vec2 coordinates;
  attribute vec2 aTextureCoord;

  varying lowp vec2 vTextureCoord;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  ${mutationControlShader}
  ${mutationShader}

  void main() {
    vec2 deform = mutatePoint(coordinates + translate.xy, int(mutation));

    vec4 pos = viewportScale * vec4((deform + basePosition.xy) * scale.x, translate.z, 1.0);
    gl_Position = vec4((pos.xy + scale.ba) * scale.y, pos.z, 1.0);
    vTextureCoord = aTextureCoord.xy;
  }
`;

const animationFragmentShader = `
  precision mediump float;

  varying mediump vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  void main(void) {
    highp vec2 coord = vTextureCoord.xy / uTextureDimensions;
    mediump vec4 texelColor = texture2D(uSampler, coord);

    gl_FragColor = vec4(texelColor.rgb * texelColor.a, texelColor.a);
  }
`;

export const showAnimation = (): {
  setImage(image: HTMLImageElement): void;
  setImageDefinition(imageDefinition: ImageDefinition): void;
  setControlValues(controlValues: ControlValues): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  renderer: WebGLRenderer;
} => {
  const stride = 4;

  let imageDefinition: ImageDefinition | null = null;
  let controlValues: ControlValues | null = null;

  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let indexBuffer: WebGLBuffer | null = null;
  let img: HTMLImageElement | null = null;
  let texture: WebGLTexture | null = null;
  let program: WebGLProgram | null = null;

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
  let controls: string[] = [];
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
    if (!imageDefinition || !gl || !indexBuffer || !vertexBuffer || !program)
      return;
    gl.useProgram(program);

    const vertices: number[] = [];
    const indices: number[] = [];
    elements = [];

    const sprites = flattenShapes(imageDefinition.shapes);
    sprites.forEach((shape, index) => {
      const anchor = getAnchor(shape);
      const shapeIndices = Delaunator.from(shape.points).triangles;
      const start = indices.length;

      const itemOffset = [...shape.translate, index * 0.1];
      elements.push({
        name: shape.name,
        start,
        amount: shapeIndices.length,
        mutator: 0,
        x: itemOffset[0],
        y: itemOffset[1],
        z: -0.5 + itemOffset[2] * 0.001,
      });
      const offset = vertices.length / stride;
      shape.points.forEach(([x, y]) => {
        vertices.push(x - anchor[0], y - anchor[1], x, y);
      });

      shapeIndices.forEach((index) => {
        indices.push(index + offset);
      });
    });
    const [
      newMutators,
      vectorSettings,
      treeData,
      shapeVectorInfo,
    ] = createMutationTree(imageDefinition.shapes);
    assignMutatorToElements(
      imageDefinition.shapes,
      elements,
      treeData,
      shapeVectorInfo
    );

    mutators = newMutators;
    controls = imageDefinition.controls.map((e) => e.name);

    elements.sort((a, b) => (b.z || 0) - (a.z || 0));

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

    const uMutationValues = gl.getUniformLocation(program, "uMutationValues");
    const mutationValues = new Float32Array(MAX_MUTATION_VECTORS * 2).fill(0);
    Object.entries(imageDefinition.defaultFrame).forEach(([key, value]) => {
      const index = mutators.indexOf(key);
      if (index === -1) return;
      mutationValues[index * 2] = value[0];
      mutationValues[index * 2 + 1] = value[1];
    });
    gl.uniform2fv(uMutationValues, mutationValues);

    type ControlData = {
      name: string;
      controlIndex: number;
      values: Vec2[];
    };

    type MutationControl = {
      [key: number]: {
        controls: ControlData[];
      };
    };

    const mutationControlData: MutationControl = imageDefinition.controls.reduce<MutationControl>(
      (result: MutationControl, control: ControlDefinition) => {
        const controlMutations = control.steps.reduce<string[]>(
          (result, frame) =>
            result.concat(
              Object.keys(frame).filter((name) => !result.includes(name))
            ),
          []
        );
        controlMutations.forEach((mutation) => {
          const index = mutators.indexOf(mutation);
          const controlData: ControlData = {
            name: control.name,
            controlIndex:
              imageDefinition?.controls.findIndex(
                (c) => c.name === control.name
              ) || 0,
            values: control.steps.map((k) => k[mutation]),
          };
          result = {
            ...result,
            [index]: {
              controls: ((result[index] || {}).controls || []).concat(
                controlData
              ),
            },
          };
        });
        return result;
      },
      {}
    );
    console.log(mutationControlData);

    // console.log(imageDefinition);

    // const baseMutationValues: Vec2[] = []; // DONE
    // const controlValues: number[] = []; // DONE

    // const controlMutationValues: Vec2[] = [];

    // const mutationValueIndices: Vec3[] = [];
    // Vec3 = [start controlMutationValues, controlValueIndex, stepType]

    // const controlMutationIndices: Vec2[] = [];
    // index == mutationIndex
    // Vec2 = [start mutationValueIndices, length mutationValueIndices]

    // const getMutationValue = (index: number, mutationType: number) => {
    //   let baseValue: Vec2 = baseMutationValues[index];
    //   const controlMutations: Vec2 = controlMutationIndices[index];
    //   for (let a = 0; a < controlMutations[1]; a++) {
    //     const valueIndices: Vec3 =
    //       mutationValueIndices[controlMutations[0] + a];
    //     const [start, valueIndex, step] = valueIndices;
    //     const controlValue = controlValues[valueIndex];

    //     const startIndex = Math.floor(start + controlValue);
    //     let mutationValue = controlMutationValues[startIndex];
    //     if (step === 0) {
    //       const endIndex = Math.ceil(start + controlValue);
    //       const mix = controlValue - Math.floor(controlValue);
    //       const mixValue = controlMutationValues[endIndex];
    //       mutationValue = mixVec2(mutationValue, mixValue, mix);
    //     }

    //     if (mutationType == 4) {
    //       baseValue = vecMul(baseValue, mutationValue);
    //     } else {
    //       baseValue = vecAdd(baseValue, mutationValue);
    //     }
    //   }

    //   return baseValue;
    // };
  };

  const assignControlValues = () => {
    if (!imageDefinition || !gl || !program || !controlValues) return;
    gl.useProgram(program);

    // Set control values to uniforms

    const uControlValues = gl.getUniformLocation(program, "uControlValues");
    const contrValues = new Float32Array(MAX_CONTROLS).fill(0);
    Object.entries(controlValues).forEach(([key, value]) => {
      const index = controls.indexOf(key);
      if (index === -1) return;
      contrValues[index] = value;
    });
    gl.uniform1fv(uControlValues, contrValues);
  };

  let cWidth = 0;
  let cHeight = 0;
  let basePosition = [0, 0, 0.1];

  return {
    setImage(image: HTMLImageElement) {
      img = image;
      setImageTexture();
    },
    setImageDefinition(imgDef) {
      imageDefinition = imgDef;
      populateShapes();
    },
    setControlValues(ctrlValues) {
      controlValues = ctrlValues;
      assignControlValues();
    },
    setZoom(newZoom) {
      zoom = newZoom;
    },
    setPan(x: number, y: number) {
      pan = [x, y];
    },
    renderer(initgl: WebGLRenderingContext, { getUnit, getSize }) {
      gl = initgl;

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
        animationVertexShader,
        animationFragmentShader
      );
      program = shaderProgram;

      gl.useProgram(shaderProgram);
      gl.uniform1i(
        gl.getUniformLocation(shaderProgram, "uSampler"),
        unit.index
      );
      setImageTexture();
      populateShapes();
      assignControlValues();

      return {
        render() {
          if (!img || !imageDefinition) {
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

          const translate = gl.getUniformLocation(shaderProgram, "translate");
          const mutation = gl.getUniformLocation(shaderProgram, "mutation");
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

          elements.forEach((element) => {
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
