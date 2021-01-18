import React, { useEffect, useRef } from "react";

enum ShaderType {
  Vertex,
  Fragment,
}

export const compileShader = (
  gl: WebGL2RenderingContext,
  source: string,
  shaderType: ShaderType
): WebGLShader => {
  const shader = gl.createShader(
    shaderType === ShaderType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
  );
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) as string);
  }
  return shader;
};

const createProgram = (
  gl: WebGL2RenderingContext,
  color: number[],
  offset: number[] = [0, 0]
) => {
  // prettier-ignore
  const vertices = [
    -0.5 + offset[0], 0.5 + offset[1], 0.0,
    -0.5 + offset[0], -0.5 + offset[1], 0.0, 
    0.5 + offset[0], -0.5 + offset[1], 0.0,

     -0.5 + offset[0], 0.5 + offset[1], 0.0,
     0.5 + offset[0], 0.5 + offset[1], 0.0, 
     0.5 + offset[0], -0.5 + offset[1], 0.0
  ];
  const indices = [0, 1, 2, 3, 4, 5];

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

  const vertexShader = compileShader(
    gl,
    `
    attribute vec3 coordinates;

    void main(void) {
        gl_Position = vec4(coordinates, 1.0);
    }
    `,
    ShaderType.Vertex
  );

  const fragmentShader = compileShader(
    gl,
    `
    void main(void) {
      gl_FragColor = vec4(${color.map((c) => `${c}.0`).join(",")}, 0.1);
    }
    `,
    ShaderType.Fragment
  );
  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    throw new Error("Failed to create program");
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  return () => {
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  };
};

const setupWebGL = (element: HTMLCanvasElement) => {
  const gl = element.getContext("webgl2", {
    premultipliedalpha: true,
    depth: true,
    antialias: true,
    powerPreference: "low-power",
  }) as WebGL2RenderingContext;

  if (!gl) {
    throw new Error("No WebGL Support");
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendEquation(gl.FUNC_ADD);
  gl.blendFunc(gl.ONE, gl.ONE);

  const render = createProgram(gl, [1, 0, 0]);
  const render2 = createProgram(gl, [0, 1, 0], [0.1, -0.1]);

  // START-Rendering
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, element.width, element.height);

  render();
  render2();
};

const WebGLCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      const node = ref.current;
      const rect = node.getBoundingClientRect();
      node.width = rect.width * window.devicePixelRatio;
      node.height = rect.height * window.devicePixelRatio;

      setupWebGL(ref.current);
    }
  }, [ref]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default WebGLCanvas;
