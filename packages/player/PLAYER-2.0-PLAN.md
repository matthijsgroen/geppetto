# Plan: Player 2.0 - Port Studio Rendering with Animation Support

This plan documents the approach for updating the Geppetto player to support format 2.0 by porting the proven rendering implementation from the studio application.

## Background

The player currently has a broken implementation attempting to support format 2.0. The studio's composition renderer (`showComposition.ts`) correctly handles format 2.0 files with a simpler, proven approach. This plan outlines porting that implementation to the player, adding animation playback, and optimizing for performance.

## Approach Summary

1. **Port first, optimize later** - Establish correctness before performance
2. **Pre-process for runtime** - Prepare data structures at load time for fast rendering
3. **Add validation** - Validate format 2.0 structure to catch errors early
4. **Remove format 1.x support** - Focus exclusively on format 2.0
5. **Manual demo validation** - Use visual testing via demo page initially

---

## Phase 1: Port Studio Composition Rendering ✅ COMPLETE

### Goal

Replace broken player rendering with studio's proven approach from `showComposition.ts`.

**Status**: Complete - Demo renders correctly with all mutations applied

### Tasks

#### 1.1 Port Mutation Chain Algorithm

**Files**: `src/prepareAnimation.ts`

- Copy `createShapeMutationList` logic from `packages/studio/src/infrastructure/webgl/programs/utils.ts`
- Use `visitHierarchy` + `getPreviousOfType` for correct mutation traversal
- Build mutation vector array: `Vec4[]` where each element is `[type, ...params]`
- Build parent chain: `Int32Array` where each index points to parent mutation (-1 for root)
- Map layers to their mutation chains via hierarchy traversal

**Expected output structure**:

```typescript
{
  mutators: Vec4[],              // Mutation definitions
  mutatorParents: Int32Array,    // Parent indices
  elements: PreparedLayer[]      // Layer metadata with mutation indices
}
```

#### 1.2 Simplify Uniform Structure

**Files**: `src/prepareAnimation.ts`, `src/player.ts`

Remove complex control interpolation from shaders:

- Remove: `uControlMutIndices`, `uMutValueIndices`, `uControlMutValues` uniforms
- Keep only: `uMutVectors`, `uMutParent`, `uMutValues`
- Mutation values will be updated from JavaScript (like studio), not computed in shader

#### 1.3 Port Studio Shaders

**Files**: `src/shaders/vertexShader.ts`, `src/shaders/fragmentShader.frag`

- Copy vertex shader from `packages/studio/src/infrastructure/webgl/shaders/vertexShader.ts`
- Copy fragment shader from `packages/studio/src/infrastructure/webgl/shaders/fragmentShader.ts`
- Adapt to player's context (remove studio-specific editor features if any)
- Ensure `mutatePoint` function matches studio's mutation application logic

**Key shader functions**:

- `mutatePoint(point, mutatorIndex)` - Walks parent chain, applies transformations
- `mutateOnce(point, mutation, value)` - Applies single mutation (translate, rotate, deform, etc.)

#### 1.4 Update WebGL Setup

**Files**: `src/player.ts`

- Simplify uniform uploads in `addAnimation()`:
  - Upload `uMutVectors` (mutation definitions) once at initialization
  - Upload `uMutParent` (parent chain) once at initialization
  - Upload `uMutValues` (current values) before each render
- Remove direct control uniform uploads
- Update shader compilation to use new vertex/fragment shaders

### Validation Criteria

- [x] Demo renders visible layers (no black screen)
- [x] Mutation chains apply correctly (waterwheel tilt, sky gradient visible)
- [x] Z-ordering works (layers render in correct order)
- [x] No WebGL errors in console

**Result**: All validation criteria met. Demo at http://localhost:8181 shows correct rendering.

---

## Phase 1.5: Control Tweening ✅ COMPLETE

### Goal

Add ability to animate control values from current to target over time with easing functions. This establishes the easing/timing infrastructure needed for full animation playback.

**Status**: Complete

### Tasks

#### 1.5.1 Add Easing Function Support

**Files**: `src/vertices.ts` (already has easing infrastructure)

