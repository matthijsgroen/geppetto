// vim: ts=2:sw=2

varying lowp float selected;
varying lowp float vDarkMode;

void main(void) {
  lowp vec3 color = vec3(0.3125, 0.3125, 0.3125);
  if (vDarkMode < 0.9) {
    color = vec3(0.875, 0.875, 0.875);
  } else
  if (selected > 0.0 && vDarkMode < 0.9) {
    color = vec3(0.6875, 0.6875, 0.875);
  } else
  if (selected > 0.0 && vDarkMode > 0.9) {
    color = vec3(0.25, 0.5, 0.25);
  }

  gl_FragColor = vec4(color, 1.0);
}