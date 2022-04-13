precision mediump float;

uniform mediump vec3 backgroundColor;
uniform mediump vec4 scale;
uniform mediump vec3 uViewport;

void main(void) {
  int xRow = int(mod(gl_FragCoord.x - uViewport.x, uViewport.z));
  int yRow = int(mod(gl_FragCoord.y - uViewport.y, uViewport.z));

  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  if (xRow == 0 || yRow == 0) {
    gl_FragColor = vec4(backgroundColor, 1.0);
  }
}