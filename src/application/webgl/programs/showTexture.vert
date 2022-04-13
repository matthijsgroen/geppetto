attribute vec2 coordinates;
attribute vec2 aTextureCoord;
varying lowp vec2 vTextureCoord;
uniform vec4 scale;

void main() {
  vTextureCoord = aTextureCoord.xy;
  gl_Position = vec4((coordinates + scale.ba) * scale.y, 0.1, 1.0);
}