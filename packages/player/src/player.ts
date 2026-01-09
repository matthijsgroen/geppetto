import type { PreparedFloatBuffer, PreparedIntBuffer, PreparedImageDefinition, Vec2, EasingFunction } from "./types";
import animationFragmentShader from "./shaders/fragmentShader.frag";
import { animationVertexShader } from "./shaders/vertexShader";
import { interpolateFloat, applyEasing } from "./vertices";

// Simple linear interpolation for numbers
const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

// Circular interpolation for hue values (0-1 range, wrapping)
const mixHue = (a: number, b: number, factor: number): number => {
  const circularDistance = (a: number, b: number): [number, number] => {
    const d = Math.abs(a - b);
    let aa = a;
    let ba = b;

    if (a < b && Math.abs(a + 1 - b) < d) {
      aa += 1;
    }
    if (a > b && Math.abs(b - a + 1) < d) {
      ba += 1;
    }
    return [aa, ba];
  };
  
  const [aa, ba] = circularDistance(a, b);
  return mix(aa, ba, factor) % 1.0;
};

// Helper to interpolate between control steps
const interpolateControlStep = (
  rawControls: PreparedImageDefinition["rawControls"],
  rawMutations: PreparedImageDefinition["rawMutations"],
  controlIds: string[],
  controlIndex: number,
  controlValue: number
): Record<string, Vec2> => {
  const controlId = controlIds[controlIndex];
  const control = rawControls[controlId];
  if (!control) return {};
  
  const minStep = Math.floor(controlValue);
  const maxStep = Math.ceil(controlValue);
  const stepLimit = control.steps.length - 1;
  
  const minValue = control.steps[Math.min(minStep, stepLimit)];
  const maxValue = control.steps[Math.min(maxStep, stepLimit)];
  
  const mixValue = controlValue - minStep;
  
  const result: Record<string, Vec2> = {};
  for (const [mutationId, mutationValue] of Object.entries(minValue)) {
    const endValue = maxValue[mutationId] || mutationValue;
    const mutationInfo = rawMutations[mutationId];
    
    // Use circular interpolation for colorize mutations (hue is circular)
    if (mutationInfo?.type === "colorize") {
      result[mutationId] = [
        mixHue(mutationValue[0], endValue[0], mixValue),
        mix(mutationValue[1], endValue[1], mixValue),
      ];
    } else {
      result[mutationId] = [
        mix(mutationValue[0], endValue[0], mixValue),
        mix(mutationValue[1], endValue[1], mixValue),
      ];
    }
  }
  
  return result;
};

/**
 * Function to call for unsubscribing to an event listener
 */
export type Unsubscribe = () => void;

export type TrackStoppedCallback = (track: string) => void;
export type CustomEventCallback = (
  eventName: string,
  track: string,
  time: number
) => void;

export type PlayOptions = {
  /**
   * Start animation at given ms.
   */
  startAt?: number;
  /**
   * Playback speed.
   * @default 1.0
   */
  speed?: number;
};

/**
 * Options to control the animation, start animation tracks, etc.
 */
