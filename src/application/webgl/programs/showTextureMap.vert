
attribute vec2 coordinates;
uniform vec4 viewport;
uniform vec4 scale;

mat4 viewportScale = mat4(
  2.0 / viewport.x, 0, 0, 0,   
  0, -2.0 / viewport.y, 0, 0,    
  0, 0, 1, 0,    
  -1, +1, 0, 1
);

void main() {
  vec4 pos = viewportScale * vec4((coordinates * scale.x) + viewport.ba, 0.0, 1.0);
  gl_Position = vec4((pos.xy  + scale.ba) * scale.y, pos.z, 1.0);
}