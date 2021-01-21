import { createProgram, WebGLRenderer } from "../../lib/webgl";

const textureMapVertexShader = `
  attribute vec3 coordinates;

  void main(void) {
      gl_Position = vec4(coordinates, 1.0);
  }
`;

const textureMapFragmentShader = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
  }
`;

export const showTextureMap = (): WebGLRenderer => (
  gl: WebGLRenderingContext
) => {
  const stride = 3;
  // prettier-ignore
  const vertices = [
    -0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0, 
    0.5, -0.5, 0.0,

    -0.5, 0.5, 0.0,
    0.5, 0.5, 0.0, 
    0.5, -0.5, 0.0
  ];
  const indices = [0, 1, 2, 4, 4, 5];

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

    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, indices.length);
  };
};