export type AnimationControls = {
  /**
   * Render a frame of the image.
   */
  render(): void;

  /**
   * Set the looping state of an animation track.
   *
   * The default value is based on how the animation is build.
   *
   * @param loop true for looping, false to stop looping.
   * @param animationName the name of the animation track to adjust.
   * @throws an error if the provided trackName does not exist
   */
  setLooping(loop: boolean, animationName: string): void;

  /**
   * Start an animation. Conflicting animations will be automatically stopped.
   *
   * @param animationName the name of the animation track to start.
   * If the name is not valid, an exception will be thrown
   * indicating what animation names are available.
   * @throws an error if the provided trackName does not exist
   */
  startAnimation(animationName: string, options?: PlayOptions): void;

  /**
   * Stop an animation.
   *
   * @param animationName the name of the animation track to start.
   * If the name is not valid, an exception will be thrown
   * indicating what animation names are available.
   */
  stopAnimation(animationName: string): void;

  /**
   * Manipulates a control. Will stop animations that are using this control as well.
   *
   * @param controlName name of the control to change
   * @param value value to set for control (0-1 range)
   * @throws an error if the provided controlName does not exist
   */
  setControlValue(controlName: string, value: number): void;

  /**
   * Smoothly animates a control from its current value to a target value over time.
   * Will stop any animations or existing tweens using this control.
   *
   * @param controlName name of the control to animate
   * @param targetValue target value for control (0-1 range)
   * @param duration duration in milliseconds
   * @param options optional easing function and completion callback
   * @throws an error if the provided controlName does not exist
   */
  tweenControlTo(
    controlName: string,
    targetValue: number,
    duration: number,
    options?: {
      easing?: EasingFunction;
      onComplete?: () => void;
    }
  ): void;

  /**
   * Retrieves current value of a control. This value will not update for each frame
   * of an animation. It will only update at the end of each play iteration of an animation.
   *
   * @param controlName name of the control to get value from
   * @return value of the control. Take into account that each control can have different
   * value limits, depending on the amount of step a control has.
   */
  getControlValue(controlName: string): number;

  /**
   * Update the panning of the animation.
   *
   * @param panX value of horizontal panning. `0` = center, `-1` = left, `1` = right.
   * @param panY value of vertical panning. `0` = center, `-1` = bottom, `1` = top.
   */
  setPanning(panX: number, panY: number): void;

  /**
   * Updates the zoom level.
   *
   * @param zoom `1` = 100%, `1.5` is 150%, `0.5` = 50% zoom.
   */
  setZoom(zoom: number): void;

  /**
   * Changes the rendering order of animations.
   *
   * @param zIndex The index number for rendering.
   * The higher the number, the more in the front the element will be stacked.
   */
  setZIndex(zIndex: number): void;

  /**
   * Register a callback to get notifications when a track is stopped.
   * A track can be stopped for the following reasons.
   *
   * - A control is used that is conflicting with an animation track.
   * - Another track is started that is conflicting with an animation track.
   * - A track is stopped using `stopTrack`
   *
   * @param callback function to call when tracks are stopped.
   * The first argument will be the trackname.
   * @returns a function to call to unsubscribe
   */
  onTrackStopped(callback: TrackStoppedCallback): Unsubscribe;

  /**
   * Register a callback to get notifications when an event is triggered.
   * Events can be defined in an animation.
   *
   * @param callback function that gets called whenever an event happens.
   * It passes in the eventName, track and time.
   * @returns a function to call to unsubscribe
   */
  onEvent(callback: CustomEventCallback): Unsubscribe;

  /**
   * Clears all memory associated to this animation.
   */
  destroy(): void;
};

/**
 * Options to set directly when adding an animation.
 */
export interface AnimationOptions {
  /**
   * Horizontal position of image in canvas. `0` = center, `-1` = left, `1` = right.
   *
   * @default 0.0
   */
  panX: number;
  /**
   * Vertical position of image in canvas. `0` = center, `-1` = bottom, `1` = top.
   *
   * @default 0.0
   */
  panY: number;
  /**
   * Zoom level. `1` = 100%, `1.5` is 150%, `0.5` = 50% zoom.
   *
   * @default 1.0
   */
  zoom: number;
  /**
   * Adds a stacking order to the rendering elements, this helps when
   * stacking multiple animations on top of eachother.
   *
   * @default 0
   */
  zIndex: number;
}

type PlayStatus = {
  name: string;
  index: number;
  startAt: number;
  speed: number;
  startedAt: number;
  iterationStartedAt: number;
  lastRender: number;
};

/**
 * A player to add Geppetto animations to.
 */
