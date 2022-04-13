attribute vec2 coordinates;
uniform mediump vec4 scale;

void main() {
  gl_Position = vec4((coordinates + scale.ba) * scale.y, 0.09, 1.0);
}