Use existing easing functions:

- `linear` - No easing
- `easeIn` - Quadratic ease in
- `easeOut` - Quadratic ease out
- `easeInOut` - Quadratic ease in and out

#### 1.5.2 Add Control Tween State Management

**Files**: `src/player.ts`

Track ongoing control tweens per animation:

```typescript
type ControlTween = {
  controlIndex: number;
  startValue: number;
  targetValue: number;
  startTime: number;
  duration: number;
  easing: EasingFunction;
  onComplete?: () => void;
};
```

#### 1.5.3 Implement tweenControlTo API

**Files**: `src/player.ts`, `src/types.ts`

Add to `AnimationControls` type:

```typescript
tweenControlTo(
  controlName: string,
  targetValue: number,
  duration: number,
  options?: {
    easing?: EasingFunction;
    onComplete?: () => void;
  }
): void;
```

Implementation:

- Validate control name and target value (0-1 range)
- Stop any conflicting animations
- Stop any existing tween for this control
- Create new tween entry with start time = `performance.now()`

#### 1.5.4 Update Control Values Each Frame

**Files**: `src/player.ts`

In `render()` function:

- Get current time with `performance.now()`
- For each active tween:
  - Calculate elapsed = (now - startTime) / duration
  - If elapsed >= 1: set to target, remove tween, trigger callback
  - Else: apply easing to elapsed, interpolate value, update control
- Use internal mutation update logic to apply changes

#### 1.5.5 Update Demo UI

**Files**: `demo/index.html`, `demo/main.js`

Add tween test UI:

- Add "Tween to Day" and "Tween to Night" buttons for Light control
- Add easing function selector (linear, easeIn, easeOut, easeInOut)
- Add duration input (default 1000ms)
- Show "Tweening..." indicator when active
- Display completion status when tween finishes

```javascript
tweenToDayBtn.addEventListener('click', () => {
  animationControls.tweenControlTo('Light', 0, duration, {
    easing: selectedEasing,
    onComplete: () => console.log('Tween to day complete')
  });
});
```

### Validation Criteria

- [x] Easing functions work correctly (visual smoothness)
- [x] Controls tween smoothly to target values
- [x] Multiple simultaneous tweens work without conflicts
- [x] Tweens can be interrupted by new tweens or animations
- [x] Completion callbacks fire at correct time
- [x] Demo UI allows testing all easing functions
- [x] Completion indicator shows when tween finishes

**Result**: All validation criteria met. Demo at http://localhost:8181 shows smooth control transitions with all easing functions working correctly.

---

## Phase 2: Implement Animation Playback ✅ COMPLETE

### Goal

Add animation playback system to update mutation values over time.

**Status**: Complete - All format 2.x animation features working correctly

### Tasks

#### 2.1 Understanding Format 2.x Animation System

**Key Concepts:**

Format 2.x animations differ significantly from 1.x:

1. **Animation Structure**: An animation is a **collection of independent tracks**, not a single timeline
2. **Track Types**:
   - `AnimationControlTrack` - Controls a specific control value over time
   - `AnimationVisibilityTrack` - Controls layer visibility over time
3. **Per-Track Looping**: Each track has its own `length` property and **loops independently**
   - Example: Wheel blades (short loop: 500ms) + Full wheel rotation (long loop: 3000ms)
   - This creates complex layered animations without duplicating keyframes
4. **Animation Duration**: The animation object has an overall duration, but each track loops at its own length
5. **Frame Actions**: Each track contains `actions` array:
   - `FrameControlAction`: `{start, duration, easingFunction, controlEndValue, controlStartValue?}`
   - `FrameLayerVisibilityAction`: `{start, visible}`
6. **Start Value Handling**:
   - If `controlStartValue` is defined: interpolate from **start value → end value**
   - If `controlStartValue` is undefined: interpolate from **current control value → end value**
   - This allows smooth transitions when animations start mid-control-state
7. **Events**: `FrameEvent[]` can trigger at specific times for synchronization (e.g., sound effects)

**Data Structure** (from geppetto-types):

