@nomangle MAX_MUT MAX_IT uControlMutValues uMutValueIndices uControlMutIndices uControlValues
#define PI_FRAC 0.017453292519943295

uniform vec2 viewport;
uniform vec3 basePosition;
uniform vec3 translate;
uniform float mutation;
uniform vec4 scale;
uniform vec2 uMutValues[MAX_MUT];

// x = type, yz = origin, a = radius
uniform vec4 uMutVectors[MAX_MUT];
uniform int uMutParent[MAX_MUT];

attribute vec2 coordinates;
attribute vec2 aTextureCoord;

varying lowp vec2 vTextureCoord;
varying lowp float vOpacity;
varying lowp float vBrightness;
varying lowp float vSaturation;
varying lowp float vTargetHue;
varying lowp float vTargetSaturation;

mat4 viewportScale = mat4(
  2.0 / viewport.x, 0, 0, 0,
  0, -2.0 / viewport.y, 0, 0,
  0, 0, 1, 0,
  -1, +1, 0, 1
);

float mixHue(float a, float b, float factor) {
  float d = abs(a - b);

  float aCorrect = a;
  float bCorrect = b;

  if (a < b && abs(a + 1.0 - b) < d) {
    aCorrect = a + 1.0;
  }
  if (a > b && abs(b - a + 1.0) < d) {
    bCorrect = b + 1.0;
  }

  return mod(mix(aCorrect, bCorrect, factor), 1.0);
}

vec2 getMutationValue(int mutationIndex, int mutationType) {
  vec2 result = uMutValues[mutationIndex];
  vec2 controlMutations = uControlMutIndices[mutationIndex];
  int start = int(controlMutations.x);
  int steps = int(controlMutations.y);
  if (steps == 0) {
    return result;
  }
  for(int i = 0; i < MAX_IT; i++) {
    if (i < steps) {
      vec3 valueIndices = uMutValueIndices[start + i];
      // x = offset
      // y = control value index
      // z = stepType
      float controlValue = uControlValues[int(valueIndices.y)];

      int startIndex = int(floor(valueIndices.x + controlValue));
      int endIndex = int(ceil(valueIndices.x + controlValue));
      float mixFactor = controlValue - floor(controlValue);

      vec2 mutAValue = uControlMutValues[startIndex];
      vec2 mutBValue = uControlMutValues[endIndex];
      vec2 mutValue = mix(mutAValue, mutBValue, mixFactor);

      // Stretch & Opacity & Lightness & Saturation needs multiplication
      if (mutationType == 2 || mutationType == 5 || mutationType == 6 || mutationType == 8) { 
        result *= mutValue;
      } else 
      // Mixing hue values will be treated differently
      if (mutationType == 7) {
        result = vec2(
          mixHue(mutAValue[0], mutBValue[0], mixFactor),
          mutValue[1]
        );
      } else {
        result += mutValue;
      }

    } else {
      return result;
    }
  }

  return result;
}

mat3 mutateOnce(mat3 startValue, int mutationIndex) {
  vec4 mutation = uMutVectors[mutationIndex];
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
    currentNode = uMutParent[currentNode];
  }
  return result;
}

void main() {
  mat3 start = mat3(
    coordinates + translate.xy, 1.0,
    1.0, 1.0, 0,
    0, 0, 0
  );

  mat3 deform = mutatePoint(start, int(mutation));
  vec3 deformPos = deform[0];
  vec3 deformColor = deform[1];
  vec3 deformEffect = deform[2];

  vec4 pos = viewportScale * vec4((deformPos.xy + basePosition.xy) * scale.x, translate.z - basePosition.z, 1.0);
  gl_Position = vec4((pos.xy + scale.ba) * scale.y, pos.z, 1.0);
  vTextureCoord = aTextureCoord.xy;

  vOpacity = deformPos.z;
  vBrightness = deformColor.x;
  vSaturation = deformColor.y;
  vTargetHue = deformEffect.x;
  vTargetSaturation = deformEffect.y;
}
