import { createProgram, WebGLRenderer } from "../../lib/webgl";

const textureMapVertexShader = `
  attribute vec2 coordinates;
  uniform vec4 viewport;

  mat4 viewportScale = mat4(
    2.0 / viewport.x, 0, 0, 0,   
    0, -2.0 / viewport.y, 0, 0,    
    0, 0, 1, 0,    
    -1, +1, 0, 1
  );

  void main() {
    gl_Position = viewportScale * vec4(coordinates + viewport.ba, 0.0, 1.0);
  }
`;

const textureMapFragmentShader = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
  }
`;

export const showTextureMap = (img: HTMLImageElement): WebGLRenderer => (
  gl: WebGLRenderingContext,
  { getSize }
) => {
  const stride = 2;
  // prettier-ignore
  const vertices = [
    0, 0,
    40, 0,
    40, 0,
    40, 40,
    40, 40,
    0, 0,

    0, 0,
    0, 40,
    0, 40,
    40, 40,
    40, 40,
    0, 0
  ];
  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

  const shaderProgram = createProgram(
    gl,
    textureMapVertexShader,
    textureMapFragmentShader
  );

  return () => {
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(
      coord,
      3,
      gl.FLOAT,
      false,
      Float32Array.BYTES_PER_ELEMENT * stride,
      /* offset */ 0
    );
    gl.enableVertexAttribArray(coord);
    const [canvasWidth, canvasHeight] = getSize();
    const landscape = img.width / canvasWidth > img.height / canvasHeight;

    const [x, y] = landscape
      ? [0, (canvasHeight - (canvasWidth / img.width) * img.height) / 2]
      : [(canvasWidth - (canvasHeight / img.height) * img.width) / 2, 0];

    gl.uniform4f(
      gl.getUniformLocation(shaderProgram, "viewport"),
      canvasWidth,
      canvasHeight,
      x,
      y
    );

    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.LINES, 0, indices.length);
  };
};