```typescript
type Animation = {
  name: string;
  looping: boolean;           // Animation-level loop setting
  tracks: AnimationTrack[];   // Independent tracks (control + visibility)
  events: FrameEvent[];       // Timed events for synchronization
};

type AnimationControlTrack = {
  type: "control";
  controlId: string;
  actions: FrameControlAction[];  // Keyframes with start/end values
  length: number;                 // Track loops at this duration
};

type FrameControlAction = {
  start: number;              // Start time in ms
  duration: number;           // Action duration
  easingFunction: EasingFunction;
  controlEndValue: number;
  controlStartValue?: number; // If undefined, use current control value
};
```

#### 2.2 Track Playback System

**Files**: `src/player.ts`

Implement per-track playback:

- For each playing animation:
  - Track animation start time and overall playback position
  - For each track in the animation:
    - Calculate track position: `playPosition % track.length` (independent looping)
    - Find active action(s) at current track position
    - Interpolate control value based on action's easing and start/end values
    - Handle `controlStartValue` vs current control value
- Update `renderControlValues` array with interpolated values
- Call `interpolateControlStep()` to convert control values → mutation values

**Track Position Calculation:**

```typescript
// Animation plays from startTime
const animationTime = (now - animation.startedAt) * speed;

// Each track loops independently
for (const track of animation.tracks) {
  const trackPosition = animationTime % track.length;

  // Find active action at trackPosition
  const action = findActiveAction(track.actions, trackPosition);

  if (action) {
    const actionProgress = (trackPosition - action.start) / action.duration;
    const easedProgress = applyEasing(actionProgress, action.easingFunction);

    // Determine start value
    const startValue = action.controlStartValue ?? currentControlValue;
    const interpolatedValue = mix(startValue, action.controlEndValue, easedProgress);

    renderControlValues[controlIndex] = interpolatedValue;
  }
}
```

#### 2.3 Event System

**Files**: `src/player.ts`

Process animation events:

- Track last render time per animation
- For each event in animation.events:
  - Check if event time falls between lastRender and now
  - Trigger `onEvent` callbacks with `(eventName, animationName, eventTime)`
- Used for synchronizing sound effects, game logic, etc.

#### 2.4 Control Start Value Handling

#### 2.4 Control Start Value Handling

**Files**: `src/player.ts`

Implement proper start value logic:

```typescript
// When action starts
if (action.controlStartValue !== undefined) {
  // Explicit start value - interpolate from start to end
  startValue = action.controlStartValue;
} else {
  // No start value - interpolate from current control value
  // This allows smooth transitions when animation starts mid-state
  startValue = controlValues[controlIndex]; // Value at animation start
}

const interpolatedValue = mix(startValue, action.controlEndValue, easedProgress);
```

**Example Use Case:**

- User tweens Light control to 0.5 (daytime)
- Animation starts that animates Light from undefined → 1.0 (night)
- Animation smoothly transitions from current 0.5 → 1.0 (no jump)

#### 2.5 Mutation Value Updates

**Files**: `src/player.ts`

After all tracks update `renderControlValues`:

- For each control that changed:
  - Call `interpolateControlStep()` to calculate mutation values
  - Update `animation.mutationValues.data` array
- Upload to GPU with `gl.uniform2fv(mutationValuesLocation, ...)`

(Already implemented in render loop - verify it works correctly with animations)

### Validation Criteria

- [x] Animations play smoothly (60fps)
- [x] Per-track looping works correctly (different track lengths loop independently)
- [x] Control start values work: undefined uses current value, defined uses explicit value
- [x] Frame actions interpolate correctly with easing functions
- [x] Action chaining works smoothly (no feedback loops)
- [x] Events trigger at correct times
- [x] Multiple animations can play simultaneously
- [x] Manual control values work (via `setControlValue` and `tweenControlTo`)
- [x] Animations stop conflicting manual controls/tweens
- [x] Visibility tracks control layer rendering
- [x] Mutation values recalculate correctly (matches studio algorithm)
- [x] User API normalized to 0-1 range, internal uses step scale

**Result**: All validation criteria met. Animation playback works correctly with:

