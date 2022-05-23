// vim: ts=2:sw=2

#define MAX_MUT 60
#define PI_FRAC 0.017453292519943295

varying mediump vec4 vColor;
varying mediump vec4 vCircle;
varying mediump vec2 vViewport;
varying mediump float vActive;
uniform float mutation;
uniform float active;

uniform vec2 viewport;
uniform vec3 translate;
uniform vec3 basePosition;
uniform vec4 scale;

attribute vec2 coordinates;
attribute vec4 color;

mat4 viewportScale = mat4(
  2.0 / viewport.x, 0, 0, 0,
  0, -2.0 / viewport.y, 0, 0,
  0, 0, 1, 0,
  -1, +1, 0, 1
);

uniform vec2 uMutationValues[MAX_MUT];

vec2 getMutationValue(int mutationIndex, int mutationType) {
  return uMutationValues[mutationIndex];
}

// x = type, yz = origin, a = radius
uniform vec4 uMutationVectors[MAX_MUT];
uniform int uMutationParent[MAX_MUT];

mat3 mutateOnce(mat3 startValue, int mutationIndex) {
  vec4 mutation = uMutationVectors[mutationIndex];
  int mutationType = int(mutation.x);

  vec2 mutationValue = getMutationValue(mutationIndex, mutationType);
  vec2 origin = mutation.yz;

  vec3 result = startValue[0];
  vec3 color = startValue[1];
  vec3 effect = startValue[2];

  if (mutationType == 1) { // Translate
    float effect = 1.0;
    if (mutation.a > 0.0 && distance(result.xy, origin) > mutation.a) {
      effect = 0.0;
    }
    result = vec3(result.xy + mutationValue * effect, result.z);
  }

  if (mutationType == 2) { // Stretch
    result = vec3(origin.xy + vec2(
      (result.x - origin.x) * mutationValue.x,
      (result.y - origin.y) * mutationValue.y
    ), result.z);
  }

  if (mutationType == 3) { // Rotation
    float rotation = mutationValue.x * PI_FRAC;
    mat2 entityRotationMatrix = mat2(cos(rotation), sin(rotation), -sin(rotation), cos(rotation));
    result = vec3((result.xy - origin) * entityRotationMatrix + origin, result.z);
  }

  if (mutationType == 4) { // Deform
    float effect = 1.0 - clamp(distance(result.xy, origin), 0.0, mutation.a) / mutation.a;
    result = vec3(result.xy + mutationValue * effect, result.z);
  }

  if (mutationType == 5) { // Opacity
    result = vec3(result.xy, result.z * mutationValue.x);
  }

  if (mutationType == 6) { // Lightness
    color = vec3(mutationValue.x * color.x, color.yz);
  }

  if (mutationType == 7) { // Colorize setting
    effect = vec3(mutationValue.xy, effect.z);
  }

  if (mutationType == 8) { // Saturation
    color = vec3(color.x, mutationValue.x * color.y, color.z);
  }

  return mat3(
    result,
    color,
    effect
  );
}

mat3 mutatePoint(mat3 startValue, int mutationIndex) {
  int currentNode = mutationIndex;
  mat3 result = startValue;

  for(int i = 0; i < MAX_MUT; i++) {
    if (currentNode == -1) {
        return result;
    }
    result = mutateOnce(result, currentNode);
    currentNode = uMutationParent[currentNode];
  }
  return result;
}

void main() {
  vActive = active;
  mat3 start = mat3(
    translate.xy, 1.0,
    0, 0, 0,
    0, 0, 0
  );
  mat3 deform = mutatePoint(start, int(mutation));
  vec3 deformPos = deform[0];

  vec4 pos = viewportScale * vec4((deformPos.xy + basePosition.xy) * scale.x, translate.z, 1.0);

  int pointIndex = int(coordinates.x);
  float radius = abs(coordinates.y);

  vec2 spec = vec2(-1.0, -1.0);

  if (pointIndex == 1) {
    spec = vec2(1.0, -1.0);
  }

  if (pointIndex == 2) {
    spec = vec2(-1.0, 1.0);
  }

  if (pointIndex == 3) {
    spec = vec2(1.0, 1.0);
  }

  vec2 size = (vec4(spec.xy * radius, 1.0, 1.0) * viewportScale).xy;
  if (coordinates.y > 0.0) {
    size *= scale.y * scale.x;
  } else {
    size *= -coordinates.y;
    if (active > 0.9) {
      size *= 1.6;
    }
  }

  vec2 center = (pos.xy + scale.ba) * scale.y;

  gl_Position = vec4(center + size, pos.z - 1.0, 1.0);

  vCircle = vec4(center, abs(size.x), abs(size.y));

  vColor = color;
  vViewport = viewport;
}