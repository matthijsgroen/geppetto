import { createProgram, WebGLRenderer } from "../lib/webgl";
import raw from "raw.macro";
const textureVertexShader = raw("./showTexture.vert");
const textureFragmentShader = raw("./showTexture.frag");

export const showTexture = (): {
  setImage(image: HTMLImageElement): void;
  setZoom(zoom: number): void;
  setPan(x: number, y: number): void;
  renderer: WebGLRenderer;
} => {
  const stride = 4;
  const vertices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const indices = [0, 1, 2, 2, 0, 3];

  let verticesUpdated = true;

  const updateVector = (index: number, offset: number, values: number[]) => {
    for (let i = 0; i < values.length; i++) {
      vertices[index * stride + offset + i] = values[i];
    }
    verticesUpdated = true;
  };

  let gl: WebGLRenderingContext | null = null;
  let img: HTMLImageElement | null = null;
  let texture: WebGLTexture | null = null;
  let zoom = 1.0;
  let pan = [0, 0];

  const setImageTexture = (): void => {
    if (img === null || texture === null || gl === null) {
      return;
    }
    updateVector(0, 2, [0, 0]);
    updateVector(1, 2, [0, img.height]);
    updateVector(2, 2, [img.width, img.height]);
    updateVector(3, 2, [img.width, 0]);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  };

  let onChange: () => void = () => {};
  return {
    setImage(image: HTMLImageElement) {
      img = image;
      setImageTexture();
      onChange();
    },
    setZoom(newZoom) {
      zoom = newZoom;
      onChange();
    },
    setPan(x: number, y: number) {
      pan = [x, y];
      onChange();
    },
    renderer(initGl: WebGLRenderingContext, { getUnit, getSize }) {
      gl = initGl;
      const unit = getUnit();
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      setImageTexture();

      const setImageDimensions = () => {
        if (!img || !gl) {
          return;
        }
        const [canvasWidth, canvasHeight] = getSize();
        const landscape = img.width / canvasWidth > img.height / canvasHeight;

        const [x, y] = landscape
          ? [1.0, (img.height / img.width) * (canvasWidth / canvasHeight)]
          : [(img.width / img.height) * (canvasHeight / canvasWidth), 1.0];
        updateVector(0, 0, [-x, y]);
        updateVector(1, 0, [-x, -y]);
        updateVector(2, 0, [x, -y]);
        updateVector(3, 0, [x, y]);
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
        onChange(listener) {
          onChange = listener;
        },
        render() {
          if (!img || !gl) {
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

          gl.uniform2f(
            gl.getUniformLocation(shaderProgram, "uTextureDimensions"),
            img ? img.width : 0,
            img ? img.height : 0
          );

          gl.activeTexture(unit.unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uSampler"),
            unit.index
          );

          gl.uniform3f(
            gl.getUniformLocation(shaderProgram, "backgroundColor"),
            0.6,
            0.6,
            0.6
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
          if (gl) {
            gl.deleteTexture(texture);
            gl.deleteBuffer(vertexBuffer);
            gl.deleteBuffer(indexBuffer);
          }
          programCleanup();
          gl = null;
        },
      };
    },
  };
};
