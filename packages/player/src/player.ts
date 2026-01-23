import type { PreparedFloatBuffer, PreparedIntBuffer, PreparedImageDefinition, EasingFunction, PreparedControlAction } from "./types";
import animationFragmentShader from "./shaders/fragmentShader.frag";
import { animationVertexShader } from "./shaders/vertexShader";
import { applyEasing } from "./vertices";
import {
  interpolateControlStep,
  recalculateMutationValues,
} from "./lib/mutation-calculation";

// Simple linear interpolation for numbers
const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

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
   * Render the image at a specific timestamp for an animation track.
   * This will stop the specified animation and render it at the given timestamp,
   * considering looping for tracks shorter than the timestamp.
   * Does not emit events or callbacks.
   *
   * @param animationName the name of the animation track to render.
   * @param timestamp the timestamp in milliseconds to render at.
   * @throws an error if the provided trackName does not exist
   */
  renderAtTimestamp(animationName: string, timestamp: number): void;

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
   * @return value of the control in 0-1 range
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
   * Register a callback to get notifications when an animation is stopped.
   * An animation can be stopped for the following reasons.
   *
   * - A control is used that is conflicting with an animation.
   * - Another animation is started that is conflicting with an animation.
   * - An animation is stopped using `stopAnimation `
   *
   * @param callback function to call when animations are stopped.
   * The first argument will be the animation name.
   * @returns a function to call to unsubscribe
   */
  onAnimationStopped(callback: TrackStoppedCallback): Unsubscribe;

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
   * Get the logical canvas dimensions (accounting for pixel density).
   *
   * @returns object with width and height of the image canvas dimensions
   */
  getCanvasDimensions(): { width: number; height: number };

  /**
   * Reset viewport to default values (zoom and panning).
   */
  resetViewport(): void;

  /**
   * Get current viewport state.
   *
   * @returns object with current zoom, panX, and panY values
   */
  getViewport(): { zoom: number; panX: number; panY: number };

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
   * Pixel density for high-DPI displays.
   * @default window.devicePixelRatio || 1
   */
  pixelDensity?: number;
  
  /**
   * How to scale the image to fit the canvas.
   * - 'contain': letterbox/pillarbox to fit entirely (default)
   * - 'cover': fill canvas, cropping if needed
   * - 'none': no automatic scaling
   * @default 'contain'
   */
  fitMode?: 'contain' | 'cover' | 'none';
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
    throw new Error("Could not initialize shaders");
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
      
      // Calculate pixelDensity (default to devicePixelRatio)
      const pixelDensity = options?.pixelDensity ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
      
      // Get fitMode (default to 'contain')
      const fitMode = options?.fitMode ?? 'contain';
      
      // Use metadata from animation as defaults, merged with provided options
      // For zoom: if fitMode is 'none', use metadata zoom; otherwise start at 1 (auto-fit will handle scaling)
      const animationDefaults: AnimationOptions = {
        zoom: fitMode === 'none' ? animation.metadata.zoom : 1,
        panX: animation.metadata.pan[0],
        panY: animation.metadata.pan[1],
        zIndex: 0,
        pixelDensity,
        fitMode,
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
      
      // Save a copy of defaultFrame values for recalculation
      const defaultFrameValues = new Float32Array(animation.mutationValues.data);
      
      // Initialize control values
      const controlValues = new Float32Array(animation.defaultControlValues);
      const renderControlValues = new Float32Array(animation.defaultControlValues);

      // Dirty tracking for performance optimization
      // Track which controls have changed to avoid unnecessary recalculation
      const controlChangeFlags = new Uint8Array(controlValues.length); // 0 = unchanged, 1 = changed
      const lastControlValues = new Float32Array(controlValues.length);
      lastControlValues.set(controlValues); // Initialize with current values

      // Calculate initial mutation values from defaultFrame + control values
      recalculateMutationValues(
        animation.mutationValues.data,
        controlValues,
        animation.rawControls,
        animation.rawMutations,
        animation.mutatorMapping,
        defaultFrameValues
      );

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

      const animationOptions = { ...animationDefaults, ...options };
      let { zoom, panX, panY, zIndex } = animationOptions;
      let basePosition = [0, 0];
      let scale = 1.0;

      const playingAnimations: PlayStatus[] = [];
      const looping: boolean[] = animation.animations.map((a) => a.looping);
      
      // Track layer visibility (all visible by default)
      const layerVisibility: boolean[] = animation.layers.map(() => true);

      const stopAnimation = (track: string): void => {
        // Remove from playing list
        const playingIndex = playingAnimations.findIndex(
          (e) => e.name === track
        );
        if (playingIndex === -1) return;
        const playing = playingAnimations[playingIndex];

        const playingAnimation = animation.animations[playing.index];
        playingAnimations.splice(playingIndex, 1);

        // Place current active control values in control values list
        // (preserve values when animation stops)
        for (const track of playingAnimation.tracks) {
          controlValues[track.controlIndex] = renderControlValues[track.controlIndex];
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
        
        // Stop all conflicting animations
        for (const playing of playingAnimations) {
          const playingAnimation = animation.animations[playing.index];
          if (
            playingAnimation.tracks.some(
              (track) => track.controlIndex === controlIndex
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

        controlValues[controlIndex] = scaledValue;
        renderControlValues[controlIndex] = scaledValue;
        
        // Mark control as dirty for recalculation
        controlChangeFlags[controlIndex] = 1;
        
        // Recalculate all mutation values from defaultFrame + all control values
        recalculateMutationValues(
          animation.mutationValues.data,
          renderControlValues,
          animation.rawControls,
          animation.rawMutations,
          animation.mutatorMapping,
          defaultFrameValues
        );
        
        // Clear dirty flags after recalculation
        controlChangeFlags.fill(0);
        lastControlValues.set(renderControlValues);
        
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
              (track) => track.controlIndex === controlIndex
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
            (track) => track.controlIndex
          );
          const playSpeed = speed * animation.animations[trackIndex].speed;

          // Stop all conflicting animations and tweens
          for (const playing of playingAnimations) {
            const playingAnimation = animation.animations[playing.index];
            if (
              playingAnimation.tracks.some((track) =>
                animationControls.includes(track.controlIndex)
              )
            ) {
              stopAnimation(playingAnimation.name);
            }
          }
          
          // Stop any conflicting tweens
          for (const controlIndex of animationControls) {
            const existingTweenIndex = controlTweens.findIndex(
              (t) => t.controlIndex === controlIndex
            );
            if (existingTweenIndex !== -1) {
              controlTweens.splice(existingTweenIndex, 1);
            }
          }

          playingAnimations.push({
            name: animationName,
            index: trackIndex,
            startAt,
            speed: playSpeed,
            startedAt: +new Date(),
            iterationStartedAt: +new Date() - startAt / playSpeed,
            lastRender: 0,
          });
        },
        stopAnimation,
        setControlValue,
        tweenControlTo,
        renderAtTimestamp(animationName: string, timestamp: number) {
          const trackIndex = nameToTrackIndex(animationName);
          const playingAnimation = animation.animations[trackIndex];
          
          const playSpeed =  animation.animations[trackIndex].speed;
          // Stop the animation if it's currently playing
          const playingIndex = playingAnimations.findIndex(
            (p) => p.index === trackIndex
          );
          if (playingIndex !== -1) {
            playingAnimations.splice(playingIndex, 1);
          }
          
          // Process each track at the given timestamp
          for (const track of playingAnimation.tracks) {
            // Track position wraps at track.length (handles looping)
            const trackPosition = (timestamp * playSpeed) % track.length;
            
            // Find active action at the timestamp
            let activeAction: PreparedControlAction | null = null;
            let lastCompletedAction: PreparedControlAction | null = null;
            
            for (const action of track.actions) {
              if (trackPosition >= action.start && trackPosition < action.start + action.duration) {
                activeAction = action;
                break;
              }
              if (trackPosition >= action.start + action.duration) {
                lastCompletedAction = action;
              }
            }
            
            if (activeAction) {
              // Calculate progress within this action
              const actionProgress = (trackPosition - activeAction.start) / activeAction.duration;
              const easedProgress = applyEasing(actionProgress, activeAction.easingFunction);
              
              // Determine start value
              let startValue: number;
              if (activeAction.controlStartValue !== undefined) {
                startValue = activeAction.controlStartValue;
              } else {
                // Find the previous action's end value
                let previousActionEndValue: number | undefined;
                for (const action of track.actions) {
                  if (action.start + action.duration === activeAction.start) {
                    previousActionEndValue = action.controlEndValue;
                    break;
                  }
                }
                startValue = previousActionEndValue !== undefined 
                  ? previousActionEndValue 
                  : controlValues[track.controlIndex];
              }
              
              // Interpolate from start to end
              const interpolatedValue = mix(startValue, activeAction.controlEndValue, easedProgress);
              controlValues[track.controlIndex] = interpolatedValue;
              renderControlValues[track.controlIndex] = interpolatedValue;
            } else if (lastCompletedAction) {
              // No active action - hold at the end value of the last completed action
              controlValues[track.controlIndex] = lastCompletedAction.controlEndValue;
              renderControlValues[track.controlIndex] = lastCompletedAction.controlEndValue;
            }
          }
          
          // Recalculate mutation values based on new control values
          recalculateMutationValues(
            animation.mutationValues.data,
            renderControlValues,
            animation.rawControls,
            animation.rawMutations,
            animation.mutatorMapping,
            defaultFrameValues
          );
          
          // Update last control values
          lastControlValues.set(renderControlValues);
          
          // Upload to GPU
          gl.useProgram(program);
          gl.uniform2fv(mutationValuesLocation, animation.mutationValues.data);
        },
        getControlValue: (controlName) => {
          const controlIndex = nameToControlIndex(controlName);
          const controlIds = Object.keys(animation.rawControls);
          const controlId = controlIds[controlIndex];
          const maxSteps = animation.rawControls[controlId].steps.length - 1;
          // Return value in 0-1 range (scale from step range)
          return controlValues[controlIndex] / maxSteps;
        },
        setPanning(newPanX, newPanY) {
          panX = newPanX;
          panY = newPanY;
          animationOptions.panX = newPanX;
          animationOptions.panY = newPanY;
        },
        setZoom(newZoom) {
          zoom = newZoom;
          animationOptions.zoom = newZoom;
          // Force recalculation of basePosition on next render
          cWidth = 0;
          cHeight = 0;
        },
        setZIndex(newZIndex) {
          zIndex = newZIndex;
          animationOptions.zIndex = newZIndex;
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
            const pixelDensity = animationOptions.pixelDensity || 1;
            const fitMode = animationOptions.fitMode || 'contain';
            
            // Calculate logical canvas dimensions (accounting for pixel density)
            const canvasWidth = element.width / pixelDensity;
            const canvasHeight = element.height / pixelDensity;
            
            // Use metadata dimensions for image size (not texture dimensions)
            const imageWidth = animation.metadata.width;
            const imageHeight = animation.metadata.height;
            
            // Calculate scale based on fitMode
            const scaleX = canvasWidth / imageWidth;
            const scaleY = canvasHeight / imageHeight;
            
            if (fitMode === 'contain') {
              // Letterbox/pillarbox - use smaller scale to fit entirely
              scale = Math.min(scaleX, scaleY);
            } else if (fitMode === 'cover') {
              // Fill canvas - use larger scale, may crop
              scale = Math.max(scaleX, scaleY);
            } else {
              // 'none' - no auto-scaling
              scale = 1;
            }

            gl.uniform2f(uViewport, canvasWidth, canvasHeight);

            cWidth = element.width;
            cHeight = element.height;
          }

          // Always recalculate basePosition with current zoom (for center-based zooming)
          const combinedScale = scale * zoom;
          const pixelDensity = animationOptions.pixelDensity || 1;
          basePosition = [element.width / pixelDensity / 2 / combinedScale, element.height / pixelDensity / 2 / combinedScale];
          
          // Calculate scissor rectangle based on metadata bounds (clip to logical image area)
          const canvasWidth = element.width / pixelDensity;
          const canvasHeight = element.height / pixelDensity;
          
          // Image dimensions in logical space
          const imageWidth = animation.metadata.width;
          const imageHeight = animation.metadata.height;
          
          // Calculate rendered image dimensions in canvas pixels
          const renderedWidth = imageWidth * combinedScale * pixelDensity;
          const renderedHeight = imageHeight * combinedScale * pixelDensity;
          
          // Calculate position accounting for pan (pan is in clip space: -1 to +1 represents full viewport)
          // panX/panY are added in clip space, where ±1 = full viewport width/height
          const centerX = (canvasWidth / 2 + panX * canvasWidth / 2) * pixelDensity;
          const centerY = (canvasHeight / 2 - panY * canvasHeight / 2) * pixelDensity;
          
          // Scissor rectangle (x, y from bottom-left corner in GL coordinates)
          let scissorX = Math.round(centerX - renderedWidth / 2);
          let scissorY = Math.round(element.height - centerY - renderedHeight / 2);
          let scissorWidth = Math.round(renderedWidth);
          let scissorHeight = Math.round(renderedHeight);
          
          // Clamp scissor to canvas bounds (gl.scissor doesn't auto-clip negative values)
          if (scissorX < 0) {
            scissorWidth += scissorX;
            scissorX = 0;
          }
          if (scissorY < 0) {
            scissorHeight += scissorY;
            scissorY = 0;
          }
          scissorWidth = Math.max(Math.min(scissorWidth, element.width - scissorX ), 0);
          scissorHeight = Math.max(Math.min(scissorHeight, element.height - scissorY), 0);
          
          // Apply scissor test to clip to image bounds
          gl.enable(gl.SCISSOR_TEST);
          gl.scissor(scissorX, scissorY, scissorWidth, scissorHeight);
          
          // Apply auto-fit scale and user zoom together
          gl.uniform4f(uScale, combinedScale, 1.0, panX, panY);

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
            const animationTime = (now - playing.iterationStartedAt) * playing.speed;
            const playingAnimation = animation.animations[playing.index];

            // Check if animation should stop (non-looping and reached end)
            if (playingAnimation.duration < animationTime) {
              if (!looping[playing.index]) {
                stopAnimation(playingAnimation.name);
                continue;
              }
              // Reset iteration start time for next loop
              playing.iterationStartedAt = now;

              // Store current values as start values for next iteration
              for (const track of playingAnimation.tracks) {
                controlValues[track.controlIndex] = renderControlValues[track.controlIndex];
              }
            }

            // Process events
            for (const [time, event] of playingAnimation.events) {
              const absTime = playing.iterationStartedAt + time / playing.speed;
              if (absTime < now && absTime > playing.lastRender) {
                for (const handler of onCustomEventListeners) {
                  handler(event, playing.name, time);
                }
              }
            }
            playing.lastRender = now;

            // Process each track (each track loops independently)
            for (const track of playingAnimation.tracks) {
              // Track position wraps at track.length (independent per-track looping)
              const trackPosition = animationTime % track.length;
              
              // Find active action at current track position
              let activeAction: PreparedControlAction | null = null;
              let lastCompletedAction: PreparedControlAction | null = null;
              
              for (const action of track.actions) {
                if (trackPosition >= action.start && trackPosition < action.start + action.duration) {
                  activeAction = action;
                  break;
                }
                // Track the most recent completed action
                if (trackPosition >= action.start + action.duration) {
                  lastCompletedAction = action;
                }
              }
              
              if (activeAction) {
                // Calculate progress within this action
                const actionProgress = (trackPosition - activeAction.start) / activeAction.duration;
                const easedProgress = applyEasing(actionProgress, activeAction.easingFunction);
                
                // Determine start value
                // If controlStartValue is defined, use it. Otherwise, find what value to use:
                // - If we're at the very start of the action, use the previous action's end value
                // - Otherwise use the control value from the previous frame (stored in controlValues)
                let startValue: number;
                if (activeAction.controlStartValue !== undefined) {
                  startValue = activeAction.controlStartValue;
                } else {
                  // Find the previous action's end value
                  let previousActionEndValue: number | undefined;
                  for (const action of track.actions) {
                    if (action.start + action.duration === activeAction.start) {
                      previousActionEndValue = action.controlEndValue;
                      break;
                    }
                  }
                  // If we found a previous action, use its end value, otherwise use current control value
                  startValue = previousActionEndValue !== undefined 
                    ? previousActionEndValue 
                    : controlValues[track.controlIndex];
                }
                
                // Interpolate from start to end
                const interpolatedValue = mix(startValue, activeAction.controlEndValue, easedProgress);
                renderControlValues[track.controlIndex] = interpolatedValue;
              } else if (lastCompletedAction) {
                // No active action - hold at the end value of the last completed action
                renderControlValues[track.controlIndex] = lastCompletedAction.controlEndValue;
              }
              // If no actions at all, keep the control at its current value
            }

            // Process visibility tracks
            for (const [layerIndex, actions] of playingAnimation.visibilityTracks.entries()) {
              // Find the most recent visibility action at current animation time
              let currentVisibility: boolean | undefined;
              for (const [time, visible] of actions) {
                if (animationTime >= time) {
                  currentVisibility = visible;
                } else {
                  break; // Actions are ordered by time
                }
              }
              if (currentVisibility !== undefined) {
                layerVisibility[layerIndex] = currentVisibility;
              }
            }
          }
          
          // Check if any controls have changed since last render
          let hasChanges = false;
          for (let i = 0; i < renderControlValues.length; i++) {
            if (renderControlValues[i] !== lastControlValues[i]) {
              controlChangeFlags[i] = 1;
              hasChanges = true;
            }
          }
          
          // Update mutation values only if any controls changed (animations or tweens)
          if (hasChanges) {
            recalculateMutationValues(
              animation.mutationValues.data,
              renderControlValues,
              animation.rawControls,
              animation.rawMutations,
              animation.mutatorMapping,
              defaultFrameValues
            );
            
            // Clear dirty flags and update last values
            controlChangeFlags.fill(0);
            lastControlValues.set(renderControlValues);
          }
          
          // Upload mutation values to GPU
          gl.uniform2fv(mutationValuesLocation, animation.mutationValues.data);

          for (let i = 0; i < animation.layers.length; i++) {
            const layer = animation.layers[i];
            // Skip invisible layers
            if (!layerVisibility[i]) continue;
            
            gl.uniform3f(uTranslate, layer.x, layer.y, layer.z);
            gl.uniform1f(uMutation, layer.mutator);
            gl.drawElements(
              gl.TRIANGLES,
              layer.amount,
              gl.UNSIGNED_SHORT,
              layer.start
            );
          }
          
          // Disable scissor test after rendering
          gl.disable(gl.SCISSOR_TEST);
        },
        onAnimationStopped(callback) {
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
        getCanvasDimensions() {
          return {
            width: animation.metadata.width,
            height: animation.metadata.height,
          };
        },
        resetViewport() {
          animationOptions.zoom = animation.metadata.zoom;
          animationOptions.panX = animation.metadata.pan[0];
          animationOptions.panY = animation.metadata.pan[1];
        },
        getViewport() {
          return {
            zoom: animationOptions.zoom,
            panX: animationOptions.panX,
            panY: animationOptions.panY,
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