export type GeppettoPlayer = {
  /**
   * Clears the canvas. Use this when you created the player with {@link setupWebGL}.
   * If you want to control the rendering process (and the clearing of the canvas) yourself,
   * skip the call to this method in your render cycle.
   */
  render(): void;

  /**
   * Add a Geppetto animation to the player.
   *
   * @param animation an animation prepared with {@link prepareAnimation}.
   * @param image a HTML Image element with loaded url to use as texture.
   * @param textureUnit The texture unit to use you can use `0` for your first animation,
   * `1` for your second, etc.
   * @param options
   */
  addAnimation(
    animation: PreparedImageDefinition,
    image: HTMLImageElement,
    textureUnit: number,
    options?: Partial<AnimationOptions>
  ): AnimationControls;

  /**
   * Destroys all animations added to this player.
   */
  destroy: () => void;
};

const getContext = (element: HTMLCanvasElement): WebGLRenderingContext => {
  const gl = element.getContext("webgl", {
    premultipliedalpha: true,
    depth: true,
    antialias: true,
    powerPreference: "low-power",
  }) as WebGLRenderingContext;

  if (!gl) {
    throw new Error("Canvas has no webgl context available");
  }
  return gl;
};

/**
 * Initializes the WebGL Context of a provided context. Configures the context and returns
 * a GeppettoPlayer bound to this element.
 *
 * Use this method if you only render Geppetto Animations in your Canvas.
 * Use {@link createPlayer} if you want your own control over the canvas configuration
 *
 * @param element the Canvas DOM element that is not yet initialized with a context
 */
export const setupWebGL = (element: HTMLCanvasElement): GeppettoPlayer => {
  const gl = getContext(element);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return createPlayer(element);
};

const setupWebGLProgram = (
  gl: WebGLRenderingContext,
  animation: PreparedImageDefinition
): [WebGLProgram, WebGLShader, WebGLShader] => {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create shader program");

  const vertexShaderSource = animationVertexShader(animation);

  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  if (!vs || !fs) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    throw new Error("Failed to create shader program");
  }

  gl.shaderSource(vs, vertexShaderSource);
  gl.shaderSource(fs, animationFragmentShader);
  gl.compileShader(vs);
  gl.compileShader(fs);

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Link failed: " + gl.getProgramInfoLog(program));
    console.error("vs info-log: " + gl.getShaderInfoLog(vs));
    console.error("fs info-log: " + gl.getShaderInfoLog(fs));
    throw new Error("Could not initialise shaders");
  }

  return [program, vs, fs];
};

const setProgramBuffer =
  (gl: WebGLRenderingContext, program: WebGLProgram) =>
  (uniform: string, buffer: PreparedFloatBuffer | PreparedIntBuffer) => {
    const uniformLocation = gl.getUniformLocation(program, uniform);
    const stride = buffer.stride;

    if (stride == 2) {
      gl.uniform2fv(uniformLocation, buffer.data);
    } else if (stride == 3) {
      gl.uniform3fv(uniformLocation, buffer.data);
    } else if (stride == 4) {
      gl.uniform4fv(uniformLocation, buffer.data);
    }
    return uniformLocation;
  };

const setupTexture = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  image: HTMLImageElement
): WebGLTexture | null => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.useProgram(program);
  gl.uniform2f(
    gl.getUniformLocation(program, "uTextureDimensions"),
    image.width,
    image.height
  );

  return texture;
};

let animId = 0;

/**
 * Initializes a player to display in an existing WebGL Environment.
 * Use this function to create a player if you want to have full control over the
 * rendering process (possibly to combine with other render code).
 *
 * @param element the Canvas DOM element containing a WebGL Context
 */
