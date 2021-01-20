export enum ShaderType {
  Vertex,
  Fragment,
}

export type ShaderAttribute = {
  name: string;
  width: number;
};
export type AttributeList = ShaderAttribute[];

export const compileShader = (
  gl: WebGLRenderingContext,
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

interface ProgramAPI {
  getUnit(): number;
  getSize(): [number, number];
}

interface SceneAPI {
  render(): void;
}

type Attribute = {
  name: string;
  width: number;
  bytes: number;
  type: WebGLRenderingContext["FLOAT"];
  offset: number;
  location: number;
};

export type AttributeTable = { [key: string]: Attribute };

export type WebGLRenderer = (
  gl: WebGLRenderingContext,
  api: ProgramAPI
) => Promise<() => void> | (() => void);

export const webGLScene = async (
  element: HTMLCanvasElement,
  programs: WebGLRenderer[]
): Promise<SceneAPI> => {
  const gl = element.getContext("webgl2", {
    premultipliedalpha: true,
    depth: true,
    antialias: true,
    powerPreference: "low-power",
  }) as WebGLRenderingContext;

  if (!gl) {
    throw new Error("No WebGL Support");
  }

  let textureCounter = 0;
  const units = [
    gl.TEXTURE0,
    gl.TEXTURE1,
    gl.TEXTURE2,
    gl.TEXTURE3,
    gl.TEXTURE4,
    gl.TEXTURE5,
    gl.TEXTURE6,
  ];

  const api: ProgramAPI = {
    getUnit: () => units[textureCounter++],
    getSize: () => [element.width, element.height],
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendEquation(gl.FUNC_ADD);
  gl.blendFunc(gl.ONE, gl.ONE);

  const renders = await Promise.all<() => void>(
    programs.map((program) => program(gl, api))
  );

  return {
    render: () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, element.width, element.height);
      renders.forEach((render) => render());
    },
  };
};

export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: string,
  fragmentShader: string
): WebGLProgram => {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create shader program");
  const vertex = compileShader(gl, vertexShader, ShaderType.Vertex);
  const fragment = compileShader(gl, fragmentShader, ShaderType.Fragment);

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("Could not initialise shaders");
  }

  return program;
};