- Per-track independent looping (e.g., wheel blades at 500ms, full wheel at 3000ms)
- Proper action chaining using previous action's end value when controlStartValue is undefined
- Smooth transitions with all easing functions
- Correct mutation value calculation matching studio's full recalculation approach
- Three water bubbles moving continuously in perfect loops

**Implementation Details:**

1. **Type System Updates** (`types.ts`):
   - Added `PreparedControlAction` with full action details
   - Added `PreparedControlTrack` with track-specific looping
   - Updated `PreparedAnimation` structure

2. **Animation Preparation** (`prepareAnimation.ts`):
   - Preserves format 2.x action structure (no conversion to Float32Array)
   - Maintains track.length for independent looping
   - Captures events from animation data

3. **Player Updates** (`player.ts`):
   - Added `mergeMutationValue()` - Type-specific merge logic (multiply/add/first-wins)
   - Added `recalculateMutationValues()` - Full recalculation from defaultFrame + controls
   - Updated animation playback with per-track looping
   - Fixed action chaining to use previous action's end value
   - Added visibility track processing
   - Updated `setControlValue`, `tweenControlTo`, `getControlValue` to use 0-1 user API
   - Internal values remain in step scale for animation compatibility

4. **Key Bug Fixes**:
   - Mutation calculation changed from incremental to full recalculation (matches studio)
   - Fixed merge logic argument order and skip conditions
   - Fixed action chaining to prevent feedback loops
   - Normalized user API to 0-1 range while keeping internal step scale

---

## Phase 2.5: Refactor for Testability ✅ COMPLETE

### Goal

Extract complex animation logic into testable pure functions before continuing with Phase 3 validation.

**Status**: Complete - Mutation calculation module extracted with comprehensive tests + Canvas settings API implemented

### Tasks

#### 2.5.1 Extract Mutation Calculation Module (Part A) ✅

**Files**: `src/lib/mutation-calculation.ts`, `src/lib/mutation-calculation.spec.ts`

Extracted pure functions:

- `mergeMutationValue()` - Type-specific value merging (multiply/add/first-wins)
- `interpolateControlStep()` - Control step interpolation with hue wrapping
- `recalculateMutationValues()` - Full mutation recalculation from defaults + controls

**Test Coverage**: 36 comprehensive test cases covering:

- All mutation types (multiplicative, additive, first-wins)
- Edge cases (zero values, defaults, missing mutations)
- Hue wrapping for colorize mutations
- Integer and fractional step interpolation
- Multiple control interactions
- Mutation merge order verification

**Benefits**:

- Logic can be tested independently of WebGL/DOM
- Tests survive future refactoring/optimization
- Clear function contracts and behavior documentation

#### 2.5.2 Canvas Settings API (Part B) ✅

**Files**: `src/player.ts`, `demo/main.js`

Added canvas rendering controls:

- `pixelDensity?: number` - Retina/high-DPI support (default: `window.devicePixelRatio`)
- `fitMode?: 'contain' | 'cover' | 'none'` - Auto-scaling behavior (default: `'contain'`)
- `getCanvasDimensions()` - Returns metadata width/height
- `resetViewport()` - Resets zoom/pan to metadata defaults
- `getViewport()` - Returns current zoom/pan state

**Implementation Details**:

- Auto-fit scaling based on fitMode (contain/cover/none)
- Center-based zooming (recalculates basePosition on zoom change)
- Viewport clipping via scissor test (clips to metadata bounds)
- Proper pan tracking in clip space coordinates
- Retina support through canvas physical size adjustment

**Validation**:

- ✅ Image scales to fit canvas automatically
- ✅ Sharp rendering on retina displays
- ✅ Zoom scales from center point
- ✅ Elements clipped to metadata bounds (smoke/clouds stay within image area)
- ✅ Scissor rectangle follows pan/zoom correctly

**Build Size**: 58.82 kB

---

## Phase 3: Validate Format 2.0 Input ⏭️ NEXT PHASE

### Goal

Add validation to catch malformed format 2.0 files early using Zod schemas from `@geppetto/types`.

### Tasks

#### 3.1 Use Existing Zod Schema

**Files**: `src/prepareAnimation.ts`