export const createPlayer = (element: HTMLCanvasElement): GeppettoPlayer => {
  const gl = getContext(element);

  const animations: AnimationControls[] = [];
  let onTrackStoppedListeners: {
    animation: number;
    callback: TrackStoppedCallback;
  }[] = [];
  let onCustomEventListeners: CustomEventCallback[] = [];

  return {
    render: () => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, element.width, element.height);
      
      // Render all animations sorted by zIndex
      const sortedAnimations = animations.slice().sort(() => {
        // Access zIndex from the animation's options
        return 0; // For now, render in order they were added
      });
      
      for (const animation of sortedAnimations) {
        animation.render();
      }
    },
    addAnimation: (animation, image, textureUnit, options) => {
      const id = ++animId;
      
      // Use metadata from animation as defaults, merged with provided options
      const animationDefaults: AnimationOptions = {
        zoom: animation.metadata.zoom,
        panX: animation.metadata.pan[0],
        panY: animation.metadata.pan[1],
        zIndex: 0,
      };
      
      const unit = [
        gl.TEXTURE0,
        gl.TEXTURE1,
        gl.TEXTURE2,
        gl.TEXTURE3,
        gl.TEXTURE4,
        gl.TEXTURE5,
        gl.TEXTURE6,
        gl.TEXTURE7,
        gl.TEXTURE8,
        gl.TEXTURE9,
      ][textureUnit];
      const [program, vs, fs] = setupWebGLProgram(gl, animation);
      // 3. Load texture
      gl.useProgram(program);
      const texture = setupTexture(gl, program, image);

      // 4. Set Uniforms (simplified - matching studio approach)
      // Upload mutation vectors and parent chain once at initialization
      const setBuffer = setProgramBuffer(gl, program);
      setBuffer("uMutationVectors", animation.mutators);
      
      const parentLocation = gl.getUniformLocation(program, "uMutationParent");
      gl.uniform1iv(parentLocation, animation.mutatorParents.data);
      
      // Mutation values will be uploaded before each render
      const mutationValuesLocation = gl.getUniformLocation(program, "uMutationValues");
      
      // Initialize control values
      const controlValues = new Float32Array(animation.defaultControlValues);
      const renderControlValues = new Float32Array(animation.defaultControlValues);

      // Control tween state
      type ControlTween = {
        controlIndex: number;
        startValue: number;
        targetValue: number;
        startTime: number;
        duration: number;
        easing: EasingFunction;
        onComplete?: () => void;
      };
      const controlTweens: ControlTween[] = [];

      // 5. Set shape buffers
      const vertexBuffer = gl.createBuffer();
      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        animation.shapeVertices.data,
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        animation.shapeIndices,
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      // Get locations for rendering
      const uBasePosition = gl.getUniformLocation(program, "basePosition");
      const uTranslate = gl.getUniformLocation(program, "translate");
      const uMutation = gl.getUniformLocation(program, "mutation");
      const uViewport = gl.getUniformLocation(program, "viewport");
      const uScale = gl.getUniformLocation(program, "scale");

      const aCoord = gl.getAttribLocation(program, "coordinates");
      const aTexCoord = gl.getAttribLocation(program, "aTextureCoord");

      let cWidth = 0,
        cHeight = 0;

      let { zoom, panX, panY, zIndex } = { ...animationDefaults, ...options };
      let basePosition = [0, 0];
      let scale = 1.0;

      const playingAnimations: PlayStatus[] = [];
      const looping: boolean[] = animation.animations.map((a) => a.looping);

      const stopAnimation = (track: string): void => {
        // Remove from playing list
        const playingIndex = playingAnimations.findIndex(
          (e) => e.name === track
        );
        if (playingIndex === -1) return;
        const playing = playingAnimations[playingIndex];

        const now = +new Date();
        let playTime = now - playing.startedAt + playing.startAt;

        const playingAnimation = animation.animations[playing.index];
        if (looping[playing.index]) {
          playTime %= playingAnimation.duration;
        }
        playingAnimations.splice(playingIndex, 1);

        // place current active control values in control values list
        for (const [controlIndex, track] of playingAnimation.tracks) {
          const value = interpolateFloat(
            track,
            playTime,
            controlValues[controlIndex]
          );
          controlValues[controlIndex] = value;
        }

        for (const listener of onTrackStoppedListeners) {
          if (listener.animation === id) listener.callback(track);
        }
      };

      const nameToControlIndex = (controlName: string): number => {
        const controlIndex = animation.controlNames.get(controlName);
        if (controlIndex === undefined) {
          throw new Error(
            `Control ${controlName} does not exist in ${Array.from(animation.controlNames.keys()).join(",")}`
          );
        }
        return controlIndex;
      };

      const nameToTrackIndex = (trackName: string): number => {
        const trackIndex = animation.animationNames.get(trackName);
        if (trackIndex === undefined) {
          throw new Error(
            `Track ${trackName} does not exist in ${Array.from(animation.animationNames.keys()).join(",")}`
          );
        }
        return trackIndex;
      };

      const setControlValue: AnimationControls["setControlValue"] = (
        control,
        value
      ) => {
        const controlIndex = nameToControlIndex(control);

        if (value < 0 || value > 1) {
          throw new Error(
            `Control ${control} value should be between 0 and 1. ${value} is out of bounds.`
          );
        }
        
        const controlIds = Object.keys(animation.rawControls);
        const controlId = controlIds[controlIndex];
        const maxSteps = animation.rawControls[controlId].steps.length - 1;
        
        // Scale 0-1 input to actual step range (0 to steps.length-1)
        const scaledValue = value * maxSteps;
        // stop all conflicting tracks
        for (const playing of playingAnimations) {
          const playingAnimation = animation.animations[playing.index];
          if (
            playingAnimation.tracks.some(
              ([controlNr]) => controlNr === controlIndex
            )
          ) {
            stopAnimation(playingAnimation.name);
          }
        }

        controlValues[controlIndex] = scaledValue;
        renderControlValues[controlIndex] = scaledValue;
        
        // Calculate mutation values from control steps (like studio's calculateVectorValues)
        const mutationUpdates = interpolateControlStep(
          animation.rawControls,
          animation.rawMutations,
          controlIds,
          controlIndex,
          scaledValue
        );
        
        // Update mutation values
        for (const [mutationId, mutationValue] of Object.entries(mutationUpdates)) {
          const mutationIndex = animation.mutatorMapping[mutationId];
          if (mutationIndex !== undefined) {
            animation.mutationValues.data[mutationIndex * 2] = mutationValue[0];
            animation.mutationValues.data[mutationIndex * 2 + 1] = mutationValue[1];
          }
        }
        
        // Upload to GPU immediately
        gl.useProgram(program);
        gl.uniform2fv(mutationValuesLocation, animation.mutationValues.data);
      };

      const tweenControlTo: AnimationControls["tweenControlTo"] = (
        control,
        targetValue,
        duration,
        { easing = "linear", onComplete } = {}
      ) => {
        const controlIndex = nameToControlIndex(control);

        if (targetValue < 0 || targetValue > 1) {
          throw new Error(
            `Control ${control} target value should be between 0 and 1. ${targetValue} is out of bounds.`
          );
        }

        const controlIds = Object.keys(animation.rawControls);
        const controlId = controlIds[controlIndex];
        const maxSteps = animation.rawControls[controlId].steps.length - 1;
        
        // Scale 0-1 target to actual step range
        const scaledTarget = targetValue * maxSteps;
        
        // Stop all conflicting animations
        for (const playing of playingAnimations) {
          const playingAnimation = animation.animations[playing.index];
          if (
            playingAnimation.tracks.some(
              ([controlNr]) => controlNr === controlIndex
            )
          ) {
            stopAnimation(playingAnimation.name);
          }
        }

        // Stop any existing tween for this control
        const existingTweenIndex = controlTweens.findIndex(
          (t) => t.controlIndex === controlIndex
        );
        if (existingTweenIndex !== -1) {
          controlTweens.splice(existingTweenIndex, 1);
        }

        // Create new tween
        controlTweens.push({
          controlIndex,
          startValue: controlValues[controlIndex],
          targetValue: scaledTarget,
          startTime: performance.now(),
          duration,
          easing,
          onComplete,
        });
      };

      const newAnimation: AnimationControls = {
        destroy() {
          gl.deleteShader(vs);
          gl.deleteShader(fs);
          gl.deleteProgram(program);
          gl.deleteTexture(texture);
          gl.deleteBuffer(vertexBuffer);
          gl.deleteBuffer(indexBuffer);
          animations.splice(animations.indexOf(newAnimation), 1);
        },
        setLooping(loop, track) {
          const trackIndex = nameToTrackIndex(track);
          looping[trackIndex] = loop;
        },
        startAnimation(animationName, { startAt = 0, speed = 1 } = {}) {
          const trackIndex = nameToTrackIndex(animationName);
          const animationControls = animation.animations[trackIndex].tracks.map(
            ([controlNr]) => controlNr
          );

          // stop all conflicting tracks
          for (const playing of playingAnimations) {
            const playingAnimation = animation.animations[playing.index];
            if (
              playingAnimation.tracks.some(([controlNr]) =>
                animationControls.includes(controlNr)
              )
            ) {
              stopAnimation(playingAnimation.name);
            }
          }

          playingAnimations.push({
            name: animationName,
            index: trackIndex,
            startAt,
            speed,
            startedAt: +new Date(),
            iterationStartedAt: +new Date() - startAt / speed,
            lastRender: 0,
          });
        },
        stopAnimation,
        setControlValue,
        tweenControlTo,
        getControlValue: (controlName) =>
          controlValues[nameToControlIndex(controlName)],
        setPanning(newPanX, newPanY) {
          panX = newPanX;
          panY = newPanY;
        },
        setZoom(newZoom) {
          zoom = newZoom;
        },
        setZIndex(newZIndex) {
          zIndex = newZIndex;
        },
        render() {
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          gl.vertexAttribPointer(
            aCoord,
            2,
            gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * 4,
            /* offset */ 0
          );
          gl.enableVertexAttribArray(aCoord);
          gl.vertexAttribPointer(
            aTexCoord,
            2,
            gl.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT * 4,
            /* offset */ 2 * Float32Array.BYTES_PER_ELEMENT
          );
          gl.enableVertexAttribArray(aTexCoord);

          if (element.width !== cWidth || element.height !== cHeight) {
            const canvasWidth = element.width;
            const canvasHeight = element.height;
            const landscape =
              image.width / canvasWidth > image.height / canvasHeight;

            scale = landscape
              ? canvasWidth / image.width
              : canvasHeight / image.height;

            gl.uniform2f(uViewport, canvasWidth, canvasHeight);

            basePosition = [canvasWidth / 2 / scale, canvasHeight / 2 / scale];
            cWidth = element.width;
            cHeight = element.height;
          }

          gl.uniform4f(uScale, scale, zoom, panX, panY);

          gl.activeTexture(unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(gl.getUniformLocation(program, "uSampler"), textureUnit);

          gl.uniform3f(
            uBasePosition,
            basePosition[0],
            basePosition[1],
            zIndex * 0.01
          );

          const now = +new Date();
          
          // Process control tweens
          const completedTweens: number[] = [];
          for (let i = 0; i < controlTweens.length; i++) {
            const tween = controlTweens[i];
            const elapsed = performance.now() - tween.startTime;
            const progress = Math.min(elapsed / tween.duration, 1);
            
            if (progress >= 1) {
              // Tween complete
              controlValues[tween.controlIndex] = tween.targetValue;
              renderControlValues[tween.controlIndex] = tween.targetValue;
              completedTweens.push(i);
              
              // Trigger completion callback if provided
              if (tween.onComplete) {
                tween.onComplete();
              }
            } else {
              // Apply easing and interpolate
              const easedProgress = applyEasing(progress, tween.easing);
              const currentValue = mix(tween.startValue, tween.targetValue, easedProgress);
              controlValues[tween.controlIndex] = currentValue;
              renderControlValues[tween.controlIndex] = currentValue;
            }
          }
          
          // Remove completed tweens (reverse order to maintain indices)
          for (let i = completedTweens.length - 1; i >= 0; i--) {
            controlTweens.splice(completedTweens[i], 1);
          }
          
          // Update mutations for any controls changed by tweens
          if (controlTweens.length > 0) {
            const controlIds = Object.keys(animation.rawControls);
            for (const tween of controlTweens) {
              const mutationUpdates = interpolateControlStep(
                animation.rawControls,
                animation.rawMutations,
                controlIds,
                tween.controlIndex,
                renderControlValues[tween.controlIndex]
              );
              
              for (const [mutationId, mutationValue] of Object.entries(mutationUpdates)) {
                const mutationIndex = animation.mutatorMapping[mutationId];
                if (mutationIndex !== undefined) {
                  animation.mutationValues.data[mutationIndex * 2] = mutationValue[0];
                  animation.mutationValues.data[mutationIndex * 2 + 1] = mutationValue[1];
                }
              }
            }
          }
          
          for (const playing of playingAnimations) {
            const playTime = (now - playing.iterationStartedAt) * playing.speed;
            const playingAnimation = animation.animations[playing.index];

            const playPosition = playTime % playingAnimation.duration;

            if (playingAnimation.duration < playTime) {
              if (!looping[playing.index]) {
                stopAnimation(playingAnimation.name);
                continue;
              }
              playing.iterationStartedAt = now - playPosition;

              // Store current value as start value of next iteration
              for (const [controlIndex] of playingAnimation.tracks) {
                controlValues[controlIndex] = renderControlValues[controlIndex];
              }
            }

            for (const [time, event] of playingAnimation.events) {
              const absTime = playing.iterationStartedAt + time / playing.speed;
              if (absTime < now && absTime > playing.lastRender) {
                for (const handler of onCustomEventListeners) {
                  handler(event, playing.name, time);
                }
              }
            }
            playing.lastRender = now;

            for (const [controlIndex, track] of playingAnimation.tracks) {
              const value = interpolateFloat(
                track,
                playPosition,
                controlValues[controlIndex]
              );
              renderControlValues[controlIndex] = value;
            }

            // TODO: Process visibility tracks in Phase 2
          }
          
          // Upload mutation values to GPU (simplified - matching studio approach)
          // In Phase 2, we'll update mutation values based on control values here
          gl.uniform2fv(mutationValuesLocation, animation.mutationValues.data);

          for (let i = 0; i < animation.layers.length; i++) {
            const layer = animation.layers[i];
            // TODO: Check visibility in Phase 2
            gl.uniform3f(uTranslate, layer.x, layer.y, layer.z);
            gl.uniform1f(uMutation, layer.mutator);
            gl.drawElements(
              gl.TRIANGLES,
              layer.amount,
              gl.UNSIGNED_SHORT,
              layer.start
            );
          }
        },
        onTrackStopped(callback) {
          onTrackStoppedListeners = onTrackStoppedListeners.concat({
            animation: id,
            callback,
          });
          return () => {
            onTrackStoppedListeners = onTrackStoppedListeners.filter(
              (item) => item.callback !== callback
            );
          };
        },
        onEvent(callback) {
          onCustomEventListeners = onCustomEventListeners.concat(callback);
          return () => {
            onCustomEventListeners = onCustomEventListeners.filter(
              (item) => item !== callback
            );
          };
        },
      };
      animations.push(newAnimation);

      return newAnimation;
    },
    destroy() {
      for (const anim of animations) {
        anim.destroy();
      }
      animations.length = 0;
    },
  };
};
