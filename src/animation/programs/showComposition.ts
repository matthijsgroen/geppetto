import Delaunator from "delaunator";
import { ShapesDefinition, Vec3 } from "../../lib/types";
import { createProgram, WebGLRenderer } from "../../lib/webgl";

const compositionVertexShader = `
  attribute vec2 coordinates;
  attribute vec2 aTextureCoord;
  varying lowp vec2 vTextureCoord;
  uniform vec2 viewport;
  uniform vec3 translate;
  uniform float scale;


  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  void main() {
    gl_Position = viewportScale * vec4((coordinates + translate.xy) * scale, translate.z, 1.0);
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

const getParentOffset = (
  shape: ShapesDefinition | undefined,
  shapes: ShapesDefinition[]
): Vec3 => {
  if (!shape || !shape.settings.parent) {
    return [0, 0, 0];
  }
  const parentId = shape.settings.parent.id;
  const parent = shapes.find((e) => e.name === parentId);
  const parentOffset = getParentOffset(parent, shapes);
  return [
    shape.settings.parent.offset[0] + parentOffset[0],
    shape.settings.parent.offset[1] + parentOffset[1],
    shape.settings.parent.offset[2] + parentOffset[2],
  ];
};

export const showComposition = (
  img: HTMLImageElement,
  shapes: ShapesDefinition[]
): WebGLRenderer => (gl: WebGLRenderingContext, { getUnit, getSize }) => {
  const unit = getUnit();
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  const stride = 4;

  const elements: {
    start: number;
    amount: number;
  }[] = [];
  const indices: number[] = [];
  const vertices: number[] = [];

  shapes.forEach((shape) => {
    const shapeIndices = Delaunator.from(shape.points).triangles;
    const start = indices.length;
    elements.push({
      start,
      amount: shapeIndices.length,
    });
    const offset = vertices.length / stride;
    shape.points.forEach(([x, y]) => {
      vertices.push(x, y, x, y);
    });
    shapeIndices.forEach((index) => {
      indices.push(index + offset);
    });
  });

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  const [shaderProgram, programCleanup] = createProgram(
    gl,
    compositionVertexShader,
    compositionFragmentShader
  );

  return {
    render() {
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

      gl.uniform1f(gl.getUniformLocation(shaderProgram, "scale"), scale);
      gl.uniform2f(
        gl.getUniformLocation(shaderProgram, "uTextureDimensions"),
        img.width,
        img.height
      );
      gl.activeTexture(unit.unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(
        gl.getUniformLocation(shaderProgram, "uSampler"),
        unit.index
      );

      const basePosition = [
        canvasWidth / 2 / scale,
        canvasHeight / 2 / scale,
        0.1,
      ];
      const calculatedElements = elements.map((element, index) => {
        const shape = shapes[index];
        const itemOffset = getParentOffset(shape, shapes);
        return {
          name: shape.name,
          ...element,
          x: basePosition[0] + itemOffset[0] - shape.settings.anchor[0],
          y: basePosition[1] + itemOffset[1] - shape.settings.anchor[1],
          z: basePosition[2] - itemOffset[2] * 0.001,
        };
      });

      calculatedElements.sort((a, b) => (b.z || 0) - (a.z || 0));

      const translate = gl.getUniformLocation(shaderProgram, "translate");
      calculatedElements.forEach((element) => {
        gl.uniform3f(translate, element.x, element.y, element.z);
        gl.drawElements(
          gl.TRIANGLES,
          element.amount,
          gl.UNSIGNED_SHORT,
          element.start * 2
        );
      });
    },
    cleanup() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      programCleanup();
    },
  };
};
