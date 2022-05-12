// vim: ts=2:sw=2

precision mediump float;
varying mediump vec4 vColor;
varying mediump vec4 vCircle;
varying mediump vec2 vViewport;
varying mediump float vActive;

void main(void) {
  vec2 screenPos = ((gl_FragCoord.xy / (vViewport / 2.0)) - 1.0);

  float distX = abs(vCircle.x - screenPos.x) / vCircle.z;
  if (distX > 1.0 || distX < -1.0) discard;
  float distY = abs(vCircle.y - screenPos.y) / vCircle.a;
  if (distY > 1.0 || distY < -1.0) discard;

  vec2 quadPos = vec2(distX, distY);
  float distSquared = dot(quadPos, quadPos);

  if (distSquared > 1.0) discard;
  gl_FragColor = vec4(vColor.rgb * vColor.a, vColor.a);
  float alpha = vColor.a;
  // LightMode
  if (distSquared > 0.50 && alpha > 0.9 && vActive > 0.9) {
    gl_FragColor = vec4(0.6875, 0.6875, 0.875, alpha);
  }
  // DarkMode
  if (distSquared > 0.50 && alpha > 0.9 && vActive > 1.9) {
    gl_FragColor = vec4(0.25, 0.5, 0.25, alpha);
  }

  // Dark edge
  if (distSquared > 0.9 && alpha > 0.9) {
    gl_FragColor = vec4(vColor.rgb * alpha * (1.0 - 0.5 * distSquared), alpha);
  }
}