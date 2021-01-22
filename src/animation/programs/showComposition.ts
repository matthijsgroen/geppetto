import Delaunator from "delaunator";
import { ShapesDefinition } from "../../lib/types";
import { createProgram, WebGLRenderer } from "../../lib/webgl";

const compositionVertexShader = `
  attribute vec2 coordinates;
  attribute vec2 aTextureCoord;
  varying lowp vec2 vTextureCoord;
  uniform vec4 viewport;
  uniform float scale;


  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  void main() {
    gl_Position = viewportScale * vec4((coordinates * scale) + viewport.ba, 0.0, 1.0);
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

  const elements: { start: number; amount: number }[] = [];
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

      const [x, y] = [
        (canvasWidth - scale * img.width) / 2,
        (canvasHeight - scale * img.height) / 2,
      ];

      gl.uniform4f(
        gl.getUniformLocation(shaderProgram, "viewport"),
        canvasWidth,
        canvasHeight,
        x,
        y
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

      elements.forEach((element) => {
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
