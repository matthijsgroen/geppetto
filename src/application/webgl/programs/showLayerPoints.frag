varying lowp float selected;

void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
  if (selected > 0.0) {
    gl_FragColor = vec4(1.0, 1.0, 0.4, 0.1);
  }
}