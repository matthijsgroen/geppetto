// vim: ts=2:sw=2

uniform vec2 viewport;
uniform vec3 basePosition;
uniform vec3 translate;
uniform vec4 scale;

attribute vec2 coordinates;

varying vec2 vPosition;

mat4 viewportScale = mat4(
  2.0 / viewport.x, 0, 0, 0,
  0, -2.0 / viewport.y, 0, 0,
  0, 0, 1, 0,
  -1, +1, 0, 1
);

void main(void) {
  vPosition = coordinates;
  
  // Apply the same transformation as showComposition.vert
  vec4 pos = viewportScale * vec4((coordinates + basePosition.xy) * scale.x, translate.z, 1.0);
  gl_Position = vec4((pos.xy + scale.ba) * scale.y, pos.z, 1.0);
}
