import { ShapesDefinition } from "../../lib/types";
import { verticesFromPoints } from "../../lib/vertices";
import { createProgram, WebGLRenderer } from "../../lib/webgl";

const textureMapVertexShader = `
  attribute vec2 coordinates;
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
  }
`;

const textureMapFragmentShader = `
  void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
  }
`;

export const showTextureMap = (
  img: HTMLImageElement,
  shapes: ShapesDefinition[]
): WebGLRenderer => (gl: WebGLRenderingContext, { getSize }) => {
  const stride = 2;

  const vertices = shapes.reduce((coordList, shape) => {
    const list = verticesFromPoints(shape.points);
    const newCoords = [];
    for (let i = 0; i < list.length; i += 6) {
      newCoords.push(
        list[i],
        list[i + 1],
        list[i + 2],
        list[i + 3],
        list[i + 2],
        list[i + 3],
        list[i + 4],
        list[i + 5],
        list[i + 4],
        list[i + 5],
        list[i],
        list[i + 1]
      );
    }
    return coordList.concat(newCoords);
  }, [] as number[]);
  const indices = Array(vertices.length / 2)
    .fill(0)
    .map((_, i) => i);

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

    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.LINES, 0, indices.length);
  };
};
