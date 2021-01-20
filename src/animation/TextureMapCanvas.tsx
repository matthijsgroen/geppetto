import React, { useEffect, useRef } from "react";
import { webGLScene, WebGLRenderer, createProgram } from "../lib/webgl";
import texture from "./hiddo-texture.png";

const textureVertexShader = `
  attribute vec2 coordinates;
  attribute vec2 aTextureCoord;
  varying lowp vec2 vTextureCoord;

  void main() {
    vTextureCoord = aTextureCoord.xy;
    gl_Position = vec4(coordinates, 0.1, 1.0);
  }
`;

const textureFragmentShader = `
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

const showTexture = (img: HTMLImageElement): WebGLRenderer => (
  gl: WebGLRenderingContext,
  { getUnit, getSize }
) => {
  const unit = getUnit();
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  const stride = 4;
  // prettier-ignore
  const vertices = [
    0, 0, 0, 0,
    0, 0, 0, img.height,
    0, 0, img.width, img.height,
    0, 0, img.width, 0,
  ];
  const indices = [0, 1, 2, 2, 0, 3];

  const updateVector = (index: number, offset: number, values: number[]) => {
    for (let i = 0; i < values.length; i++) {
      vertices[index * stride + offset + i] = values[i];
    }
  };

  const setImageDimensions = () => {
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
    textureVertexShader,
    textureFragmentShader
  );

  return () => {
    gl.useProgram(shaderProgram);
    setImageDimensions();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
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
      img.width,
      img.height
    );
    gl.activeTexture(unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  };
};

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

const showTextureMap = (): WebGLRenderer => (gl: WebGLRenderingContext) => {
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

const loadImage = async (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.src = url;
  });

const startWebGL = async (node: HTMLCanvasElement): Promise<() => void> => {
  const rect = node.getBoundingClientRect();
  node.width = rect.width * window.devicePixelRatio;
  node.height = rect.height * window.devicePixelRatio;

  const image = await loadImage(texture);

  const api = await webGLScene(node, [showTexture(image), showTextureMap()]);
  api.render();
  let debounce: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const rect = node.getBoundingClientRect();
      node.width = rect.width * window.devicePixelRatio;
      node.height = rect.height * window.devicePixelRatio;
      api.render();
    }, 50);
  };
  window.addEventListener("resize", onResize);

  return () => {
    // cleanup
    window.removeEventListener("resize", onResize);
  };
};

const TextureMapCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      const node = ref.current;
      let cleanup: () => void;
      startWebGL(node).then((result) => {
        cleanup = result;
      });
      return () => {
        // unmount
        cleanup && cleanup();
      };
    }
  }, [ref]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default TextureMapCanvas;