The `@geppetto/types` package already provides comprehensive Zod validation via `geppettoImageSchema`:

```typescript
import { geppettoImageSchema } from "@geppetto/types";

export const prepareAnimation = (image: GeppettoImage, ...): PreparedImageDefinition => {
  // Validate input at entry point
  const validationResult = geppettoImageSchema.safeParse(image);

  if (!validationResult.success) {
    throw new Error(
      `Invalid GeppettoImage format:\n${validationResult.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`
    );
  }

  // Continue with preparation...
};
```

**What Zod validates automatically:**

- ✓ Version is 2.x format
- ✓ Required fields exist (`layerHierarchy`, `layers`, `mutations`, `controls`, `animations`, etc.)
- ✓ Mutation types are valid (translate, deform, stretch, rotate, opacity, lightness, saturation, colorize)
- ✓ Animation tracks have correct structure
- ✓ Easing functions are valid (`linear`, `easeIn`, `easeOut`, `easeInOut`)
- ✓ Layer points are `Vec2[]` arrays
- ✓ Control steps are keyframes
- ✓ Events have required fields

#### 3.2 Add Custom Validation

**Files**: `src/prepareAnimation.ts`

Add checks for relationships that Zod can't validate:

```typescript
// After Zod validation passes...

// 1. Validate hierarchy has no circular references
const visitedNodes = new Set<string>();
const validateHierarchy = (nodeId: string, ancestors: Set<string>) => {
  if (ancestors.has(nodeId)) {
    throw new Error(
      `Circular reference in hierarchy: ${[...ancestors, nodeId].join(" -> ")}`
    );
  }
  if (visitedNodes.has(nodeId)) return;
  visitedNodes.add(nodeId);

  const node = image.layerHierarchy[nodeId];
  if (node.children) {
    const newAncestors = new Set([...ancestors, nodeId]);
    node.children.forEach((childId) => validateHierarchy(childId, newAncestors));
  }
};
validateHierarchy("root", new Set());

// 2. Validate animation track references
for (const [animId, animation] of Object.entries(image.animations)) {
  for (const track of animation.tracks) {
    if (track.type === "control") {
      if (!image.controls[track.controlId]) {
        throw new Error(
          `Animation "${animation.name}" references non-existent control ID: ${track.controlId}`
        );
      }
    } else if (track.type === "visibility") {
      if (!image.layers[track.layerId]) {
        throw new Error(
          `Animation "${animation.name}" references non-existent layer ID: ${track.layerId}`
        );
      }
    }
  }
}
```

#### 3.3 Make Validation Optional (Production Build)

**Files**: `src/prepareAnimation.ts`

Allow skipping validation in production for performance:

```typescript
const SKIP_VALIDATION = process.env.NODE_ENV === "production";

if (!SKIP_VALIDATION) {
  const validationResult = geppettoImageSchema.safeParse(image);
  if (!validationResult.success) {
    // ... throw error with details
  }
  // ... custom validation
}
```

**Benefits:**

- Development: Full validation with helpful error messages
- Production: Skip validation overhead (assume files are pre-validated)

### Validation Criteria

- [ ] Invalid files throw clear Zod error messages with paths
- [ ] Circular references in hierarchy are detected
- [ ] Animation track controlId/layerId references are validated
- [ ] Valid files pass without errors
- [ ] Validation can be skipped in production builds
- [ ] Error messages help developers debug format issues

---

## Phase 4: Optimize Performance

### Goal

Improve rendering performance through profiling-driven optimizations.

### Tasks

#### 4.1 Profile Current Implementation

**Tools**: Chrome DevTools Performance tab, WebGL Inspector

Measure:

- Frame render time (target: <16ms for 60fps)
- JavaScript computation time vs GPU time
- Uniform upload overhead
- Memory allocation per frame

#### 4.2 Minimize Uniform Updates

**Files**: `src/player.ts`

Optimizations:

- Track which mutation values changed since last frame
- Only upload dirty values to GPU (use `gl.uniform2fv` with offset if possible)
- Batch updates: upload all changed values in single call

#### 4.3 Pre-compute Animation Mappings

**Files**: `src/prepareAnimation.ts`

At load time, build:

```typescript
{
  animationMutationMap: {
    [animationIndex]: number[]  // Indices of mutations affected by this animation
  }
}
```

This allows:

- Fast conflict detection (overlapping mutation sets)
- Targeted uniform updates (only affected mutations)

#### 4.4 Evaluate TypedArray Wrappers

**Files**: `src/buffer.ts`, `src/types.ts`

Question: Do `PreparedFloatBuffer` / `PreparedIntBuffer` wrappers add value?

- If yes: Keep for type safety
- If no: Replace with direct TypedArray usage, remove abstraction

#### 4.5 Document Optimizations

**Files**: New `PERFORMANCE.md`

Document:

- Profiling results (before/after)
- Optimization techniques used
- Performance characteristics (e.g., "100 layers @ 60fps")

### Validation Criteria

- [ ] Rendering achieves 60fps with demo scene
- [ ] Memory usage is stable (no leaks)
- [ ] Frame time profiling shows <16ms total
- [ ] Optimizations documented

---

## Phase 5: Streamline API and Internal Formats

### Goal

Clean up public API and internal data structures.

### Tasks

#### 5.1 Review PreparedImageDefinition

**Files**: `src/types.ts`

Remove unused fields from old format 1.x implementation:

- Audit all fields in `PreparedImageDefinition`
- Remove fields not used in new rendering pipeline
- Ensure structure matches what shaders expect

#### 5.2 Simplify Public API

**Files**: `src/index.ts`, `src/player.ts`

Public exports (confirm these are sufficient):

```typescript
// Functions
export { setupWebGL, prepareAnimation }

// Types
export type {
  GeppettoPlayer,
  AnimationControls,
  AnimationOptions,
  GeppettoImage,     // Input format
  PreparedImageDefinition  // Output format
}
```

Ensure API is intuitive:

```typescript
// Typical usage flow
const player = setupWebGL(canvas);
const animation = prepareAnimation(jsonData);
const controls = player.addAnimation(animation, texture, 0);
controls.startAnimation("MyAnim");
```

#### 5.3 Add JSDoc Comments

**Files**: All public API functions

Add comprehensive JSDoc:

- Parameter descriptions
- Return value descriptions
- Usage examples
- @throws documentation

#### 5.4 Update README

**Files**: `README.md`

Update with:

- Format 2.0 support (remove 1.x references)
- New simplified API usage
- Link to demo code
- Performance characteristics
- Migration guide from old player (if needed)

#### 5.5 Switch to Vite Build System

**Files**: New `vite.config.ts`, `package.json`, demo files

Migrate from Parcel to Vite for consistency with studio and modern best practices:

**Library build** (Vite library mode using Rollup):

- Create `vite.config.ts` with library mode configuration
- Configure entry point (`src/index.ts`)
- Set up output formats: ESM and CommonJS
- Configure external dependencies
- Generate TypeScript declarations

**Demo page** (Vite dev server):

- Move demo to use Vite dev server for HMR
- Update demo HTML/JS to work with Vite
- Configure dev server settings

**Benefits**:

- Same tooling as studio (easier maintenance)
- Vite library mode uses Rollup (industry standard for libraries)
- Fast dev server with HMR for demo development
- Better tree-shaking and optimization
- Modern build pipeline

Reference studio's `vite.config.ts` for configuration patterns.

### Validation Criteria

- [ ] API is self-documenting via TypeScript + JSDoc
- [ ] README has complete usage example
- [ ] No unused exports
- [ ] Types match implementation
- [ ] Vite builds library successfully (ESM + CJS)
- [ ] Demo page runs with Vite dev server
- [ ] Types match implementation

---

## Phase 6: Remove Format 1.x Support

### Goal

Remove all legacy format 1.x code to simplify codebase.

### Tasks

#### 6.1 Identify Format 1.x Code

**Files**: All source files

Search for:

- Old type definitions (format 1.x specific)
- Conditional logic checking format version
- Legacy shader code paths
- Old prepareAnimation logic

#### 6.2 Remove Legacy Code

Delete or replace:

- Old mutation application logic
- Format 1.x type definitions
- Version detection code
- Unused helper functions

#### 6.3 Update Tests

**Files**: `src/**/*.spec.ts`

- Remove format 1.x test cases
- Update tests to use format 2.0 structures
- Ensure test coverage for new implementation

### Validation Criteria

- [ ] No references to format 1.x in codebase
- [ ] All tests pass with format 2.0 only
- [ ] Bundle size reduced (less code)

---

## Testing Strategy

### Manual Validation via Demo

**Primary test**: `demo/main.js` with `demo/scenery.json`

Visual checks:

- ✅ All layers visible (no black areas)
- ✅ Sky gradient renders correctly (top-to-bottom fade)
- ✅ Waterwheel has tilt deformation
- ✅ Tree leaves have slight curve
- ✅ All elements positioned correctly
- ✅ No WebGL errors in console

Animation checks:

- ✅ Wheel rotation animation loops smoothly
- ✅ Tree sway animation plays
- ✅ Bird flight animation works
- ✅ Multiple animations run simultaneously
- ✅ Animations can be started/stopped via controls

Performance checks:

- ✅ Maintains 60fps during playback
- ✅ No frame drops when starting animations
- ✅ Memory usage stable over time

### Future: Automated Testing

Consider adding:

- Visual regression tests (screenshot comparison)
- Unit tests for mutation chain building
- Performance benchmarks (automated profiling)

---

## Success Criteria

### Phase 1 Complete ✅

- ✅ Demo renders correctly (matches studio output)
- ✅ No WebGL errors
- ✅ Mutation chains working
- ✅ Sky gradient visible (not black)
- ✅ Z-ordering correct
- ✅ All layers visible

### Phase 2 Complete

- Animations play smoothly
- All animation controls work
- Event callbacks fire correctly

### Phase 3 Complete

- Invalid files rejected with clear errors
- Validation doesn't impact performance

### Phase 4 Complete

- 60fps rendering with demo scene
- Optimizations documented
- Performance improvements measured

### Phase 5 Complete

- API is clean and well-documented
- README is up-to-date
- No unused code

### Phase 6 Complete

- Format 1.x code removed
- Tests passing
- Codebase simplified

### Overall Success

Player 2.0 correctly renders format 2.0 files with smooth animation playback, validated API, and documented performance characteristics.

---

## Current Status

**Phase**: 1 ✅ Complete | Phase 2 ⏭️ Next
**Last Updated**: January 8, 2026
**Current Branch**: `feature/player-2.0`

### Completed Work (Phase 1)

1. ✅ Ported mutation chain algorithm from studio (`createShapeMutationList`)
2. ✅ Simplified uniform structure (removed complex control processing)
3. ✅ Ported studio vertex and fragment shaders (mutatePoint/mutateOnce)
4. ✅ Updated WebGL uniform uploads in player.ts
5. ✅ Validated demo rendering - all criteria met

### Next Steps (Phase 2)

1. Implement animation state management (PlayStatus tracking)
2. Add mutation value updates from animation tracks
3. Implement keyframe interpolation with easing functions
4. Update control API (startAnimation, stopAnimation, setControlValue)
5. Validate animation playback with demo animations

---

## References

### Studio Implementation Files

- `packages/studio/src/application/modules/composition/programs/showComposition.ts` - Main rendering
- `packages/studio/src/infrastructure/webgl/programs/utils.ts` - Mutation chain building (`createShapeMutationList`)
- `packages/studio/src/infrastructure/webgl/shaders/vertexShader.ts` - Vertex shader
- `packages/studio/src/infrastructure/webgl/shaders/fragmentShader.ts` - Fragment shader
- `packages/studio/src/infrastructure/hierarchy/traverse.ts` - `visitHierarchy`, `getPreviousOfType`

### Player Files to Update

- `packages/player/src/prepareAnimation.ts` - Main refactor target
- `packages/player/src/player.ts` - WebGL rendering and animation playback
- `packages/player/src/traverse.ts` - Already has `visitHierarchy` and `getPreviousOfType`
- `packages/player/src/types.ts` - Type definitions
- `packages/player/src/shaders/` - Shader files
