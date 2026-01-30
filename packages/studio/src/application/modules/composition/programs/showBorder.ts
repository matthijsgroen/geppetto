import { type ScreenTranslation } from "@/dtos/application.dto";
import {
  createProgram,
  type WebGLRenderer,
} from "@/infrastructure/webgl/lib/webgl";
import { isInDarkMode } from "@/shared/utils/darkMode";

import borderFragmentShader from "./showBorder.frag";
import borderVertexShader from "./showBorder.vert";

export const showBorder = (
  trans: ScreenTranslation
): {
  setImageSize(width: number, height: number): void;
  renderer: WebGLRenderer;
} => {
  let gl: WebGLRenderingContext | null = null;
  let vertexBuffer: WebGLBuffer | null = null;
  let program: WebGLProgram | null = null;

  let imageWidth = 2048;
  let imageHeight = 1536;
  let scale = 1.0;
  const screenTranslation = trans;

  const populateBorder = () => {
    if (!gl || !vertexBuffer || !program) return;

    // Create a quad that covers the entire image area plus some padding for the shadow
    const padding = 20;
    const left = -imageWidth / 2 - padding;
    const right = imageWidth / 2 + padding;
    const top = -imageHeight / 2 - padding;
    const bottom = imageHeight / 2 + padding;

    const vertices = new Float32Array([
      left,
      top,
      right,
      top,
      left,
      bottom,
      right,
      bottom,
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };

  let cWidth = 0;
  let cHeight = 0;
  let basePosition = [0, 0, 0.01]; // In front of everything else

  let onChange: () => void = () => {};

  return {
    setImageSize(width: number, height: number) {
      imageWidth = width;
      imageHeight = height;
      populateBorder();
      onChange();
    },
    renderer(initGl: WebGLRenderingContext, { getSize }) {
      gl = initGl;

      vertexBuffer = gl.createBuffer();

      const [shaderProgram, programCleanup] = createProgram(
        gl,
        borderVertexShader,
        borderFragmentShader
      );
      program = shaderProgram;
      populateBorder();

      const render = () => {
        if (!gl || !program) return;

        const [canvasWidth, canvasHeight] = getSize();
        if (canvasWidth !== cWidth || canvasHeight !== cHeight) {
          const landscape =
            imageWidth / canvasWidth > imageHeight / canvasHeight;

          scale = landscape
            ? canvasWidth / imageWidth
            : canvasHeight / imageHeight;

          basePosition = [
            canvasWidth / 2 / scale,
            canvasHeight / 2 / scale,
            0.01,
          ];
          cWidth = canvasWidth;
          cHeight = canvasHeight;
        }

        gl.useProgram(program);

        // Disable depth test and depth writing so border always draws on top
        gl.disable(gl.DEPTH_TEST);

        // Set uniforms
        gl.uniform2f(
          gl.getUniformLocation(program, "viewport"),
          cWidth,
          cHeight
        );
        gl.uniform3fv(
          gl.getUniformLocation(program, "basePosition"),
          basePosition
        );
        gl.uniform3f(gl.getUniformLocation(program, "translate"), 0, 0, 0);
        gl.uniform4f(
          gl.getUniformLocation(program, "scale"),
          scale,
          screenTranslation.zoom,
          screenTranslation.panX,
          screenTranslation.panY
        );
        gl.uniform2f(
          gl.getUniformLocation(program, "uImageSize"),
          imageWidth,
          imageHeight
        );
        const inDarkMode = isInDarkMode();
        if (inDarkMode) {
          gl.uniform4f(
            gl.getUniformLocation(program, "uBorderColor"),
            0.0,
            201 / 255,
            81 / 255,
            1.0 // green border
          );
        } else {
          gl.uniform4f(
            gl.getUniformLocation(program, "uBorderColor"),
            245 / 255,
            244 / 255,
            244 / 255,
            1.0 // light gray border
          );
        }
        gl.uniform1f(
          gl.getUniformLocation(program, "uBorderWidth"),
          1.0 // 2px border constant width
        );
        gl.uniform1f(
          gl.getUniformLocation(program, "uZoom"),
          screenTranslation.zoom
        );
        gl.uniform1f(gl.getUniformLocation(program, "uScale"), scale);
        gl.uniform2f(
          gl.getUniformLocation(program, "uDropShadowOffset"),
          3.0,
          3.0 // 3px offset
        );
        gl.uniform1f(
          gl.getUniformLocation(program, "uDropShadowBlur"),
          5.0 // 5px blur
        );

        // Bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        const coord = gl.getAttribLocation(program, "coordinates");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);

        // Draw the border quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Re-enable depth test
        gl.enable(gl.DEPTH_TEST);
      };

      onChange = render;

      return {
        onChange: (listener: () => void) => {
          onChange = listener;
        },
        render,
        cleanup: () => {
          programCleanup();
          if (gl && vertexBuffer) {
            gl.deleteBuffer(vertexBuffer);
          }
        },
      };
    },
  };
};
