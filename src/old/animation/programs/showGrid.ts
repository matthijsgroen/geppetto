import { createProgram, WebGLRenderer } from "../../lib/webgl";

const textureVertexShader = `
  attribute vec2 coordinates;
  uniform mediump vec4 scale;

  void main() {
    gl_Position = vec4((coordinates + scale.ba) * scale.y, 0.09, 1.0);
  }
`;

const textureFragmentShader = `
  precision mediump float;

  uniform mediump vec3 backgroundColor;
  uniform mediump vec4 scale;
  uniform mediump vec3 uViewport;

  void main(void) {
    int xRow = int(mod(gl_FragCoord.x - uViewport.x, uViewport.z));
    int yRow = int(mod(gl_FragCoord.y - uViewport.y, uViewport.z));

    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    if (xRow == 0 || yRow == 0) {
      gl_FragColor = vec4(backgroundColor, 1.0);
    }
  }
`;

export const showGrid = (): {
  setImage(image: HTMLImageElement): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  setGrid(size: number): void;
  renderer: WebGLRenderer;
} => {
  const stride = 2;
  const vertices = [0, 0, 0, 0, 0, 0, 0, 0];
  const indices = [0, 1, 2, 2, 0, 3];

  let verticesUpdated = true;

  const updateVector = (index: number, offset: number, values: number[]) => {
    for (let i = 0; i < values.length; i++) {
      vertices[index * stride + offset + i] = values[i];
    }
    verticesUpdated = true;
  };

  let gl: WebGLRenderingContext;
  let img: HTMLImageElement | null = null;
  let zoom = 1.0;
  let grid = 1.0;
  let pan = [0, 0];

  return {
    setImage(image: HTMLImageElement) {
      img = image;
    },
    setZoom(newZoom) {
      zoom = newZoom;
    },
    setGrid(newGrid) {
      grid = newGrid;
    },
    setPan(x: number, y: number) {
      pan = [x, y];
    },
    renderer(initGl: WebGLRenderingContext, { getSize }) {
      gl = initGl;

      const setImageDimensions = () => {
        if (!img) {
          return;
        }
        const [canvasWidth, canvasHeight] = getSize();
        const landscape = img.width / canvasWidth > img.height / canvasHeight;

        const [x, y] = landscape
          ? [1.0, (img.height / img.width) * (canvasWidth / canvasHeight)]
          : [(img.width / img.height) * (canvasHeight / canvasWidth), 1.0];

        const pixDensity = landscape
          ? img.width / canvasWidth
          : img.height / canvasHeight;

        updateVector(0, 0, [-x, y]);
        updateVector(1, 0, [-x, -y]);
        updateVector(2, 0, [x, -y]);
        updateVector(3, 0, [x, y]);

        gl.uniform3f(
          gl.getUniformLocation(shaderProgram, "uViewport"),
          ((-x + pan[0]) * zoom + 1) * (canvasWidth / 2),
          ((y + pan[1]) * zoom + 1) * (canvasHeight / 2),
          (zoom / pixDensity) * grid
        );
      };

      setImageDimensions();

      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
      );
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
        textureVertexShader,
        textureFragmentShader
      );

      return {
        render() {
          if (!img || grid === 0) {
            return;
          }
          gl.useProgram(shaderProgram);
          setImageDimensions();
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          if (verticesUpdated) {
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(vertices),
              gl.STATIC_DRAW
            );
            verticesUpdated = false;
          }
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

          gl.uniform3f(
            gl.getUniformLocation(shaderProgram, "backgroundColor"),
            0.1,
            0.1,
            0.1
          );
          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "scale"),
            0,
            zoom,
            pan[0],
            pan[1]
          );

          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        },
        cleanup() {
          gl.deleteBuffer(vertexBuffer);
          gl.deleteBuffer(indexBuffer);
          programCleanup();
        },
      };
    },
  };
};
